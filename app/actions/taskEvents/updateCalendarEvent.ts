"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";
import { revalidatePath } from "next/cache";

interface UpdateCalendarEventInput {
  eventId: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  location_type?: "online" | "onsite" | "hybrid";
  location_label?: string;
  participantIds: string[];
}

export async function updateCalendarEvent(
  input: UpdateCalendarEventInput
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  /* ---------------- Auth ---------------- */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return {
      success: false,
      message: "Unauthorized",
      code: "AUTH_REQUIRED",
    };
  }

  /* ---------------- Ownership ---------------- */
  const { data: event, error: eventError } = await supabase
    .from("calendar_events")
    .select("id, created_by")
    .eq("id", input.eventId)
    .single();

  if (eventError || !event) {
    return {
      success: false,
      message: "Event not found",
      code: "NOT_FOUND",
    };
  }

  if (event.created_by !== user.id) {
    return {
      success: false,
      message: "Only creator can update this event",
      code: "FORBIDDEN",
    };
  }

  /* ---------------- Update event ---------------- */
  const { error: updateError } = await supabase
    .from("calendar_events")
    .update({
      title: input.title,
      description: input.description,
      start_date: input.start_date,
      end_date: input.end_date,
      start_time: input.start_time,
      end_time: input.end_time,
      location_type: input.location_type,
      location_label: input.location_label,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.eventId);

  if (updateError) {
    return {
      success: false,
      message: "Failed to update event",
      details: updateError.message,
      code: "UPDATE_FAILED",
    };
  }

  /* ---------------- Fetch participants ---------------- */
  const { data: existing, error: fetchError } = await supabase
    .from("calendar_event_participants")
    .select("user_id")
    .eq("event_id", input.eventId);

  if (fetchError) {
    return {
      success: false,
      message: "Failed to load participants",
      details: fetchError.message,
      code: "FETCH_FAILED",
    };
  }

  const existingIds = new Set(existing.map((p) => p.user_id));
  const incomingIds = new Set(input.participantIds);

  const toAdd = [...incomingIds].filter((id) => !existingIds.has(id));
  const toRemove = [...existingIds].filter((id) => !incomingIds.has(id));

  /* ---------------- Remove ---------------- */
  if (toRemove.length > 0) {
    const { error } = await supabase
      .from("calendar_event_participants")
      .delete()
      .eq("event_id", input.eventId)
      .in("user_id", toRemove);

    if (error) {
      return {
        success: false,
        message: "Failed to remove participants",
        details: error.message,
        code: "REMOVE_PARTICIPANTS_FAILED",
      };
    }
  }

  /* ---------------- Add ---------------- */
  if (toAdd.length > 0) {
    const payload = toAdd.map((userId) => ({
      event_id: input.eventId,
      user_id: userId,
    }));

    const { error } = await supabase
      .from("calendar_event_participants")
      .insert(payload);

    if (error) {
      return {
        success: false,
        message: "Failed to add participants",
        details: error.message,
        code: "ADD_PARTICIPANTS_FAILED",
      };
    }
  }

  /* ---------------- UI refresh ---------------- */
  revalidatePath("/dashboard");

  return {
    success: true,
    data: { id: input.eventId },
    message: "Event updated successfully",
  };
}
