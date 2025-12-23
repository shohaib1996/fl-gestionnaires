"use server";
import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";

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

  /* IMPORTANT: email must exist */
  if (!project.email) {
    return {
      success: false,
      message: "Project owner email is missing.",
    };
  }

  /* 2️⃣ Check if user exists */
  const { data: userExists, error: rpcError } = await supabase.rpc(
    "check_user_exists_by_email",
    { email_input: project.email }
  );

  if (rpcError) {
    return {
      success: false,
      message: rpcError.message,
    };
  }

  /* 3️⃣ Invite if user does not exist */
  if (!userExists) {
    const inviteRes = await fetch(`${APP_URL}/api/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: project.email }),
    });

    if (!inviteRes.ok) {
      return {
        success: false,
        message: "Failed to send account invitation.",
      };
    }
  }

  /* 4️⃣ Move project to in_progress */
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

  return {
    success: true,
    data: project,
  };
}
