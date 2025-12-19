import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();
  const nextHeaders = await headers();

  if (!email) {
    return NextResponse.json(
      { success: false, error: "Email is required" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? nextHeaders.get("origin");
  const APP_URL = "https://fl-gestionnaires-naim.vercel.app";

  /* --------------------------------------------------
   * 1. Check public.users
   * -------------------------------------------------- */
  const { data: publicUser, error: publicUserError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (publicUserError) {
    return NextResponse.json(
      { success: false, error: publicUserError.message },
      { status: 500 }
    );
  }

  if (publicUser) {
    return NextResponse.json(
      {
        success: false,
        code: "USER_EXISTS",
        message: "User already exists in system",
      },
      { status: 409 }
    );
  }

  /* --------------------------------------------------
   * 2. Check auth.users
   * -------------------------------------------------- */
  const { data: authUsers, error: authUserError } =
    await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

  if (authUserError) {
    return NextResponse.json(
      { success: false, error: authUserError.message },
      { status: 500 }
    );
  }

  const existingAuthUser = authUsers.users.find((u) => u.email === email);

  /* --------------------------------------------------
   * 3. Remove stale auth user if exists
   * -------------------------------------------------- */
  if (existingAuthUser) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      existingAuthUser.id
    );

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }
  }

  /* --------------------------------------------------
   * 4. Send fresh invite
   * -------------------------------------------------- */
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${APP_URL}/account-request`,
  });

  console.log(`${APP_URL}/account-request`);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Invitation sent successfully",
    data,
  });
}
