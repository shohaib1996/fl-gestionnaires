import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set");
    return { success: false, message: "Resend API key missing" };
  }

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev", // Default testing email
      to,
      subject,
      html,
    });

    if (data.error) {
      console.error("Resend API error:", data.error);
      return { success: false, message: data.error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Resend error:", error);
    return { success: false, message: error.message };
  }
};
