"use server";

import { createClient } from "@supabase/supabase-js";

export async function recreateAuthUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  /* ----------------------------------
   * 1. Check existing auth user
   * ---------------------------------- */
  const { data: users, error: listError } = await supabase.auth.admin.listUsers(
    {
      page: 1,
      perPage: 1000,
    }
  );

  if (listError) {
    return { ok: false, error: listError.message };
  }

  const existingUser = users.users.find((u) => u.email === email);

  /* ----------------------------------
   * 2. Delete if exists
   * ---------------------------------- */
  if (existingUser) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      existingUser.id
    );

    if (deleteError) {
      return { ok: false, error: deleteError.message };
    }
  }

  /* ----------------------------------
   * 3. Create fresh auth user
   * ---------------------------------- */
  const { data, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !data.user) {
    return { ok: false, error: createError?.message };
  }

  return {
    ok: true,
    userId: data.user.id,
  };
}
