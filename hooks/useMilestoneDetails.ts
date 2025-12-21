"use client";

import { getMilestoneDetails } from "@/app/actions/milestones/actions";
import { useQuery } from "@tanstack/react-query";

export function useMilestoneDetails(milestoneId?: string) {
  return useQuery({
    queryKey: ["milestone-details", milestoneId],
    queryFn: () => getMilestoneDetails(milestoneId!),
    enabled: !!milestoneId,
  });
}
