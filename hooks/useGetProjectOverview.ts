import {
  getProjectOverview,
  type ProjectOverview,
} from "@/app/actions/getProjectOverview";
import { useQuery } from "@tanstack/react-query";

const ONE_DAY = 1000 * 60 * 60 * 24;

export function useProjectOverview() {
  return useQuery<ProjectOverview>({
    queryKey: ["project-overview"],
    queryFn: getProjectOverview,
    staleTime: ONE_DAY,
    gcTime: ONE_DAY, // React Query v5
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
