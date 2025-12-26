import { Database } from "./supabase";

export type ProjectStatus = Database["public"]["Enums"]["project_status"];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  submitted: "Submitted",
  claimed: "Claimed",
  in_progress: "In Progress",
  declined: "Declined",
  completed: "Completed",
  reserved: "Reserved",
};
