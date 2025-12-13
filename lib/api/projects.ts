import { createClient } from "@/lib/supabase/client";
import type { ProjectRow } from "@/types/db";
import { ProjectStatus } from "@/types/status";

export interface ProjectFilters {
  status?: ProjectStatus | ProjectStatus[];
  search?: string;
  fromDate?: string;
  toDate?: string;
  location?: string;
  category?: string;
  name?: string;
  ifl?: string;
  assignedTo?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchProjects(
  filters: ProjectFilters = {}
): Promise<ProjectRow[]> {
  const supabase = createClient();

  let query = supabase.from("projects").select("*");

  /* ---------------------------
   * STATUS
   * --------------------------- */
  if (filters.status) {
    if (Array.isArray(filters.status)) {
      query = query.in("status", filters.status);
    } else {
      query = query.eq("status", filters.status);
    }
  }

  /* ---------------------------
   * GENERIC SEARCH
   * --------------------------- */
  if (filters.search?.trim()) {
    const q = `%${filters.search.trim()}%`;
    query = query.or(`title.ilike.${q},description.ilike.${q}`);
  }

  /* ---------------------------
   * LOCATION
   * --------------------------- */
  if (filters.location?.trim()) {
    query = query.ilike("project_city", `%${filters.location.trim()}%`);
  }

  /* ---------------------------
   * CATEGORY
   * --------------------------- */
  if (filters.category?.trim()) {
    // if category is text[]
    query = query.contains("categories", [filters.category]);

    // ⚠️ If category is TEXT (not array), use instead:
    // query = query.ilike("category", `%${filters.category.trim()}%`);
  }

  /* ---------------------------
   * NAME (project title / owner)
   * --------------------------- */
  if (filters.name?.trim()) {
    const q = `%${filters.name.trim()}%`;
    query = query.ilike("title", q);
  }

  /* ---------------------------
   * IFL IDENTIFIER
   * --------------------------- */
  if (filters.ifl?.trim()) {
    query = query.ilike("project_id", `%${filters.ifl.trim()}%`);
  }

  /* ---------------------------
   * DATE RANGE
   * --------------------------- */
  if (filters.fromDate) {
    query = query.gte("created_at", filters.fromDate);
  }
  if (filters.toDate) {
    query = query.lte("created_at", filters.toDate);
  }

  /* ---------------------------
   * ASSIGNED ADMIN
   * --------------------------- */
  if (filters.assignedTo) {
    query = query.eq("assigned_to", filters.assignedTo);
  }

  /* ---------------------------
   * PAGINATION
   * --------------------------- */
  if (filters.page && filters.pageSize) {
    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;
    query = query.range(from, to);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) throw error;

  return data ?? [];
}
