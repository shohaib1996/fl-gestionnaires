"use server";

import { createClient } from "@/lib/supabase/server";
import type { ProjectSidebarOverview } from "@/types/project-overview";

export async function getProjectSidebarOverview(
  projectId: string
): Promise<ProjectSidebarOverview> {
  const supabase = await createClient();

  const [milestones, notes, tasks, documents, contacts] = await Promise.all([
    supabase
      .from("milestones")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId),
    supabase
      .from("notes")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId),
    supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId),
    supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId),
  ]);

  return {
    milestones: milestones.count ?? 0,
    notes: notes.count ?? 0,
    tasks: tasks.count ?? 0,
    documents: documents.count ?? 0,
    contacts: contacts.count ?? 0,
  };
}
