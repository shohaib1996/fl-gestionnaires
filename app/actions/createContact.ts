"use server";

import { createClient } from "@/lib/supabase/server";

export async function createContact(contact: any) {
  const supabase = await createClient();

  const payload = {
    name: contact.name,
    title: contact.title,
    email: contact.email,
    phone: contact.phone,
    city: contact.city,
    skills: contact.skills,
    bio: contact.bio,
    image_url: contact.imageUrl,
    image_path: contact.imagePath,
  };

  const { data, error } = await supabase
    .from("contacts")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("❌ Failed to create contact:", error);
    return { error: error.message };
  }

  return { data };
}
