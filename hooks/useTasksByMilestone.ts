"use client";

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
      const response = await fetch(`/api/tasks/${milestoneId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    enabled: options?.enabled ?? !!milestoneId,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
}
