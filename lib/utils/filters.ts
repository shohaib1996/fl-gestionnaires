import { ProjectFilters } from "@/lib/api/projects";
import { ProjectSearchParams } from "@/types/searchParams";
import { ProjectStatus } from "@/types/status";

export function mapSearchParamsToFilters(
  params: ProjectSearchParams
): ProjectFilters {
  return {
    status: params.status
      ? (params.status.split(",") as ProjectStatus[])
      : undefined,
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 20,
    fromDate: params.fromDate,
    toDate: params.toDate,
    assignedTo: params.assignedTo,
  };
}
