"use client";

import { getTasksByMilestone } from "@/app/actions/projects/milestones/tasks/getTasksByMilestone";
import { useQuery } from "@tanstack/react-query";

export const taskKeys = {
  byMilestone: (milestoneId: string) =>
    ["tasks", "milestone", milestoneId] as const,
};

export function useTasksByMilestone(milestoneId: string) {
  return useQuery({
    queryKey: taskKeys.byMilestone(milestoneId),
    queryFn: async () => {
      const res = await getTasksByMilestone(milestoneId);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    enabled: !!milestoneId,
  });
}
