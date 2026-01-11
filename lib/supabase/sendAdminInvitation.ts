"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Send admin invitation email using Supabase Auth
 * Triggers the "Confirm sign up" email template
 * The template should have a link to /admin-account-request
 */
export async function sendAdminInvitation(email: string, name: string) {
  if (!email) {
    return { success: false, message: "Email requis" };
  }

  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Check if user already exists in auth.users
    const { data: authUsers, error: listError } =
      await adminClient.auth.admin.listUsers();

    if (listError) {
      console.error("Error checking existing users:", listError);
      return { success: false, message: listError.message };
    }

    const existingAuthUser = authUsers.users.find(
      (user) => user.email === email
    );

    if (existingAuthUser) {
      return {
        success: false,
        message:
          "Un utilisateur avec cet email existe déjà. Veuillez utiliser un autre email.",
        userExists: true,
      };
    }

    // Check if user already exists in users table
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return {
        success: false,
        message: "L'utilisateur a déjà un compte dans le système.",
        userExists: true,
      };
    }

    // Use signUp to trigger the "Confirm sign up" email template
    // This requires "Confirm email" to be enabled in Supabase
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: Math.random().toString(36).slice(-16) + "Aa1!", // Temporary random password
      options: {
        data: {
          name: name,
          user_type: "admin",
          invited_at: new Date().toISOString(),
        },
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/admin-account-request`,
      },
    });

    if (signUpError) {
      console.error("SignUp error:", signUpError);
      return { success: false, message: signUpError.message };
    }

    return {
      success: true,
      message: "Invitation envoyée avec succès",
      data: signUpData,
    };
  } catch (error: any) {
    console.error("Error sending admin invitation:", error);
    return {
      success: false,
      message: error.message || "Échec de l'envoi de l'invitation",
    };
  }
}
