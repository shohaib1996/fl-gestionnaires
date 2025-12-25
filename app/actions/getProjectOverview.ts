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

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Return empty stats if no user is logged in
    return {
      received: 0,
      retained: 0,
      inProgress: 0,
      launched: 0,
      receivedThisWeek: 0,
      retainedThisWeek: 0,
      inProgressThisWeek: 0,
      launchedThisWeek: 0,
    };
  }

  // start of current week (Monday)
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  // Fetch ALL projects
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("status, created_at, claim_id");

  if (projectsError) {
    console.error("Error fetching projects:", projectsError);
    throw new Error(projectsError.message);
  }

  if (!projects) {
    console.error("No data returned from projects query");
    return {
      received: 0,
      retained: 0,
      inProgress: 0,
      launched: 0,
      receivedThisWeek: 0,
      retainedThisWeek: 0,
      inProgressThisWeek: 0,
      launchedThisWeek: 0,
    };
  }

  // Fetch all claims to map claim_id to claimed_by
  const { data: claims, error: claimsError } = await supabase
    .from("claims")
    .select("id, claimed_by");

  if (claimsError) {
    console.error("Error fetching claims:", claimsError);
    throw new Error(claimsError.message);
  }

  // Create a map of claim_id -> claimed_by for quick lookup
  const claimMap = new Map(
    (claims || []).map((claim) => [claim.id, claim.claimed_by])
  );

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

  for (const project of projects) {
    const status = project.status as ProjectStatus;
    const isThisWeek = new Date(project?.created_at as string) >= startOfWeek;
    // Check if this project belongs to the current user by looking up the claim
    const claimedBy = project.claim_id ? claimMap.get(project.claim_id) : null;
    const isMyProject = claimedBy === user.id;

    // For submitted projects: show all (claim_id is usually null for these)
    if (status === "submitted") {
      stats.received++;
      if (isThisWeek) stats.receivedThisWeek++;
      continue;
    }

    // For all other statuses: only count if it belongs to current user
    if (!isMyProject) continue;

    switch (status) {
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
