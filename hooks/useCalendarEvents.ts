import { createCalendarEvent } from "@/app/actions/taskEvents/createCalendarEvent";
import { createClient } from "@/lib/supabase/client";
import type { ActionResult } from "@/types/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ======================================================
 * Types
 * ====================================================== */

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  event_type: "task" | "meeting";

  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  all_day: boolean;

  location_type?: "online" | "onsite" | "hybrid";
  location_label?: string;

  status: string;
  source?: "user" | "fond_local";
}

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

interface UseMyCalendarEventsParams {
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

/* ======================================================
 * Query — fetch my calendar events
 * ====================================================== */

export function useMyCalendarEvents(params?: UseMyCalendarEventsParams) {
  return useQuery({
    queryKey: ["calendar-events"],
    queryFn: async () => {
      const supabase = createClient();

      let query = supabase
        .from("calendar_events")
        .select("*")
        .order("start_date", { ascending: true });
      console.log("query", params);

      if (params?.from) {
        query = query.gte("start_date", params.from);
      }

      if (params?.from && params?.to) {
        query = query.gte("start_date", params.from).lte("end_date", params.to);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as CalendarEvent[];
    },
  });
}

/* ======================================================
 * Mutation — create calendar event
 * ====================================================== */

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: CreateCalendarEventInput
    ): Promise<ActionResult<{ id: string }>> => {
      return createCalendarEvent(payload);
    },

    onSuccess: (result) => {
      if (!result?.success) return;

      // 🔄 refetch all calendar queries
      queryClient.invalidateQueries({
        queryKey: ["calendar-events"],
      });
    },
  });
}
