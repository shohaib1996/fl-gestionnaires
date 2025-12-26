import { ProjectRow } from "@/types/db";
import { ProjectStatus } from "@/types/status";

export type DashboardTab = "recu" | "mes-projets" | "encours" | "reserve";

export type DashboardProject = ProjectRow;

export const TAB_TO_STATUS: Record<DashboardTab, ProjectStatus> = {
  recu: "submitted",
  "mes-projets": "claimed",
  encours: "in_progress",
  reserve: "reserved",
};

export interface DashboardFilters {
  search?: string;
  fromDate?: string;
  toDate?: string;
  location?: string;
  category?: string;
  categories?: string[];
  name?: string;
  ifl?: string;
  date?: string;
  page?: number;
  pageSize?: number;
}
