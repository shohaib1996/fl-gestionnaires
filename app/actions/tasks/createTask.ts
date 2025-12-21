"use server";

import { createClient } from "@/lib/supabase/server";

export interface CreateTaskInput {
  milestoneId: string;
  title: string;
  description?: string;
  category?: string | null;
  file_format?: string;
}

export type ActionResult<T = void> =
  | {
      success: true;
      message?: string;
      data: T;
    }
  | {
      success: false;
      message: string;
      code?: string;
    };

export async function createTask(
  input: CreateTaskInput
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      milestone_id: input.milestoneId,
      title: input.title,
      description: input.description ?? null,
      category: input.category ?? null,
      file_format: input.file_format ?? "",
    })
    .select("id")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
      code: error.code,
    };
  }

  return {
    success: true,
    data: { id: data.id },
  };
}
