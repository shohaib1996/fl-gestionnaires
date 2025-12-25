"use server";

import { createClient } from "@/lib/supabase/server";

/* =====================================================
   CREATE CONTACT
===================================================== */

export async function createContact(contact: {
  name: string;
  title?: string | null;
  email: string;
  phone?: string | null;
  city?: string | null;
  skills?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  imagePath?: string | null;
}) {
  const supabase = await createClient();

  const payload = {
    name: contact.name,
    title: contact.title ?? null,
    email: contact.email,
    phone: contact.phone ?? null,
    city: contact.city ?? null,
    skills: contact.skills ?? null,
    bio: contact.bio ?? null,
    image_url: contact.imageUrl ?? null,
    image_path: contact.imagePath ?? null,
  };

  const { data, error } = await supabase
    .from("contacts")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("❌ Failed to create contact:", error);
    return { error: error.message };
  }

  return { data };
}

/* =====================================================
   TOGGLE MY CONTACT
===================================================== */

export async function toggleMyContact(contactId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: existing, error: fetchError } = await supabase
    .from("user_contacts")
    .select("contact_id")
    .eq("user_id", user.id)
    .eq("contact_id", contactId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    const { error } = await supabase
      .from("user_contacts")
      .delete()
      .eq("user_id", user.id)
      .eq("contact_id", contactId);

    if (error) throw error;
  } else {
    const { error } = await supabase.from("user_contacts").insert({
      user_id: user.id,
      contact_id: contactId,
    });

    if (error) throw error;
  }

  return { success: true };
}

/* =====================================================
   TYPES
===================================================== */

export type ContactListItem = {
  id: string;
  name: string;
  title: string | null;
  email: string;
  city: string | null;
  image_url: string | null;
  is_my_contact: boolean;
};

export interface GetContactsParams {
  onlyMine?: boolean;
  page?: number;
  pageSize?: number;
  search?: string;
  titleFilter?: string;
}

/* =====================================================
   GET CONTACTS (WITH PAGINATION)
===================================================== */

export async function getContacts({
  onlyMine = false,
  page = 1,
  pageSize = 10,
  search = "",
  titleFilter = "",
}: GetContactsParams): Promise<{
  data: ContactListItem[];
  total: number;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: [], total: 0 };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  /* ---------------------------
     CASE 1: ONLY MY CONTACTS
  ---------------------------- */
  if (onlyMine) {
    let query = supabase
      .from("user_contacts")
      .select(
        `
        contact:contacts (
          id,
          name,
          title,
          email,
          city,
          image_url
        )
      `,
        { count: "exact" }
      )
      .eq("user_id", user.id);

    // Apply search filter (name or email)
    if (search) {
      query = query.or(
        `contact.name.ilike.%${search}%,contact.email.ilike.%${search}%`
      );
    }

    // Apply title filter (case-insensitive)
    if (titleFilter) {
      query = query.ilike("contact.title", titleFilter);
    }

    const { data, count, error } = await query.range(from, to);

    if (error) throw error;

    return {
      data:
        data?.map((row: any) => ({
          id: row.contact.id,
          name: row.contact.name,
          title: row.contact.title,
          email: row.contact.email,
          city: row.contact.city,
          image_url: row.contact.image_url,
          is_my_contact: true,
        })) ?? [],
      total: count ?? 0,
    };
  }

  /* ---------------------------
     CASE 2: ALL CONTACTS (+ MARK MINE)
  ---------------------------- */
  let query = supabase
    .from("contacts")
    .select(
      `
      id,
      name,
      title,
      email,
      city,
      image_url,
      user_contacts!left(contact_id)
    `,
      { count: "exact" }
    )
    .eq("user_contacts.user_id", user.id);

  // Apply search filter (name or email)
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  // Apply title filter (case-insensitive)
  if (titleFilter) {
    query = query.ilike("title", titleFilter);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) throw error;

  return {
    data:
      data?.map((c: any) => ({
        id: c.id,
        name: c.name,
        title: c.title,
        email: c.email,
        city: c.city,
        image_url: c.image_url,
        is_my_contact: (c.user_contacts?.length ?? 0) > 0,
      })) ?? [],
    total: count ?? 0,
  };
}
