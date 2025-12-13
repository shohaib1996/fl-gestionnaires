import { ProjectRow } from "@/types/db";
import { ProjectStatus } from "@/types/status";

export type DashboardTab = "recu" | "mes-projets" | "encours";

export type DashboardProject = ProjectRow;

export const TAB_TO_STATUS: Record<DashboardTab, ProjectStatus> = {
  recu: "reserved",
  "mes-projets": "claimed",
  encours: "in_progress",
};

export interface DashboardFilters {
  location?: string;
  category?: string;
  date?: string;
  name?: string;
  ifl?: string;
  search?: string;
}
