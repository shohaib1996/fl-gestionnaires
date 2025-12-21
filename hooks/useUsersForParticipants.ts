import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface UserOption {
  id: string;
  name: string;
  email: string;
}

export function useUsersForParticipants() {
  return useQuery({
    queryKey: ["participant-users"],
    queryFn: async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("users")
        .select("id, fullName, email")
        .order("fullName");

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map((u) => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
      })) as UserOption[];
    },
  });
}
