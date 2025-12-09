"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Get all projects from the database
 * @param orderBy - field to order by (default: 'created_at')
 * @param ascending - sort order (default: false for newest first)
 */
export async function getAllProjects(
  orderBy: string = "created_at",
  ascending: boolean = false
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order(orderBy, { ascending });

  if (error) {
    console.error("❌ Error fetching projects:", error);
    return { error: error.message };
  }

  return { data };
}

/**
 * Get a single project by ID
 * @param id - The project ID
 */
export async function getProjectById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ Error fetching project:", error);
    return { error: error.message };
  }

  return { data };
}

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
