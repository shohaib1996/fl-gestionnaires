"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUsersWithRoles() {
  const supabase = await createClient();

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return { error: error.message, users: [] };
    }

    return { users, error: null };
  } catch (err: any) {
    console.error("Error in getUsersWithRoles:", err);
    return { error: err.message, users: [] };
  }
}
