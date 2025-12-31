"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";
import { createPresetMilestones } from "../milestones/createPresetMilestones";

export async function assignProjectToAdmin(
  projectId: string,
  adminId: string
): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    // 1. Check if project is already claimed
    const { data: existingClaim } = await supabase
      .from("claims")
      .select("id")
      .eq("project_id", projectId)
      .single();

    if (existingClaim) {
      return {
        success: false,
        message: "This project is already assigned to an admin",
      };
    }

    // 2. Create claim record
    const { error: claimError } = await supabase.from("claims").insert({
      project_id: projectId,
      claimed_by: adminId,
    });

    if (claimError) {
      console.error("Claim error:", claimError);
      return {
        success: false,
        message: "Failed to create claim record",
      };
    }

    // 3. Update project status to 'in_progress' so admin can start working immediately
    const { error: updateError } = await supabase
      .from("projects")
      .update({ status: "in_progress" })
      .eq("id", projectId);

    if (updateError) {
      console.error("Update error:", updateError);
      // Rollback: delete the claim if status update fails
      await supabase.from("claims").delete().eq("project_id", projectId);

      return {
        success: false,
        message: "Failed to update project status",
      };
    }

    // 4. Create project_assignments record so admin can access the project
    const { error: assignmentError } = await supabase
      .from("project_assignments")
      .insert({
        project_id: projectId,
        user_id: adminId,
        is_active: true,
      });

    if (assignmentError) {
      console.error("Assignment error:", assignmentError);
      // Rollback: delete the claim and revert status
      await supabase.from("claims").delete().eq("project_id", projectId);
      await supabase
        .from("projects")
        .update({ status: "submitted" })
        .eq("id", projectId);

      return {
        success: false,
        message: "Failed to create project assignment record",
      };
    }

    // 5. Create preset milestones for the assigned admin
    const milestonesResult = await createPresetMilestones({
      projectId,
      managerId: adminId,
    });

    if (!milestonesResult.success) {
      console.error("Failed to create preset milestones:", milestonesResult.message);
      // Don't fail the entire assignment if milestones fail - just log it
    }

    return {
      success: true,
      data: null,
      message: "Project successfully assigned to admin and ready for work",
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}
