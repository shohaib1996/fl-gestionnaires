"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAccountRequestById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("account_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error("Account request not found");
  }

  return data;
}
