import { getProjectSidebarOverview } from "@/app/actions/getProjectSidebarOverview";
import type { ProjectSidebarOverview } from "@/types/project-overview";
import { useQuery } from "@tanstack/react-query";

const FIVE_MIN = 1000 * 60 * 5;

export function useProjectSidebarOverview(projectId: string) {
  return useQuery<ProjectSidebarOverview>({
    queryKey: ["project-sidebar-overview", projectId],
    queryFn: () => getProjectSidebarOverview(projectId),
    enabled: !!projectId,
    staleTime: FIVE_MIN,
    gcTime: FIVE_MIN,
    refetchOnWindowFocus: false,
  });
}
