"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export interface Claimer {
  fullName: string;
  email: string;
  avatarURL: string | null;
}

export interface GetProjectByIdResult {
  data:
    | (ProjectRow & {
        claimer: Claimer | null;
      })
    | null;
  error: string | null;
}

export async function getProjectById(
  id: string
): Promise<GetProjectByIdResult> {
  if (!id) {
    return {
      data: null,
      error: "Project id is required",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        *,
        claimer:claims (
          claimed_at,
          user:users (
            id,
            fullName,
            email,
            avatarURL
          )
        )
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("❌ getProjectById error:", error);

    return {
      data: null,
      error: error.message,
    };
  }

  if (!data) {
    return {
      data: null,
      error: "Project not found",
    };
  }

  const claimer: Claimer | null = data.claimer?.user
    ? {
        fullName: data.claimer.user.fullName ?? "",
        email: data.claimer.user.email,
        avatarURL: data.claimer.user.avatarURL ?? null,
      }
    : null;

  const { ...project } = data;

  return {
    data: {
      ...project,
      claimer,
    },
    error: null,
  };
}

export async function rejectClaim(projectId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  // Verify super_admin role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userError || !userData || userData.role !== "super_admin") {
    return { success: false, message: "Unauthorized: Super Admin only" };
  }

  // Get the claim that needs to be deleted
  const { data: claimData, error: claimFetchError } = await supabase
    .from("claims")
    .select("id")
    .eq("project_id", projectId)
    .single();

  if (claimFetchError) {
    return {
      success: false,
      message: `Failed to fetch claim: ${claimFetchError.message}`,
    };
  }

  // Step 1: Use release_project RPC first to update project properly
  // This should change claim_id to a default value
  const { error: releaseError } = await supabase.rpc("release_project", {
    p_project_id: projectId,
  });

  if (releaseError) {
    return {
      success: false,
      message: `Failed to release project: ${releaseError.message}`,
    };
  }

  // Step 2: Explicitly set the project status to 'submitted' and reset claim_count to 0
  const { error: updateError } = await supabase
    .from("projects")
    .update({
      status: "submitted",
      claim_count: 0
    })
    .eq("id", projectId);

  if (updateError) {
    return {
      success: false,
      message: `Failed to update project status: ${updateError.message}`,
    };
  }

  // Step 3: Now delete the claim record
  const { error: deleteError } = await supabase
    .from("claims")
    .delete()
    .eq("id", claimData.id);

  if (deleteError) {
    return {
      success: false,
      message: `Failed to delete claim: ${deleteError.message}`,
    };
  }

  revalidatePath(`/dashboard/${projectId}`);
  revalidatePath("/dashboard");

  return { success: true };
}

export async function declineProject(projectId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  // Verify super_admin role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userError || !userData || userData.role !== "super_admin") {
    return { success: false, message: "Unauthorized: Super Admin only" };
  }

  // Check current project status
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("status")
    .eq("id", projectId)
    .single();

  if (projectError) {
    return {
      success: false,
      message: `Failed to fetch project: ${projectError.message}`,
    };
  }

  if (project.status === "declined") {
    return {
      success: false,
      message: "Project is already declined",
    };
  }

  // Update project status to 'declined'
  const { error: updateError } = await supabase
    .from("projects")
    .update({ status: "declined" })
    .eq("id", projectId);

  if (updateError) {
    return {
      success: false,
      message: `Failed to decline project: ${updateError.message}`,
    };
  }

  revalidatePath(`/dashboard/${projectId}`);
  revalidatePath("/dashboard");

  return { success: true };
}

export async function reserveProject(projectId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  // Verify super_admin role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userError || !userData || userData.role !== "super_admin") {
    return { success: false, message: "Unauthorized: Super Admin only" };
  }

  // Check current project status
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("status")
    .eq("id", projectId)
    .single();

  if (projectError) {
    return {
      success: false,
      message: `Failed to fetch project: ${projectError.message}`,
    };
  }

  if (project.status === "reserved") {
    return {
      success: false,
      message: "Project is already reserved",
    };
  }

  // Update project status to 'reserved'
  const { error: updateError } = await supabase
    .from("projects")
    .update({ status: "reserved" })
    .eq("id", projectId);

  if (updateError) {
    return {
      success: false,
      message: `Failed to reserve project: ${updateError.message}`,
    };
  }

  revalidatePath(`/dashboard/${projectId}`);
  revalidatePath("/dashboard");

  return { success: true };
}
