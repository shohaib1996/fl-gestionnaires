"use server";

import { createClient } from "@/lib/supabase/client";
import { ActionResult } from "@/types/actions";

export async function activateMilestone(
  milestoneId: string
): Promise<ActionResult> {
  const supabase = createClient();

  const { error } = await supabase.rpc("activate_milestone", {
    p_milestone_id: milestoneId,
  });

  if (error) {
    console.error("activateMilestone error:", error);

    return {
      success: false,
      message: "Impossible d’activer le jalon",
    };
  }

  return {
    success: true,
    message: "Jalon activé",
    data: null,
  };
}
