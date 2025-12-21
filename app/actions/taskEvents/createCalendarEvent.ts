"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";

export interface CreateCalendarEventInput {
  title: string;
  description?: string;
  event_type: "task" | "meeting";

  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  all_day?: boolean;

  location_type?: "online" | "onsite" | "hybrid";
  location_label?: string;

  source?: "user" | "fond_local";
  participantIds?: string[];
}

export async function createCalendarEvent(
  input: CreateCalendarEventInput
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  /* ----------------------------------
   * 1. Auth check
   * ---------------------------------- */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return { success: false, message: "Unauthorized" };
  }

  /* ----------------------------------
   * 2. Create event
   * ---------------------------------- */
  const { data: event, error: eventError } = await supabase
    .from("calendar_events")
    .insert({
      created_by: user.id,
      title: input.title,
      description: input.description,
      event_type: input.event_type,

      start_date: input.start_date,
      end_date: input.end_date,
      start_time: input.start_time,
      end_time: input.end_time,
      all_day: input.all_day ?? false,

      location_type: input.location_type,
      location_label: input.location_label,
      source: input.source ?? "user",
    })
    .select("id")
    .single();

  if (eventError || !event) {
    return {
      success: false,
      message: eventError?.message ?? "Failed to create event",
    };
  }

  /* ----------------------------------
   * 3. Participants (creator + others)
   * ---------------------------------- */
  const participantIds = new Set<string>([
    user.id,
    ...(input.participantIds ?? []),
  ]);

  const participantsPayload = Array.from(participantIds).map((uid) => ({
    event_id: event.id,
    user_id: uid,
  }));

  const { error: participantError } = await supabase
    .from("calendar_event_participants")
    .insert(participantsPayload);

  if (participantError) {
    return { success: false, message: participantError.message };
  }

  return {
    success: true,
    data: { id: event.id },
  };
}
