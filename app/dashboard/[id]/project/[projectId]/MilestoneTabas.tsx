import { getTasksByMilestone } from "@/app/actions/projects/milestones/tasks/getTasksByMilestone";
import { taskKeys } from "@/hooks/useTasksByMilestone";
import { useQueryClient } from "@tanstack/react-query";

interface Milestone {
  id: string;
  title: string;
  status: string;
}

interface Props {
  milestones: Milestone[];
  activeMilestoneId: string | null;
  onChange: (milestoneId: string) => void;
}

export function MilestoneTabs({
  milestones,
  activeMilestoneId,
  onChange,
}: Props) {
  const queryClient = useQueryClient();

  return (
    <div className="flex gap-3 border-b">
      {milestones.map((m, ind) => {
        const active = m.id === activeMilestoneId;

        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`rounded-xs text-sm font-medium py-2 cursor-pointer ${
              active
                ? "bg-[#63A053] text-white"
                : "bg-[#A2CF96] text-gray-800 dark:text-gray-200"
            }`}
            onMouseEnter={() => {
              queryClient.prefetchQuery({
                queryKey: taskKeys.byMilestone(m.id),
                queryFn: async () => {
                  const res = await getTasksByMilestone(m.id);
                  if (!res.success) throw new Error(res.message);
                  return res.data;
                },
              });
            }}
          >
            <span className="bg-[#A2CF96] p-2.5 border-r text-white">
              {ind + 1}.
            </span>
            <span className="px-2.5 text-white capitalize">{m.title}</span>
          </button>
        );
      })}
    </div>
  );
}
