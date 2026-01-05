import { getTasksByMilestone } from "@/app/actions/tasks/getTasksByMilestone";
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
  onChange: (milestone: Milestone) => void;
  onTitleClick?: (milestone: Milestone) => void;
}

export function MilestoneTabs({
  milestones,
  activeMilestoneId,
  onChange,
  onTitleClick,
}: Props) {
  const queryClient = useQueryClient();

  return milestones.map((m, ind) => {
    const active = m.id === activeMilestoneId;

    return (
      <div
        key={m.id}
        className={`rounded-xs text-sm font-medium cursor-pointer flex ${
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
        <span
          onClick={() => onChange(m)}
          className="bg-[#A2CF96] py-1.5 px-3 text-white cursor-pointer"
        >
          {ind + 1}.
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            if (onTitleClick) {
              onTitleClick(m);
            } else {
              onChange(m);
            }
          }}
          className="py-1.5 px-2 text-white capitalize cursor-pointer text-[0.875rem]"
        >
          {m.title}
        </span>
      </div>
    );
  });
}
