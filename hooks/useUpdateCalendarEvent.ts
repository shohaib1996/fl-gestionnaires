"use client";

import { updateCalendarEvent } from "@/app/actions/taskEvents/updateCalendarEvent";
import type { ActionResult } from "@/types/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateCalendarEventPayload {
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

export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation<
    ActionResult<{ id: string }>,
    unknown,
    UpdateCalendarEventPayload
  >({
    mutationFn: async (payload) => {
      return await updateCalendarEvent(payload);
    },

    onSuccess: (res) => {
      if (!res.success) return;
      if (!res.data) return;

      // 🔄 refresh calendar & sidebar
      queryClient.invalidateQueries({
        queryKey: ["calendar-events"],
      });

      queryClient.invalidateQueries({
        queryKey: ["calendar-event", res.data.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["event-participants", res.data.id],
      });
    },
  });
}
