"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";

interface UploadDocumentInput {
  taskId: string;
  filePath: string; // storage path
  name: string;
  description?: string;
  category?: string;
  type?: string;
  fileFormat?: string;
}

export async function createDocument(
  input: UploadDocumentInput
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .insert({
      task_id: input.taskId,
      name: input.name,
      description: input.description,
      category: input.category,
      type: input.type,
      file_format: input.fileFormat,
      file_path: input.filePath,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, message: error.message, code: error.code };
  }

  return { success: true, data: { id: data.id } };
}
