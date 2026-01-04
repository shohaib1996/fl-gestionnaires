"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAdminAccountRequests(searchQuery?: string) {
  const supabase = await createClient();

  try {
    // Build query with optional search
    let query = supabase
      .from("admin_account_requests")
      .select("*")
      .order("created_at", { ascending: false });

    // Add search filters if query is provided
    if (searchQuery && searchQuery.trim()) {
      const search = searchQuery.trim();
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data: requests, error } = await query;

    if (error) {
      console.error("Error fetching admin account requests:", error);
      return { error: error.message, requests: [] };
    }

    // For each request, get the corresponding user's role if they exist
    const requestsWithRoles = await Promise.all(
      (requests || []).map(async (request) => {
        if (request.status === "approved" && request.user_id) {
          const { data: user } = await supabase
            .from("users")
            .select("role")
            .eq("id", request.user_id)
            .single();

          return { ...request, userRole: user?.role || null };
        }
        return { ...request, userRole: null };
      })
    );

    return { requests: requestsWithRoles, error: null };
  } catch (err: any) {
    console.error("Error in getAdminAccountRequests:", err);
    return { error: err.message, requests: [] };
  }
}
