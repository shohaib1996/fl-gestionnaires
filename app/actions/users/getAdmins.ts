"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";

export interface AdminUser {
  id: string;
  fullName: string | null;
  email: string;
  role: string;
}

export async function getAdmins(): Promise<ActionResult<AdminUser[]>> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, fullName, email, role")
      .eq("role", "admin")
      .order("fullName");

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      data: data as AdminUser[],
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch admins",
    };
  }
}
