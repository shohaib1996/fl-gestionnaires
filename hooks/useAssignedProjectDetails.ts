"use client";

import {
  AssignedProjectDetails,
  getAssignedProjectDetails,
} from "@/app/actions/projects/getAssignedProjectDetails";
import { assignedProjectKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useAssignedProjectDetails(projectId: string) {
  return useQuery<AssignedProjectDetails>({
    queryKey: assignedProjectKeys.details(projectId),
    queryFn: async (): Promise<AssignedProjectDetails> => {
      const res = await getAssignedProjectDetails(projectId);

      if (!res.success) {
        throw new Error(res.message);
      }

      return res.data;
    },
    enabled: !!projectId,
    retry: false,
  });
}
