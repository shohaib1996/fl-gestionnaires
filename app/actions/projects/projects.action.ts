"use server";

import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export interface Claimer {
  fullName: string;
  email: string;
  avatarURL: string | null;
}

export interface GetProjectByIdResult {
  data:
    | (ProjectRow & {
        claimer: Claimer | null;
      })
    | null;
  error: string | null;
}

export async function getProjectById(
  id: string
): Promise<GetProjectByIdResult> {
  if (!id) {
    return {
      data: null,
      error: "Project id is required",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        *,
        claimer:claims (
          claimed_at,
          user:users (
            id,
            fullName,
            email,
            avatarURL
          )
        )
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("❌ getProjectById error:", error);

    return {
      data: null,
      error: error.message,
    };
  }

  if (!data) {
    return {
      data: null,
      error: "Project not found",
    };
  }

  const claimer: Claimer | null = data.claimer?.user
    ? {
        fullName: data.claimer.user.fullName ?? "",
        email: data.claimer.user.email,
        avatarURL: data.claimer.user.avatarURL ?? null,
      }
    : null;

  const { ...project } = data;

  return {
    data: {
      ...project,
      claimer,
    },
    error: null,
  };
}
