"use server";

import { createClient } from "@/lib/supabase/client";
import { ActionResult } from "@/types/actions";

export async function createMilestone(input: {
  projectId: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  priority?: "low" | "normal" | "high";
  managerId?: string;
}): Promise<ActionResult> {
  const supabase = createClient();

  console.log(input);

  const { data, error } = await supabase.rpc("create_milestone", {
    p_project_id: input.projectId,
    p_title: input.title,
    p_description: input.description,
    p_start_date: input.startDate,
    p_end_date: input.endDate,
    p_start_time: input.startTime,
    p_end_time: input.endTime,
    p_priority: input.priority ?? "normal",
    p_manager_id: input.managerId,
  });

  if (error) {
    console.error("createMilestone error:", error);

    return {
      success: false,
      message: "Impossible de créer le jalon",
    };
  }

  return {
    success: true,
    message: "Jalon créé avec succès",
    data,
  };
}
