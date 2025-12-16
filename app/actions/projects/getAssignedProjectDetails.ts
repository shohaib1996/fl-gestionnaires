/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";

export interface AssignedProjectDetails {
  id: string;
  name: string;
  status: string | null;
  project_id: string;
  manager: {
    id: string;
    name: string | null;
    role: string;
  };

  milestones: {
    id: string;
    title: string;
    status: string;
  }[];
  documents?: {
    id: string;
    name: string;
    date: string;
    description: string;
    category: string;
    status: string;
    type: string;
    file_format: string;
    file_path?: string | null;
  }[];
  goal: string;
  preview: { image: string; type: string };
}

export async function getAssignedProjectDetails(
  projectId: string
): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("project_assignments")
      .select(
        `
    id,
    is_active,
    assigned_at,

    project:projects (
      id,
      title,
      status,
      project_id,
      milestones (
        id,
        title,
        status
      )
    ),

    user:users!project_assignments_user_id_fkey (
      id,
      fullName,
      role
    )
    `
      )
      .eq("project_id", projectId)
      .eq("is_active", true)
      .single();

    console.log("🛠️ getAssignedProjectDetails data:", data, "error:", error);

    if (error) {
      return {
        success: false,
        message: error.message,
        code: error.code,
      };
    }

    if (!data || !data.project) {
      return {
        success: false,
        message: "Active project assignment not found",
      };
    }

    // 🔹 Shape for UI
    const shaped: AssignedProjectDetails = {
      id: data.project.id,
      name: data.project.title,
      status: data.project.status,
      project_id: data.project.project_id,
      manager: {
        id: data.user.id,
        name: data.user.fullName,
        role: data.user.role,
      },
      milestones: data.project.milestones ?? [],
    };

    return {
      success: true,
      data: shaped,
    };
  } catch (err: any) {
    return {
      success: false,
      message: "Unexpected server error",
      details: err?.message,
    };
  }
}
