"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addDocument(documentData: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .insert([documentData])
    .select()
    .single();

  if (error) {
    console.error("❌ Error creating document:", error.message);
    return { error: error.message };
  }

  // Optional: refresh page list
  revalidatePath("/dashboard");

  return { data };
}
