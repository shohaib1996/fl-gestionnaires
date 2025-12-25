import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface EventParticipant {
  id: string;
  name: string | null;
  email: string;
  avatar?: string | null;
}

export function useEventParticipants(eventId: string) {
  return useQuery({
    queryKey: ["event-participants", eventId],
    enabled: !!eventId,
    queryFn: async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("calendar_event_participants")
        .select(
          `
          user_id,
          user:users (
            id,
            fullName,
            email,
            avatarURL
          )
        `
        )
        .eq("event_id", eventId);

      if (error) {
        throw error;
      }

      return data.map((p) => ({
        id: p.user_id,
        name: p.user.fullName,
        email: p.user.email,
        avatar: p.user.avatarURL,
      }));
    },
  });
}
