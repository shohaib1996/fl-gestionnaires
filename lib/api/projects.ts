import { createClient } from "@/lib/supabase/client";

export async function fetchProjects() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
