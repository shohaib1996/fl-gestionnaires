"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";

const PRESET_MILESTONES = [
  { title: "Diagnostic & Mise en conformité", order: 1 },
  { title: "Structuration financière", order: 2 },
  { title: "Argumentaire & Pitch", order: 3 },
  { title: "Post-investissement", order: 4 },
  { title: "Suivi & Croissance", order: 5 },
] as const;

export async function createPresetMilestones(input: {
  projectId: string;
  managerId: string;
}): Promise<ActionResult> {
  const supabase = await createClient();

  const results = [];
  const errors = [];

  // Create milestones sequentially to handle individual failures
  for (const milestone of PRESET_MILESTONES) {
    try {
      console.log(`Creating milestone: ${milestone.title}`);

      const { data, error } = await supabase.rpc("create_milestone", {
        p_project_id: input.projectId,
        p_title: milestone.title,
        p_description: undefined,
        p_start_date: undefined,
        p_end_date: undefined,
        p_start_time: undefined,
        p_end_time: undefined,
        p_priority: "normal",
        p_manager_id: input.managerId,
      });

      if (error) {
        console.error(`Failed to create milestone "${milestone.title}":`, error);
        errors.push({ title: milestone.title, error: error.message });
      } else {
        console.log(`Successfully created milestone: ${milestone.title}`);
        results.push(data);
      }
    } catch (error) {
      console.error(`Exception creating milestone "${milestone.title}":`, error);
      errors.push({
        title: milestone.title,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  if (errors.length > 0) {
    console.error("Some milestones failed to create:", errors);
  }

  return {
    success: results.length > 0,
    message: `Created ${results.length} of ${PRESET_MILESTONES.length} preset milestones`,
    data: { created: results, errors },
  };
}
