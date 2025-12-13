"use client";

import { fetchProjects, ProjectFilters } from "@/lib/api/projects";
import { ProjectRow } from "@/types/db";
import { useQuery } from "@tanstack/react-query";

export function useProjects(filters: ProjectFilters) {
  return useQuery<ProjectRow[], Error>({
    queryKey: ["projects", filters],
    queryFn: () => fetchProjects(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
  });
}
