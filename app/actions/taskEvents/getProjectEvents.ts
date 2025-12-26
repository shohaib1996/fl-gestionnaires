"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult } from "@/types/actions";
import type { Tables } from "@/types/supabase";

export type CalendarEvent = Tables<"calendar_events">;

export async function getProjectEvents(
  projectId: string
): Promise<ActionResult<CalendarEvent[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("project_id", projectId)
    .order("start_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    return {
      success: false,
      message: "Impossible de charger les tâches",
    };
  }

  return {
    success: true,
    data: data ?? [],
  };
}
