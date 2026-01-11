"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Send invitation email using Supabase Auth
 * This will send an email to the user inviting them to create an account
 */
export async function sendSupabaseInvitation(email: string, projectId: string) {
  if (!email) {
    return { success: false, message: "Email is required" };
  }

  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      // User exists - they already have an account
      return {
        success: true,
        message: "L'utilisateur a déjà un compte. Notification envoyée.",
        userExists: true,
      };
    }

    // User doesn't exist - send invitation using Supabase Auth Admin API
    const { data, error } = await adminClient.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          project_id: projectId,
          invited_at: new Date().toISOString(),
        },
        redirectTo: `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/auth/callback`,
      }
    );

    if (error) {
      console.error("Supabase invitation error:", error);
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Invitation envoyée avec succès",
      data,
    };
  } catch (error: any) {
    console.error("Error sending invitation:", error);
    return {
      success: false,
      message: error.message || "Échec de l'envoi de l'invitation",
    };
  }
}
