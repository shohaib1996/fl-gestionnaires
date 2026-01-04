"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveAdminWithRole(
  requestId: string,
  assignedRole: "admin" | "super_admin" | "onterpeoner"
) {
  const supabase = await createClient();

  try {
    // Get current user to check if they're super_admin
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) {
      return { ok: false, error: "Non authentifié" };
    }

    // Check if current user is super_admin
    const { data: currentUserData, error: currentUserError } = await supabase
      .from("users")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (currentUserError || !currentUserData) {
      return { ok: false, error: "Impossible de vérifier les permissions" };
    }

    if (currentUserData.role !== "super_admin") {
      return { ok: false, error: "Seuls les super administrateurs peuvent approuver les demandes" };
    }

    /* -------------------------
       1️⃣ Fetch admin account request
    -------------------------- */
    const { data: request, error: fetchError } = await supabase
      .from("admin_account_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !request) {
      return { ok: false, error: "Demande de compte administrateur introuvable" };
    }

    if (!request.user_id) {
      return { ok: false, error: "Utilisateur non lié à la demande" };
    }

    /* -------------------------
       2️⃣ Check if user already exists
    -------------------------- */
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", request.user_id)
      .maybeSingle();

    if (checkError) {
      return { ok: false, error: "Échec de la vérification de l'utilisateur existant" };
    }

    /* -------------------------
       3️⃣ Create user ONLY if not exists with assigned role
    -------------------------- */
    if (!existingUser) {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: request.user_id,
          email: request.email,
          fullName: `${request.first_name} ${request.last_name}`,
          avatarURL: null,
          role: assignedRole, // Use the role selected by super admin
          createdAt: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.error("Insert error details:", insertError);
        return {
          ok: false,
          error: `Échec de la création de l'utilisateur: ${insertError.message || insertError.code}`
        };
      }
    } else {
      // If user exists, update their role
      const { error: updateError } = await supabase
        .from("users")
        .update({ role: assignedRole })
        .eq("id", request.user_id);

      if (updateError) {
        return { ok: false, error: "Échec de la mise à jour du rôle de l'utilisateur" };
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
      return { ok: false, error: "Échec de l'approbation de la demande" };
    }

    // Revalidate the page
    revalidatePath("/dashboard/users");

    return { ok: true };
  } catch (err: any) {
    console.error("Error in approveAdminWithRole:", err);
    return { ok: false, error: err.message };
  }
}
