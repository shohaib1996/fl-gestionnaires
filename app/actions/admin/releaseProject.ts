"use server";

import { createClient } from "@/lib/supabase/client";

type ActionResult = {
  success: boolean;
  message: string;
};

export async function releaseProject(projectId: string): Promise<ActionResult> {
  const supabase = createClient();

  const { error } = await supabase.rpc("release_project", {
    p_project_id: projectId,
  });

  if (error) {
    console.error("releaseProject error:", error);

    return {
      success: false,
      message: "Impossible de libérer le projet",
    };
  }

  return {
    success: true,
    message: "Projet libéré avec succès",
  };
}
