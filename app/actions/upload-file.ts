"use server";

import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export async function uploadFile(file: File) {
  try {
    const supabase = await createClient();

    if (!file) return { error: "No file provided" };

    const ext = file.name.split(".").pop();
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = `documents/${fileName}`; // ⭐ universal folder

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      return { error: uploadError.message };
    }

    // Public URL
    const { data } = await supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      path: filePath,
    };
  } catch (err) {
    console.error(err);
    return { error: "Upload failed" };
  }
}
