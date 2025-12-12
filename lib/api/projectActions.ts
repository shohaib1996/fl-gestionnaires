import { createClient } from "@/lib/supabase/client";
import { ActionResult, Project } from "@/types/actions";

const supabase = createClient();

// ---------------------------
// CLAIM PROJECT
// ---------------------------
export async function claimProjectSimple(
  id: string
): Promise<ActionResult<Project>> {
  const { error } = await supabase.rpc("increment_claim", { project_pk: id });

  if (error) {
    return {
      success: false,
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  // fetch the updated row
  const { data, error: fetchError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    return {
      success: false,
      message: fetchError.message,
      code: fetchError.code,
      details: fetchError.details,
    };
  }

  return {
    success: true,
    data,
  };
}

// ---------------------------
// APPROVE PROJECT
// ---------------------------
export async function approveProject(
  id: string
): Promise<ActionResult<Project>> {
  const { data, error } = await supabase
    .from("projects")
    .update({ status: "approved" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  return {
    success: true,
    data,
  };
}

// ---------------------------
// DECLINE PROJECT
// ---------------------------
export async function declineProject(
  id: string
): Promise<ActionResult<Project>> {
  const { data, error } = await supabase
    .from("projects")
    .update({ status: "declined" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  return {
    success: true,
    data,
  };
}

// ---------------------------
// INVITE USER
// ---------------------------
export async function inviteUser(
  email: string
): Promise<ActionResult<{ email: string }>> {
  const res = await fetch("/api/invite", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    return {
      success: false,
      message: errorBody?.error || res.statusText,
    };
  }

  return {
    success: true,
    data: { email },
  };
}
