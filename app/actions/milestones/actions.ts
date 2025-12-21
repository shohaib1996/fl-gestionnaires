"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type MilestoneRow = Database["public"]["Tables"]["milestones"]["Row"];
type MilestoneUpdate = Database["public"]["Tables"]["milestones"]["Update"];
type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];

/* ----------------------------------
 * Get milestone + tasks + manager
 * ---------------------------------- */
export async function getMilestoneDetails(milestoneId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("milestones")
    .select(
      `
      *,
      tasks (*),
      manager:users (
        id,
        email,
        fullName
      )
    `
    )
    .eq("id", milestoneId)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Milestone not found");
  }

  return {
    milestone: data as MilestoneRow,
    tasks: (data.tasks ?? []) as TaskRow[],
    manager: data.manager as Pick<UserRow, "id" | "email" | "fullName"> | null,
  };
}

/* ----------------------------------
 * Update milestone (admin)
 * ---------------------------------- */
export async function updateMilestone(
  milestoneId: string,
  payload: MilestoneUpdate
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("milestones")
    .update(payload)
    .eq("id", milestoneId);

  if (error) throw new Error(error.message);

  return { success: true };
}
