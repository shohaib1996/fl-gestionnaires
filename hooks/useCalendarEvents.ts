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
    queryKey: ["calendar-events", params],
    queryFn: async () => {
      const supabase = createClient();

      if (!supabase) {
        throw new Error("Supabase client not initialized");
      }

      let query = supabase
        .from("calendar_events")
        .select("*")
        .order("start_date", { ascending: true });

      if (params?.from) {
        query = query.gte("start_date", params.from);
      }

      if (params?.from && params?.to) {
        query = query.gte("start_date", params.from).lte("end_date", params.to);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching calendar events:", error);
        throw new Error(error.message);
      }

      return (data as CalendarEvent[]) || [];
    },
    staleTime: 0, // Always refetch when invalidated
    refetchOnMount: true, // Refetch when component mounts
    retry: 3, // Retry 3 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
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
