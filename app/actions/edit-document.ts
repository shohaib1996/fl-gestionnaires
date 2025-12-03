"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadFile } from "./upload-file";

export async function editDocument(
  documentId: string,
  updates: any,
  newFile?: File
) {
  const supabase = await createClient();

  let fileUrl = null;
  let filePath = null;

  // If user uploaded a new file:
  if (newFile) {
    const uploaded = await uploadFile(newFile);

    if (uploaded.error) {
      return { error: uploaded.error };
    }

    fileUrl = uploaded.url;
    filePath = uploaded.path;

    // Attach new file fields
    updates.file_url = fileUrl;
    updates.file_path = filePath;

    // Optional: delete previous file
    if (updates.old_file_path) {
      await supabase.storage
        .from("project-images")
        .remove([updates.old_file_path]);
    }

    delete updates.old_file_path;
  }

  // Update database
  const { data, error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", documentId)
    .select()
    .single();

  if (error) {
    console.error("❌ Error updating document:", error);
    return { error: error.message };
  }

  return { data };
}
