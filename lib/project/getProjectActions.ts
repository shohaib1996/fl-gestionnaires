import { UserRole } from "@/types/role";
import { ProjectStatus } from "@/types/status";

export type ProjectAction = "invite" | "claim" | "approve";

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
    // if (status === "submitted") {
    //   return ["invite"];
    // }

    if (status === "claimed") {
      // approve is FINAL — includes internal invite if needed
      return ["approve"];
    }

    return [];
  }

  return [];
}
