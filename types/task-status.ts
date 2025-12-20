// task-status.ts
export const TASK_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
] as const;

export type TaskStatus = (typeof TASK_STATUS_OPTIONS)[number]["value"];
