import { UserRole } from "@/types/role";
import { ProjectStatus } from "@/types/status";

export type ProjectAction = "invite" | "claim" | "approve" | "decline" | "reserve" | "assign";

export function getProjectActions({
  role,
  status,
}: {
  role: UserRole;
  status: ProjectStatus;
}): ProjectAction[] {
  /* ---------------- ADMIN ---------------- */
  if (role === "admin") {
    if (status === "submitted") {
      return ["claim"];
    }
    return [];
  }

  /* ------------ SUPER ADMIN -------------- */
  if (role === "super_admin") {
    // Super admin sees different actions based on status
    const actions: ProjectAction[] = ["approve", "decline", "reserve"];

    // Add "assign" for submitted and reserved projects (not claimed)
    if (status === "submitted" || status === "reserved") {
      actions.push("assign");
    }

    return actions;
  }

  return [];
}
