export type ProjectStatus =
  | "reserved"
  | "claimed"
  | "receipt"
  | "in_progress"
  | "declined"
  | "completed";

export const ALL_STATUSES: ProjectStatus[] = [
  "reserved",
  "claimed",
  "receipt",
  "in_progress",
  "declined",
  "completed",
];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  reserved: "Reserved",
  claimed: "Claimed",
  receipt: "Receipt",
  in_progress: "In Progress",
  declined: "Declined",
  completed: "Completed",
};
