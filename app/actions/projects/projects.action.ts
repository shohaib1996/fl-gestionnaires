"use server";

import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

interface Claimer {
  fullName: string;
  email: string;
  avatarURL: string | null;
}

export interface GetProjectByIdResult {
  data:
    | (ProjectRow & {
        claimers: Claimer[] | null;
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
        claims (
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

  const claimers: Claimer[] | null =
    data.claims && data.claims.length > 0
      ? (data.claims
          .map((c: any) => {
            if (!c.user) return null;

            return {
              id: c.user.id,
              fullName: c.user.fullName ?? "",
              email: c.user.email ?? "",
              avatarURL: c.user.avatarURL ?? null,
            };
          })
          .filter(Boolean) as Claimer[])
      : null;

  // raw relation remove করে clean response বানানো
  const { claims, ...project } = data;

  return {
    data: {
      ...project,
      claimers,
    },
    error: null,
  };
}
