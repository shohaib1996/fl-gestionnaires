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
export async function toggleMyContact(contactId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: existing } = await supabase
    .from("user_contacts")
    .select("contact_id")
    .eq("user_id", user.id)
    .eq("contact_id", contactId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("user_contacts")
      .delete()
      .eq("user_id", user.id)
      .eq("contact_id", contactId);
  } else {
    await supabase.from("user_contacts").insert({
      user_id: user.id,
      contact_id: contactId,
    });
  }

  return { success: true };
}

export type ContactListItem = {
  id: string;
  name: string;
  title: string | null;
  city: string | null;
  image_url: string | null;
  is_my_contact: boolean;
};

export async function getContacts({
  onlyMine = false,
}: {
  onlyMine?: boolean;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // 🔹 CASE 1: ONLY MY CONTACTS
  if (onlyMine) {
    const { data, error } = await supabase
      .from("user_contacts")
      .select(
        `
        contact:contacts (
          id,
          name,
          title,
          city,
          image_url
        )
      `
      )
      .eq("user_id", user.id);

    if (error) throw error;

    return (
      data?.map((row: any) => ({
        ...row.contact,
        is_my_contact: true,
      })) ?? []
    );
  }

  // 🔹 CASE 2: ALL CONTACTS (+ mark mine)
  const { data, error } = await supabase
    .from("contacts")
    .select(
      `
      id,
      name,
      title,
      city,
      image_url,
      user_contacts!left(contact_id)
    `
    )
    .eq("user_contacts.user_id", user.id);

  if (error) throw error;

  return (
    data?.map((c: any) => ({
      id: c.id,
      name: c.name,
      title: c.title,
      city: c.city,
      image_url: c.image_url,
      is_my_contact: c.user_contacts?.length > 0,
    })) ?? []
  );
}
