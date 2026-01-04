"use server";

import { AdminAccountRequestFormData } from "@/components/admin-account-request/types";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

/**
 * Server action to create an admin account request:
 * - uploads id front, id back, signature (base64 -> blob)
 * - inserts a record into admin_account_requests
 *
 * Expects the client to pass the AdminAccountRequestFormData shape.
 */

function base64ToBlob(base64DataUrl: string) {
  const parts = base64DataUrl.split(",");
  const mimeMatch = parts[0].match(/data:(.*);base64/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const binary = Buffer.from(parts[1], "base64");
  return new Blob([binary], { type: mime });
}

async function uploadFileToBucket(
  supabase: ReturnType<typeof createClient> extends Promise<infer R> ? R : any,
  bucket: string,
  path: string,
  file: File | Blob
) {
  // supabase client returned by createClient() exposes storage.upload
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl as string;
}

export async function createAdminAccountRequest(form: AdminAccountRequestFormData) {
  const supabase = await createClient();

  try {
    // bucket to use — create this in your Supabase UI: "project-images"
    const BUCKET = "project-images";

    // 1) upload front ID
    let idFrontUrl: string | null = null;
    if (form.idFrontImage) {
      const ext = (form.idFrontImage as File).name?.split(".").pop() ?? "png";
      const fileName = `${randomUUID()}.${ext}`;
      const filePath = `admin_id_front/${fileName}`;
      idFrontUrl = await uploadFileToBucket(
        supabase,
        BUCKET,
        filePath,
        form.idFrontImage as File
      );
    }

    // 2) upload back ID
    let idBackUrl: string | null = null;
    if (form.idBackImage) {
      const ext = (form.idBackImage as File).name?.split(".").pop() ?? "png";
      const fileName = `${randomUUID()}.${ext}`;
      const filePath = `admin_id_back/${fileName}`;
      idBackUrl = await uploadFileToBucket(
        supabase,
        BUCKET,
        filePath,
        form.idBackImage as File
      );
    }

    // 3) upload signature (base64 -> blob)
    let signatureUrl: string | null = null;
    if (form.signature) {
      const sigBlob = base64ToBlob(form.signature);
      const fileName = `${randomUUID()}.png`;
      const filePath = `admin_signatures/${fileName}`;
      signatureUrl = await uploadFileToBucket(
        supabase,
        BUCKET,
        filePath,
        sigBlob
      );
    }

    // 4) insert record
    const insertPayload = {
      user_id: form.user_id,
      first_name: form.firstName,
      last_name: form.lastName,
      postnom: form.postnom ?? null,
      birth_date: form.birthDate,
      address: form.address,
      phone_number: form.phoneNumber,
      email: form.email,

      id_type: form.idType,
      other_id_type: form.otherIdType ?? null,
      id_number: form.idNumber ?? null,
      id_front_image: idFrontUrl,
      id_back_image: idBackUrl,

      terms_accepted: form.termsAccepted,
      privacy_accepted: form.privacyAccepted,

      signature_url: signatureUrl,
      signer_name: form.signerName ?? null,

      status: "pending",
    };

    const { data, error } = await supabase
      .from("admin_account_requests")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("createAdminAccountRequest insert error:", error);
      return { error: error.message };
    }

    // Optional: revalidate pages that list admin account requests
    try {
      revalidatePath("/dashboard");
      revalidatePath("/admin-account-requests");
    } catch (e) {
      // non-blocking
      console.warn("revalidatePath failed:", e);
    }

    return { data };
  } catch (err: any) {
    console.error("createAdminAccountRequest error:", err);
    return { error: err?.message ?? String(err) };
  }
}
