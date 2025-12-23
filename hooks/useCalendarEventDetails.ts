import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface CalendarEventDetails {
  id: string;
  title: string;
  description?: string | null;

  start_date: string;
  end_date: string;
  start_time?: string | null;
  end_time?: string | null;

  location_type?: "online" | "onsite" | "hybrid" | null;
  location_label?: string | null;

  created_by: string;
}

export function useCalendarEventDetails(eventId?: string) {
  return useQuery({
    queryKey: ["calendar-event-details", eventId],
    enabled: !!eventId,
    queryFn: async () => {
      const supabase = createClient();

      if (!eventId) {
        return null;
      }

      const { data, error } = await supabase
        .from("calendar_events")
        .select(
          `
          id,
          title,
          description,
          start_date,
          end_date,
          start_time,
          end_time,
          location_type,
          location_label,
          created_by
        `
        )
        .eq("id", eventId)
        .single();

      if (error) {
        throw error;
      }

      return data as CalendarEventDetails;
    },
  });
}
