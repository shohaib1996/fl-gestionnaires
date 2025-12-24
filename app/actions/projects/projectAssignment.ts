"use server";

import { createClient } from "@/lib/supabase/server";

type ActionResult = {
  success: boolean;
  message: string;
};

export async function assignProjectToUser(
  projectId: string,
  targetUserId: string,
  assignedBy: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("assign_project", {
    p_project_id: projectId,
    p_user_id: targetUserId,
    p_assigned_by: assignedBy,
  });

  if (error) {
    console.error("assignProjectToUser error:", error);

    return {
      success: false,
      message: "Échec de l’assignation du projet",
    };
  }

  return {
    success: true,
    message: "Projet assigné avec succès",
  };
}
