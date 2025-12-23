"use client";

import { ProjectRow } from "@/types/db";
import { UserRole } from "@/types/role";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  fetchClaimedProjects,
  fetchInProgressProjects,
  fetchMyProjects,
  fetchReceivedProjects,
} from "@/lib/api/projects";
import { DashboardTab } from "@/types/dashboard";

interface UseProjectsParams {
  tab: DashboardTab;
  role: UserRole;
  userId?: string;
  enabled?: boolean;
}

export function useProjects({
  tab,
  role,
  userId,
  enabled = true,
}: UseProjectsParams) {
  return useQuery<ProjectRow[], Error>({
    queryKey: ["projects", tab, role, userId],
    enabled,

    queryFn: async () => {
      switch (tab) {
        case "recu":
          // both admin & super admin
          return fetchReceivedProjects();

        case "mes-projets":
          console.log(role);
          if (role === "admin") {
            if (!userId) return [];
            // ✅ admin → own claimed
            return fetchMyProjects({ userId });
          }

          // ✅ super admin → ALL claimed
          return fetchClaimedProjects(); // ⬅️ NEW

        case "encours":
          // admin → own in_progress
          // super admin → all in_progress
          return fetchInProgressProjects({ role, userId });

        default:
          return [];
      }
    },

    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}
