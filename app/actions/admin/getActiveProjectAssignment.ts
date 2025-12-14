"use server";

import { createClient } from "@/lib/supabase/client";

export async function getActiveProjectAssignment(projectId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("project_assignments")
    .select(
      `
      id,
      assigned_at,
      user:users (
        id,
        fullName,
        email
      )
    `
    )
    .eq("project_id", projectId)
    .eq("is_active", true)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("getActiveProjectAssignment error:", error);
    throw new Error("Failed to load project assignment");
  }

  return data ?? null;
}
