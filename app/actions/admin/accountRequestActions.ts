"use server";

import { createClient } from "@/lib/supabase/server";

/* -------------------------
   APPROVE REQUEST
-------------------------- */

export async function approveAccountRequest(requestId: string) {
  const supabase = await createClient();

  /* -------------------------
     1️⃣ Fetch account request
  -------------------------- */
  const { data: request, error: fetchError } = await supabase
    .from("account_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (fetchError || !request) {
    return { ok: false, error: "Account request not found" };
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
  -------------------------- */
  if (!existingUser) {
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: request.user_id,
        email: request.email,
        fullName: `${request.first_name} ${request.last_name}`,
        avatarURL: null,
        createdAt: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      return { ok: false, error: "Failed to create user" };
    }
  }

  /* -------------------------
     4️⃣ Update request status
  -------------------------- */
  const { error: updateError } = await supabase
    .from("account_requests")
    .update({
      status: "approved",
      // approved_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updateError) {
    return { ok: false, error: "Failed to approve request" };
  }

  return { ok: true };
}

/* -------------------------
   REJECT REQUEST
-------------------------- */
export async function rejectAccountRequest(id: string, reason?: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("account_requests")
    .update({
      status: "rejected",
      // rejection_reason: reason ?? null,
      // updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { ok: false, error: "Failed to reject account request" };
  }

  return { ok: true };
}
