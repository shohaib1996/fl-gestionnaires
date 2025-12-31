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

  /* LOCATION (Province) */
  if (filters.location?.trim()) {
    query = query.eq("province", filters.location.trim());
  }

  /* CATEGORY - Multi-select */
  if (filters.categories && filters.categories.length > 0) {
    // Filter projects that have ANY of the selected categories
    // Using overlaps to check if the project's categories array overlaps with selected categories
    query = query.overlaps("categories", filters.categories);
  }

  /* NAME (Title) - Case insensitive search */
  if (filters.name?.trim()) {
    query = query.ilike("title", `%${filters.name.trim()}%`);
  }

  /* IFL */
  if (filters.ifl?.trim()) {
    query = query.ilike("project_id", `%${filters.ifl.trim()}%`);
  }

  /* DATE FILTER */
  if (filters.date?.trim()) {
    // Filter for specific date - match all records created on this date
    const selectedDate = filters.date.trim();
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split("T")[0];

    query = query.gte("created_at", selectedDate).lt("created_at", nextDayStr);
  }

  /* DATE RANGE (if needed for other features) */
  if (filters.fromDate) {
    query = query.gte("created_at", filters.fromDate);
  }
  if (filters.toDate) {
    query = query.lte("created_at", filters.toDate);
  }

  /* PAGINATION */
  if (filters.page && filters.pageSize) {
    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;
    query = query.range(from, to);
    console.log("pagination");
  }

  return query;
}
