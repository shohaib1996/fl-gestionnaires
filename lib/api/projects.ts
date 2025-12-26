import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/types/role";
import { ProjectStatus } from "@/types/status";
import { applyProjectFilters } from "./applyProjectFilter";

export interface ProjectFilters {
  status?: ProjectStatus | ProjectStatus[];
  search?: string;
  fromDate?: string;
  toDate?: string;
  location?: string;
  category?: string;
  categories?: string[];
  name?: string;
  ifl?: string;
  date?: string;

  role: UserRole;
  userId?: string;

  page?: number;
  pageSize?: number;
}

export async function fetchReceivedProjects(filters: ProjectFilters) {
  const supabase = createClient();

  let query = supabase
    .from("projects")
    .select("*")
    .eq("status", "submitted")
    .order("created_at", { ascending: false });

  query = applyProjectFilters(query, filters);

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function fetchMyProjects(
  filters: ProjectFilters & { userId: string }
) {
  const supabase = createClient();

  let query = supabase
    .from("projects")
    .select(
      `
        *,
        claims!inner (
          claimed_by
        )
      `
    )
    .eq("claims.claimed_by", filters.userId)
    .eq("status", "claimed")
    .order("created_at", { ascending: false });

  query = applyProjectFilters(query, filters);

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function fetchInProgressProjects(
  filters: ProjectFilters & { userId?: string }
) {
  const supabase = createClient();

  let query = supabase
    .from("projects")
    .select(
      `
        *,
        claims!inner (
          claimed_by
        )
      `
    )
    .eq("status", "in_progress")
    .order("created_at", { ascending: false });

  if (filters.role === "admin") {
    if (!filters.userId) throw new Error("userId required");
    query = query.eq("claims.claimed_by", filters.userId);
  }

  query = applyProjectFilters(query, filters);

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function fetchClaimedProjects(filters: ProjectFilters) {
  const supabase = createClient();

  let query = supabase
    .from("projects")
    .select(
      `
        *,
        claims!inner (
          claimed_by
        )
      `
    )
    .eq("status", "claimed")
    .order("created_at", { ascending: false });

  query = applyProjectFilters(query, filters);

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function fetchReservedProjects(filters: ProjectFilters) {
  const supabase = createClient();

  let query = supabase
    .from("projects")
    .select("*")
    .eq("status", "reserved")
    .order("created_at", { ascending: false });

  query = applyProjectFilters(query, filters);

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}
