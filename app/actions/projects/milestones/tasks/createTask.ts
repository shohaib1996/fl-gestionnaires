"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";
import { AddDocumentPayload } from "@/types/task";

export interface CreateTaskInput {
  milestoneId: string;
  title: string;
  description?: string;
  category?: string | null;
  file_format?: string;
}

export async function createTask(
  input: AddDocumentPayload
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      milestone_id: input.milestoneId,
      title: input.name,
      description: input.description,
      category: input.category,
      file_format: input.file_format,
    })
    .select("id")
    .single();
  console.log("🚀 Created Task:", data, error);

  if (error) {
    return { success: false, message: error.message, code: error.code };
  }

  return { success: true, data: { id: data.id } };
}
