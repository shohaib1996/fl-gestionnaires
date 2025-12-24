"use server";

import { createClient } from "@/lib/supabase/server";
import { ProjectStatus } from "@/types/status";

export interface ProjectOverview {
  received: number;
  retained: number;
  inProgress: number;
  launched: number;

  receivedThisWeek: number;
  retainedThisWeek: number;
  inProgressThisWeek: number;
  launchedThisWeek: number;
}

export async function getProjectOverview(): Promise<ProjectOverview> {
  const supabase = await createClient();

  // start of current week (Monday)
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("projects")
    .select("status, created_at");

  if (error) {
    throw new Error(error.message);
  }

  const stats: ProjectOverview = {
    received: 0,
    retained: 0,
    inProgress: 0,
    launched: 0,

    receivedThisWeek: 0,
    retainedThisWeek: 0,
    inProgressThisWeek: 0,
    launchedThisWeek: 0,
  };

  for (const project of data) {
    const status = project.status as ProjectStatus;
    const isThisWeek = new Date(project?.created_at as string) >= startOfWeek;

    switch (status) {
      case "submitted":
        stats.received++;
        if (isThisWeek) stats.receivedThisWeek++;
        break;

      case "claimed":
        stats.retained++;
        if (isThisWeek) stats.retainedThisWeek++;
        break;

      case "in_progress":
        stats.inProgress++;
        if (isThisWeek) stats.inProgressThisWeek++;
        break;

      case "completed":
        stats.launched++;
        if (isThisWeek) stats.launchedThisWeek++;
        break;

      case "declined":
        // intentionally ignored in sidebar
        break;
    }
  }

  return stats;
}
