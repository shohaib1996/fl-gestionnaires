import { createClient } from "@/lib/supabase/server";
import ContactDetails from "./ContactDetails";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const { data, error } = await supabase
    .from("contacts")
    .select(
      `
      id,
      name,
      email,
      city,
      skills,
      title,
      bio,
      image_url,
      image_path
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error("Contact not found");
  }

  // 🔥 MAP DB → UI MODEL
  const contact = {
    id: data.id,
    name: data.name,
    email: data.email,
    city: data.city ?? "",
    skills: data.skills ?? "",
    title: data.title ?? "",
    image: data.image_url || data.image_path || "/images/manager.png",
    bio1: data.bio ?? "",
    bio2: "",
  };

  return <ContactDetails person={contact} />;
}
