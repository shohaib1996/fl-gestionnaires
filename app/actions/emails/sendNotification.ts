"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend";

export async function sendProjectNotification(
  projectId: string,
  email: string
) {
  if (!email) {
    return { success: false, message: "Email is required" };
  }

  const supabase = await createClient();

  // 1. Check if user exists in the DB
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Error checking user:", error);
    return { success: false, message: "Database error checking user" };
  }

  // 2. Prepare email content
  let subject = "";
  let html = "";

  if (user) {
    // User exists - Project Approved / Start Working
    subject = "Votre projet a été approuvé !";
    html = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Félicitations !</h2>
        <p>Votre projet est maintenant en cours (In Progress).</p>
        <p>Vous pouvez vous connecter à votre espace et commencer à collaborer avec votre administrateur.</p>
        <p>
          <a href="https://fl-gestionnaires.vercel.app/dashboard" style="background-color: #63A053; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Accéder au tableau de bord
          </a>
        </p>
      </div>
    `;
  } else {
    // User does not exist - Invitation to create account
    subject = "Création de compte - FL Gestionnaires";
    html = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Bienvenue !</h2>
        <p>Nous avons bien reçu votre projet, mais nous n'avons pas trouvé de compte associé à cet email.</p>
        <p>Pour suivre l'avancement de votre projet, veuillez créer votre compte en cliquant sur le lien ci-dessous :</p>
        <p>
          <a href="https://fl-gestionnaires.vercel.app/account-request" style="background-color: #326EA6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Créer mon compte
          </a>
        </p>
      </div>
    `;
  }

  // 3. Send Email
  const result = await sendEmail(email, subject, html);

  return result;
}
