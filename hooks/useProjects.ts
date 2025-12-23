"use client";

import { ProjectRow } from "@/types/db";
import { UserRole } from "@/types/role";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  fetchClaimedProjects,
  fetchInProgressProjects,
  fetchMyProjects,
  fetchReceivedProjects,
  ProjectFilters,
} from "@/lib/api/projects";
import { DashboardFilters, DashboardTab } from "@/types/dashboard";

interface UseProjectsParams {
  tab: DashboardTab;
  role: UserRole;
  userId?: string;
  enabled?: boolean;
  filters?: DashboardFilters;
}

export function useProjects({
  tab,
  role,
  userId,
  enabled = true,
  filters,
}: UseProjectsParams) {
  const projectFilters: ProjectFilters = {
    ...filters,
    role,
    userId,
  };

  return useQuery<ProjectRow[], Error>({
    queryKey: ["projects", tab, role, userId, filters],
    enabled,

    queryFn: async () => {
      switch (tab) {
        case "recu":
          return fetchReceivedProjects(projectFilters);

        case "mes-projets":
          if (role === "admin") {
            if (!userId) {
              throw new Error("userId is required for admin mes-projets");
            }

            return fetchMyProjects({
              ...projectFilters,
              userId,
            });
          }

          return fetchClaimedProjects(projectFilters);

        case "encours":
          return fetchInProgressProjects(projectFilters);

        default:
          return [];
      }
    },

    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}
