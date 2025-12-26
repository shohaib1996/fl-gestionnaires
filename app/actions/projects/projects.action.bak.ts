import { revalidatePath } from "next/cache";

// ... existing code ...

export async function rejectClaim(projectId: string, claimId: string) {
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

  // 1. Delete the claim FIRST using project_id (OneToOne relationship guarantees unique claim per project)
  // We delete first to avoid FK constraint issues if projects.claim_id is NOT enforcing strict referential integrity OR if we need to clear strict integrity from child.
  // Actually, if projects.claim_id -> claims.id (FK), deleting claim will fail (RESTRICT) unless we update project first.
  // If we update project first (claim_id: null), and it's NOT NULL column, it fails.
  // Let's try to update project first.

  const { error: projectError } = await supabase
    .from("projects")
    .update({
      status: "submitted",
      claim_id: null as any, // Trying to nullify again to see specific error if it fails
    })
    .eq("id", projectId);

  if (projectError) {
    console.error("Error updating project:", projectError);
    // Return specific error to frontend to diagnose "not null" vs "RLS"
    return {
      success: false,
      message: `Update Project Failed: ${projectError.message}`,
    };
  }

  // 2. Delete the claim using project_id (safer than potential stale claimId)
  const { error: deleteClaimError } = await supabase
    .from("claims")
    .delete()
    .eq("project_id", projectId);

  if (deleteClaimError) {
    console.error("Error deleting claim:", deleteClaimError);
    return {
      success: false,
      message: `Delete Claim Failed: ${deleteClaimError.message}`,
    };
  }

  revalidatePath(`/dashboard/${projectId}`);
  revalidatePath("/dashboard");

  return { success: true };
}

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

export async function rejectClaim(projectId: string, claimId: string) {
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

  // 1. Update project status
  // We actully try to update status first. We are omitting claim_id set to null because it might be non-nullable or causing issues.
  // If we delete the claim row later, and projects.claim_id is a FK, we might have issues if we don't clear it, but let's try this order or rely on cascade.
  // Ideally we should know if claim_id is nullable.
  const { error: projectError } = await supabase
    .from("projects")
    .update({
      status: "submitted",
      // claim_id: null, // Removed potentially problematic field
    })
    .eq("id", projectId);

  if (projectError) {
    console.error("Error updating project:", projectError);
    return {
      success: false,
      message: `Failed to update project status: ${projectError.message}`,
    };
  }

  // 2. Delete the claim
  const { error: deleteClaimError } = await supabase
    .from("claims")
    .delete()
    .eq("id", claimId);

  if (deleteClaimError) {
    console.error("Error deleting claim:", deleteClaimError);
    return {
      success: false,
      message: `Failed to delete claim: ${deleteClaimError.message}`,
    };
  }

  return { success: true };
}
