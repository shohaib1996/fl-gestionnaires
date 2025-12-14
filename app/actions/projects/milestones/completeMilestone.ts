"use server";

import { createClient } from "@/lib/supabase/client";
import { ActionResult } from "@/types/actions";

export async function completeMilestone(
  milestoneId: string
): Promise<ActionResult> {
  const supabase = createClient();

  const { error } = await supabase.rpc("complete_milestone", {
    p_milestone_id: milestoneId,
  });

  if (error) {
    console.error("completeMilestone error:", error);

    return {
      success: false,
      message: "Impossible de terminer le jalon",
    };
  }

  return {
    success: true,
    message: "Jalon terminé avec succès",
    data: null,
  };
}
