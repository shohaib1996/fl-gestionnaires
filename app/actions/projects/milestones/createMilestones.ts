"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";
import type { Database } from "@/types/supabase";

type MilestoneRow = Database["public"]["Tables"]["milestones"]["Row"];

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
}): Promise<ActionResult<MilestoneRow>> {
  const supabase = await createClient();

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
    return {
      success: false,
      message: "Impossible de créer le jalon",
    };
  }

  if (!data) {
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
