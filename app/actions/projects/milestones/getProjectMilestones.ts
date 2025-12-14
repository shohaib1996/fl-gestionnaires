"use server";

import { createClient } from "@/lib/supabase/client";
import { ActionResult } from "@/types/actions";

export async function getProjectMilestones(
  projectId: string
): Promise<ActionResult> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("project_id", projectId)
    .order("order_index");

  if (error) {
    console.error("getProjectMilestones error:", error);

    return {
      success: false,
      message: "Impossible de charger les jalons",
    };
  }

  return {
    success: true,
    message: "Jalons chargés",
    data: data ?? [],
  };
}
