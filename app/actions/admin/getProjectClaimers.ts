"use server";
import { createClient } from "@/lib/supabase/server";

export interface ProjectClaimer {
  id: string; // claim id
  claimed_at: string; // ISO timestamp
  user: {
    id: string;
    fullName: string | null;
    email: string | null;
  };
}

export async function getProjectClaimers(projectId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("claims")
    .select(
      `
      id,
      claimed_at,
      user:users (
        id,
        fullName,
        email
      )
    `
    )
    .eq("project_id", projectId)
    .order("claimed_at", { ascending: false });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data };
}
