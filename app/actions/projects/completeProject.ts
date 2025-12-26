"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";

export async function completeProject(projectId: string): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    // Update project status to 'completed'
    const { error } = await supabase
      .from("projects")
      .update({ status: "completed" })
      .eq("id", projectId);

    if (error) {
      console.error("Complete project error:", error);
      return {
        success: false,
        message: "Failed to mark project as completed",
      };
    }

    return {
      success: true,
      data: null,
      message: "Project marked as completed successfully",
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}
