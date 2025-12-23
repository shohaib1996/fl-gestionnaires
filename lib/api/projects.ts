import { createClient } from "@/lib/supabase/client";
import type { ProjectRow } from "@/types/db";
import { UserRole } from "@/types/role";
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

  role: UserRole;
  userId?: string;

  page?: number;
  pageSize?: number;
}

export async function fetchProjects(
  filters: ProjectFilters
): Promise<ProjectRow[]> {
  const supabase = createClient();

  let query = supabase.from("projects").select(
    `
        *,
        assignments:project_assignments (
          user_id
        ),
        claims!inner (
        claimed_by
        )
      `
  );

  /* --------------------------------
   * ROLE / VISIBILITY (CRITICAL)
   * -------------------------------- */
  if (filters.role === "admin") {
    if (!filters.userId) {
      throw new Error("userId is required for admin role");
    }

    // Admin → ONLY projects claimed by himself
    query = query.eq("claims.claimed_by", filters.userId);
  }

  /* ---------------------------
   * STATUS
   * --------------------------- */
  if (filters.status) {
    query = Array.isArray(filters.status)
      ? query.in("status", filters.status)
      : query.eq("status", filters.status);
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
    query = query.contains("categories", [filters.category]);
  }

  /* ---------------------------
   * NAME
   * --------------------------- */
  if (filters.name?.trim()) {
    query = query.ilike("title", `%${filters.name.trim()}%`);
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

export async function fetchReceivedProjects() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "submitted")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchMyProjects({ userId }: { userId: string }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        *,
        claims!inner (
          claimed_by
        )
      `
    )
    .eq("claims.claimed_by", userId)
    .eq("status", "claimed")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchInProgressProjects({
  role,
  userId,
}: {
  role: UserRole;
  userId?: string;
}) {
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

  if (role === "admin") {
    if (!userId) throw new Error("userId required for admin");
    query = query.eq("claims.claimed_by", userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function fetchClaimedProjects() {
  const supabase = createClient();

  const { data, error } = await supabase
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

  if (error) throw error;
  return data ?? [];
}
