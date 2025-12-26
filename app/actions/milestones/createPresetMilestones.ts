"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";

type CreatePresetMilestonesResult = {
  created: any[];
  errors: {
    title: string;
    error: string;
  }[];
};

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
}): Promise<ActionResult<CreatePresetMilestonesResult>> {
  const supabase = await createClient();

  const results = [];
  const errors: CreatePresetMilestonesResult["errors"] = [];

  for (const milestone of PRESET_MILESTONES) {
    try {
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
        errors.push({ title: milestone.title, error: error.message });
      } else {
        results.push(data);
      }
    } catch (err) {
      errors.push({
        title: milestone.title,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return {
    success: results.length > 0,
    message: `Created ${results.length} of ${PRESET_MILESTONES.length} preset milestones`,
    data: { created: results, errors },
  };
}
