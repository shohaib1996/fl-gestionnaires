/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";

/**
 * UI-focused shape for Assigned Project
 * (Header + manager + milestones only)
 */
export interface AssignedProjectDetails {
  id: string;
  name: string;
  status: string | null;
  project_id: string;

  manager: {
    id: string;
    name: string | null;
    role: string;
    avatarURL?: string | null;
  };

  milestones: {
    id: string;
    title: string;
    status: string;
    order_index: number;
  }[];

  /**
   * Optional – used only in detailed views
   */
  goal?: string;
  preview?: {
    image: string;
    type: string;
  };
}

export async function getAssignedProjectDetails(
  projectId: string
): Promise<ActionResult<AssignedProjectDetails>> {
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
          milestones!milestones_project_id_fkey (
            id,
            title,
            status,
            order_index
          )
        ),

        user:users!project_assignments_user_id_fkey (
          id,
          fullName,
          role,
          avatarURL
        )
      `
      )
      .eq("project_id", projectId)
      .eq("is_active", true)
      .single();

    if (error) {
      return {
        success: false,
        message: error.message,
        code: error.code,
      };
    }

    if (!data?.project || !data.user) {
      return {
        success: false,
        message: "Active project assignment not found",
      };
    }

    /**
     * 🔹 Final shaped response (Type-safe)
     */
    const shaped: AssignedProjectDetails = {
      id: data.project.id,
      name: data.project.title,
      status: data.project.status,
      project_id: data.project.project_id,

      manager: {
        id: data.user.id,
        name: data.user.fullName,
        role: data.user.role,
        avatarURL: data.user.avatarURL,
      },

      milestones: (data.project.milestones ?? []).sort(
        (a, b) => a.order_index - b.order_index
      ),
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
