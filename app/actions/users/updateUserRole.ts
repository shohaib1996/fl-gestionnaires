"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: "admin" | "super_admin" | "onterpeoner") {
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
      return { ok: false, error: "Seuls les super administrateurs peuvent modifier les rôles" };
    }

    // Update the user's role
    const { error: updateError } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user role:", updateError);
      return { ok: false, error: updateError.message };
    }

    // Revalidate the users page
    revalidatePath("/dashboard/users");

    return { ok: true };
  } catch (err: any) {
    console.error("Error in updateUserRole:", err);
    return { ok: false, error: err.message };
  }
}
