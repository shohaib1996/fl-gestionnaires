import { createClient } from "@/lib/supabase/client";
import { ProjectRow } from "@/types/db";
import { ProjectStatus } from "@/types/status";

export interface ProjectFilters {
  status?: ProjectStatus | ProjectStatus[];
  search?: string;
  fromDate?: string;
  toDate?: string;
  assignedTo?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchProjects(
  filters: ProjectFilters = {}
): Promise<ProjectRow[]> {
  const supabase = createClient();

  let query = supabase.from("projects").select("*");

  // status filter
  if (filters.status) {
    if (Array.isArray(filters.status)) {
      query = query.in("status", filters.status);
    } else {
      query = query.eq("status", filters.status);
    }
  }

  // search
  if (filters.search?.trim()) {
    const q = `%${filters.search.trim()}%`;
    query = query.or(`title.ilike.${q},description.ilike.${q}`);
  }

  // date range
  if (filters.fromDate) {
    query = query.gte("created_at", filters.fromDate);
  }
  if (filters.toDate) {
    query = query.lte("created_at", filters.toDate);
  }

  // assigned admin
  if (filters.assignedTo) {
    query = query.eq("assigned_to", filters.assignedTo);
  }

  // pagination
  if (filters.page && filters.pageSize) {
    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;
    query = query.range(from, to);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}
