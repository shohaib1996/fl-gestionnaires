"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAccountRequests() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("account_requests")
    .select(
      `
      id,
      first_name,
      last_name,
      email,
      phone_number,
      occupation,
      status,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      error: "Failed to fetch account requests",
    };
  }

  return {
    ok: true,
    data,
  };
}
