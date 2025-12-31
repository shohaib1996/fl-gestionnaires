// task-status.ts
export const TASK_STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "in_progress", label: "En cours" },
  { value: "completed", label: "Terminé" },
] as const;

export type TaskStatus = (typeof TASK_STATUS_OPTIONS)[number]["value"];
