import { getProjectMilestones } from "@/app/actions/projects/milestones/getProjectMilestones";
import { useQuery } from "@tanstack/react-query";

export const milestoneKeys = {
  all: ["milestones"] as const,
  project: (projectId: string) => [...milestoneKeys.all, projectId] as const,
};

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
