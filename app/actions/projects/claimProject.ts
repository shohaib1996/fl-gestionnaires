"use server";

import { createClient } from "@/lib/supabase/server";

export async function claimProject(projectId: string, userId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("claims").insert({
    project_id: projectId,
    claimed_by: userId,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error: "You have already claimed this project before",
      };
    }

    return { ok: false, error: "Failed to claim project" };
  }

  return { ok: true };
}
