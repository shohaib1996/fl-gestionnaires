"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";
import type { EditTaskInput } from "@/types/task";

export async function editTask(
  input: EditTaskInput
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  const { taskId, ...updates } = input;

  if (Object.keys(updates).length === 0) {
    return {
      success: false,
      message: "No fields provided to update",
      code: "EMPTY_UPDATE",
    };
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({
      ...updates,
    })
    .eq("id", taskId)
    .select("id")
    .single();

  console.log("✏️ Updated Task:", data, error);

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
