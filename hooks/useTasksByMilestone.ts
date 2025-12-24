"use client";

import { getTasksByMilestone } from "@/app/actions/tasks/getTasksByMilestone";
import { useQuery } from "@tanstack/react-query";

export const taskKeys = {
  byMilestone: (milestoneId: string) =>
    ["tasks", "milestone", milestoneId] as const,
};

export function useTasksByMilestone(
  milestoneId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: taskKeys.byMilestone(milestoneId),
    queryFn: async () => {
      console.log("milestoneId", milestoneId);
      const res = await getTasksByMilestone(milestoneId);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    enabled: options?.enabled ?? !!milestoneId,
  });
}
