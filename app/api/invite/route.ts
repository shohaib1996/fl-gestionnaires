import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing environment variables:", {
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceRoleKey: !!serviceRoleKey,
      });
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${APP_URL}/account-request`,
    });

    if (error) {
      console.error("Supabase invite error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
      data,
    });
  } catch (error) {
    console.error("Invite API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
