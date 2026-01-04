"use server";

import { createClient } from "@/lib/supabase/server";

/* -------------------------
   APPROVE ADMIN REQUEST
-------------------------- */

export async function approveAdminAccountRequest(requestId: string) {
  const supabase = await createClient();

  /* -------------------------
     1️⃣ Fetch admin account request
  -------------------------- */
  const { data: request, error: fetchError } = await supabase
    .from("admin_account_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (fetchError || !request) {
    return { ok: false, error: "Admin account request not found" };
  }

  if (!request.user_id) {
    return { ok: false, error: "User not linked to request" };
  }

  /* -------------------------
     2️⃣ Check if user already exists
     (prevents 409 / duplicate)
  -------------------------- */
  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("id")
    .eq("id", request.user_id)
    .maybeSingle();

  if (checkError) {
    return { ok: false, error: "Failed to verify existing user" };
  }

  /* -------------------------
     3️⃣ Create user ONLY if not exists
     Admin users get 'admin' role
  -------------------------- */
  if (!existingUser) {
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: request.user_id,
        email: request.email,
        fullName: `${request.first_name} ${request.last_name}`,
        avatarURL: null,
        role: "admin", // Set admin role
        createdAt: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      return { ok: false, error: "Failed to create admin user" };
    }
  }

  /* -------------------------
     4️⃣ Update request status
  -------------------------- */
  const { error: updateError } = await supabase
    .from("admin_account_requests")
    .update({
      status: "approved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updateError) {
    return { ok: false, error: "Failed to approve request" };
  }

  return { ok: true };
}

export async function rejectAdminAccountRequest(requestId: string, reason?: string) {
  const supabase = await createClient();

  /* -------------------------
     1️⃣ Fetch admin account request
  -------------------------- */
  const { data: request, error: fetchError } = await supabase
    .from("admin_account_requests")
    .select("id, user_id")
    .eq("id", requestId)
    .single();

  if (fetchError || !request) {
    return { ok: false, error: "Admin account request not found" };
  }

  /* -------------------------
     2️⃣ Delete user if exists
  -------------------------- */
  if (request.user_id) {
    const { error: deleteUserError } = await supabase
      .from("users")
      .delete()
      .eq("id", request.user_id);

    if (deleteUserError) {
      return {
        ok: false,
        error: "Failed to remove associated user",
      };
    }
  }

  /* -------------------------
     3️⃣ Update request status
  -------------------------- */
  const { error: updateError } = await supabase
    .from("admin_account_requests")
    .update({
      status: "rejected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updateError) {
    return { ok: false, error: "Failed to reject admin account request" };
  }

  return { ok: true };
}
