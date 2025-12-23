import { ProjectFilters } from "./projects";

/**
 * Apply common filters & pagination to a Supabase query
 * We intentionally do NOT type the query builder,
 * because supabase-js does not expose a stable public type for it.
 */
export function applyProjectFilters(query: any, filters: ProjectFilters) {
  /* STATUS */
  if (filters.status) {
    query = Array.isArray(filters.status)
      ? query.in("status", filters.status)
      : query.eq("status", filters.status);
  }

  /* SEARCH */
  if (filters.search?.trim()) {
    const q = `%${filters.search.trim()}%`;
    query = query.or(`title.ilike.${q},description.ilike.${q}`);
  }

  /* LOCATION */
  if (filters.location?.trim()) {
    query = query.ilike("project_city", `%${filters.location.trim()}%`);
  }

  /* CATEGORY */
  if (filters.category?.trim()) {
    query = query.contains("categories", [filters.category]);
  }

  /* IFL */
  if (filters.ifl?.trim()) {
    query = query.ilike("project_id", `%${filters.ifl.trim()}%`);
  }

  /* DATE RANGE */
  if (filters.fromDate) {
    query = query.gte("created_at", filters.fromDate);
  }
  if (filters.toDate) {
    query = query.lte("created_at", filters.toDate);
  }

  console.log("Filters", filters);
  /* PAGINATION */
  if (filters.page && filters.pageSize) {
    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;
    query = query.range(from, to);
  }

  return query;
}
