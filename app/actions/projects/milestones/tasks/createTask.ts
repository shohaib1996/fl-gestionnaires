"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";

interface CreateTaskInput {
  milestoneId: string;
  title: string;
  description?: string;
  category?: string;
}

export async function createTask(
  input: CreateTaskInput
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      milestone_id: input.milestoneId,
      title: input.title,
      description: input.description,
      category: input.category,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, message: error.message, code: error.code };
  }

  return { success: true, data: { id: data.id } };
}
