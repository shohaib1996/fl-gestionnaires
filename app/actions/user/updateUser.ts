"use server";

import { createClient } from "@supabase/supabase-js";

interface UpdateUserInput {
  userId: string;
  password: string;
}

export async function updateUser({ userId, password }: UpdateUserInput) {
  if (!userId || !password) {
    return {
      success: false,
      error: "Invalid input",
    };
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  } catch (err) {
    console.error("❌ updateUser server action error:", err);

    return {
      success: false,
      error: "Unexpected server error",
    };
  }
}
