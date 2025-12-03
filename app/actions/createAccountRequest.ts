"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

/**
 * Server action to create an account request:
 * - uploads id front, id back, signature (base64 -> blob)
 * - inserts a record into account_requests
 *
 * Expects the client to pass the same AccountRequestFormData shape you already use.
 */
type AccountRequestFormData = {
  firstName: string;
  lastName: string;
  postnom?: string;
  birthDate: string;
  address: string;
  phoneNumber: string;
  email: string;

  idType: string[];
  otherIdType?: string;
  idNumber?: string;
  idFrontImage?: File | null;
  idBackImage?: File | null;

  incomeSources: string[];
  otherIncomeSource?: string;

  occupation: string;
  employerName?: string;
  employerAddress?: string;

  termsAccepted: boolean;
  privacyAccepted: boolean;
  fundsSourceConfirmed: boolean;

  signature?: string | null; // base64 data URL
  signerName?: string;
};

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

export async function createAccountRequest(form: AccountRequestFormData) {
  const supabase = await createClient();

  try {
    // bucket to use — create this in your Supabase UI: "account-requests"
    const BUCKET = "project-images";

    // 1) upload front ID
    let idFrontUrl: string | null = null;
    if (form.idFrontImage) {
      const ext = (form.idFrontImage as File).name?.split(".").pop() ?? "png";
      const fileName = `${randomUUID()}.${ext}`;
      const filePath = `id_front/${fileName}`;
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
      const filePath = `id_back/${fileName}`;
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
      const filePath = `signatures/${fileName}`;
      signatureUrl = await uploadFileToBucket(
        supabase,
        BUCKET,
        filePath,
        sigBlob
      );
    }

    // 4) insert record
    const insertPayload = {
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

      income_sources: form.incomeSources,
      other_income_source: form.otherIncomeSource ?? null,

      occupation: form.occupation,
      employer_name: form.employerName ?? null,
      employer_address: form.employerAddress ?? null,

      terms_accepted: form.termsAccepted,
      privacy_accepted: form.privacyAccepted,
      funds_source_confirmed: form.fundsSourceConfirmed,

      signature_url: signatureUrl,
      signer_name: form.signerName ?? null,

      status: "pending",
    };

    const { data, error } = await supabase
      .from("account_requests")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("createAccountRequest insert error:", error);
      return { error: error.message };
    }

    // Optional: revalidate pages that list account requests
    try {
      revalidatePath("/dashboard");
      revalidatePath("/account-requests");
    } catch (e) {
      // non-blocking
      console.warn("revalidatePath failed:", e);
    }

    return { data };
  } catch (err: any) {
    console.error("createAccountRequest error:", err);
    return { error: err?.message ?? String(err) };
  }
}
