"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Create a new project (public access, no auth required)
 * @param projectData - plain object containing everything to insert
 */
export async function createProject(projectData: any) {
  const supabase = await createClient();

  console.log("📤 Sending to Supabase:", projectData);

  const { data, error } = await supabase
    .from("projects")
    .insert([projectData])
    .select()
    .single();

  if (error) {
    console.error("❌ Error creating project:", error);
    return { error: error.message };
  }

  // Revalidate dashboard list for admins (optional)
  revalidatePath("/dashboard");

  return { data };
}
