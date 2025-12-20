import { ProjectStatus } from "@/types/status";

export type DashboardQueryContext =
  | { kind: "receipt" }
  | { kind: "my-projects" }
  | { kind: "status"; status: ProjectStatus[] };

export const TAB_TO_QUERY_CONTEXT: Record<string, DashboardQueryContext> = {
  recu: { kind: "receipt" },

  "mes-projets": { kind: "my-projects" },

  encours: {
    kind: "status",
    status: ["in_progress"],
  },

  reserve: {
    kind: "status",
    status: ["reserved"],
  },
};
