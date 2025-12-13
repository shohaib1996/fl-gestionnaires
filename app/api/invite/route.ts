import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();
  const nextHeaders = await headers();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? nextHeaders.get("origin");

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${APP_URL}/account-request`,
  });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data });
}
