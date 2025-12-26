"use server";
import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";
import { createPresetMilestones } from "../milestones/createPresetMilestones";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/* ----------------------------------
   CLAIM PROJECT (ADMIN ONLY)
----------------------------------- */
export async function claimProject({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}): Promise<ActionResult> {
  const supabase = await createClient();
  /* 1️⃣ Check project status */
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("status")
    .eq("id", projectId)
    .single();

  if (projectError) {
    return {
      success: false,
      message: projectError.message,
    };
  }

  if (project.status !== "submitted") {
    return {
      success: false,
      message: "Project cannot be claimed at this stage.",
    };
  }

  /* 2️⃣ Try to insert claim */
  const { error: claimError } = await supabase.from("claims").insert({
    project_id: projectId,
    claimed_by: userId,
  });

  /* UNIQUE constraint hit → already claimed */
  if (claimError?.code === "23505") {
    return {
      success: false,
      message: "Project already claimed by another admin.",
    };
  }

  if (claimError) {
    return {
      success: false,
      message: claimError.message,
    };
  }

  /* 3️⃣ Update project status */
  const { error: statusError } = await supabase
    .from("projects")
    .update({ status: "claimed" })
    .eq("id", projectId);

  if (statusError) {
    return {
      success: false,
      message: statusError.message,
    };
  }

  return {
    success: true,
    data: { projectId, userId },
  };
}

/* ----------------------------------
   DECLINE PROJECT (SUPER ADMIN)
----------------------------------- */
export async function declineProject(projectId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .update({ status: "declined" })
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    data,
  };
}

/* ----------------------------------
   SMART APPROVE (SUPER ADMIN)
----------------------------------- */

export async function approveProject(projectId: string): Promise<ActionResult> {
  const supabase = await createClient();

  /* 1️⃣ Fetch project */
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, email, status")
    .eq("id", projectId)
    .single();

  if (projectError) {
    return { success: false, message: projectError.message };
  }

  if (project.status !== "claimed") {
    return {
      success: false,
      message: "Project cannot be approved at this stage.",
    };
  }

  /* 2️⃣ Get claimer (CRITICAL PART) */
  const { data: claim, error: claimError } = await supabase
    .from("claims")
    .select("claimed_by")
    .eq("project_id", projectId)
    .single();

  if (claimError || !claim) {
    return {
      success: false,
      message: "No claimer found for this project.",
    };
  }

  const claimerId = claim.claimed_by;

  /* 3️⃣ Invite project owner if needed */
  // TODO: Implement SendGrid invitation system
  // For now, skipping invitation - will be implemented with SendGrid later

  // Optional: Log that invitation was skipped
  if (project.email) {
    console.log(`Skipping invitation for ${project.email} - SendGrid not yet implemented`);
  }

  /* 4️⃣ Assign project to claimer */
  const { error: assignError } = await supabase.rpc("assign_project", {
    p_project_id: projectId,
    p_user_id: claimerId,
    p_assigned_by: claimerId, // or auth.uid() if you want
  });

  if (assignError) {
    return {
      success: false,
      message: "Failed to assign project to claimer.",
    };
  }

  /* 5️⃣ Move project to in_progress */
  const { error: updateError } = await supabase
    .from("projects")
    .update({ status: "in_progress" })
    .eq("id", projectId);

  if (updateError) {
    return {
      success: false,
      message: updateError.message,
    };
  }

  /* 6️⃣ Create preset milestones */
  const milestonesResult = await createPresetMilestones({
    projectId,
    managerId: claimerId,
  });

  if (!milestonesResult.success) {
    console.error("Failed to create preset milestones:", milestonesResult.message);
    // Don't fail the entire approval if milestones fail - just log it
  }

  return {
    success: true,
    data: { projectId, claimerId },
    message: "Project approved and assigned successfully.",
  };
}
