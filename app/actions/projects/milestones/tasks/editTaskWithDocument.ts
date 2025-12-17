"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";
import type { TablesInsert, TablesUpdate } from "@/types/supabase";

interface EditTaskWithDocumentInput {
  taskId: string;
  milestoneId: string;
  name?: string;
  description?: string | null;
  category?: string | null;
  file_format?: string | null;
  file?: File;
}

export async function editTaskWithDocument(
  input: EditTaskWithDocumentInput
): Promise<ActionResult<null>> {
  const supabase = await createClient();

  const { taskId, milestoneId, file, ...taskUpdates } = input;

  // 1️⃣ Find existing document
  const { data: existingDoc, error: fetchError } = await supabase
    .from("documents")
    .select("id, file_path")
    .eq("task_id", taskId)
    .maybeSingle();

  if (fetchError) {
    return { success: false, message: fetchError.message };
  }

  let newFilePath: string | null = null;

  // 2️⃣ Upload file
  if (file) {
    if (existingDoc?.file_path) {
      await supabase.storage.from("documents").remove([existingDoc.file_path]);
    }

    const ext = file.name.split(".").pop();
    const path = `milestone-${milestoneId}/task-${taskId}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(path, file, { upsert: true });

    if (error) return { success: false, message: error.message };

    newFilePath = path;
  }

  // 3️⃣ INSERT document
  if (!existingDoc && newFilePath) {
    if (!taskUpdates.name) {
      return {
        success: false,
        message: "Document name is required",
      };
    }

    const insertPayload: TablesInsert<"documents"> = {
      task_id: taskId,
      name: taskUpdates.name,
      category: taskUpdates.category ?? undefined,
      description: taskUpdates.description ?? undefined,
      file_format: taskUpdates.file_format ?? undefined,
      file_path: newFilePath,
    };

    const { error } = await supabase.from("documents").insert(insertPayload);
    if (error) return { success: false, message: error.message };
  }

  // 4️⃣ UPDATE document
  if (existingDoc && newFilePath) {
    const updatePayload: TablesUpdate<"documents"> = {
      file_path: newFilePath,
    };

    if (taskUpdates.name !== undefined) updatePayload.name = taskUpdates.name;
    if (taskUpdates.category !== undefined)
      updatePayload.category = taskUpdates.category ?? undefined;
    if (taskUpdates.description !== undefined)
      updatePayload.description = taskUpdates.description ?? undefined;
    if (taskUpdates.file_format !== undefined)
      updatePayload.file_format = taskUpdates.file_format ?? undefined;

    const { error } = await supabase
      .from("documents")
      .update(updatePayload)
      .eq("id", existingDoc.id);

    if (error) return { success: false, message: error.message };
  }

  // 5️⃣ UPDATE task
  const taskPayload: TablesUpdate<"tasks"> = {};

  if (taskUpdates.name !== undefined) taskPayload.title = taskUpdates.name;
  if (taskUpdates.description !== undefined)
    taskPayload.description = taskUpdates.description ?? undefined;
  if (taskUpdates.category !== undefined)
    taskPayload.category = taskUpdates.category ?? undefined;
  if (taskUpdates.file_format !== undefined)
    taskPayload.file_format = taskUpdates.file_format ?? undefined;

  if (Object.keys(taskPayload).length > 0) {
    const { error } = await supabase
      .from("tasks")
      .update(taskPayload)
      .eq("id", taskId);

    if (error) return { success: false, message: error.message };
  }

  return { success: true, data: null };
}
