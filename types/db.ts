import { Database } from "@/types/supabase";

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type MilestoneRow = Database["public"]["Tables"]["milestones"]["Row"];
export type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
