import { getProjectMilestones } from "@/app/actions/milestones/getProjectMilestones";
import { milestoneKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useProjectMilestones(projectId: string) {
  return useQuery({
    queryKey: milestoneKeys.project(projectId),
    queryFn: async () => {
      const res = await getProjectMilestones(projectId);

      if (!res.success) {
        throw new Error(res.message);
      }

      return res.data;
    },
  });
}
