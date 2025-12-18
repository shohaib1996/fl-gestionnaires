// hooks/useContactActions.ts
import { toggleMyContact } from "@/app/actions/contact/contact.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseContactActionsOptions {
  onlyMine: boolean;
}

export function useContactActions({ onlyMine }: UseContactActionsOptions) {
  const queryClient = useQueryClient();

  const toggleMyContactMutation = useMutation({
    mutationFn: (contactId: string) => toggleMyContact(contactId),

    onSuccess: () => {
      // invalidate both views safely
      queryClient.invalidateQueries({
        queryKey: ["contacts", { onlyMine }],
      });

      queryClient.invalidateQueries({
        queryKey: ["contacts", { onlyMine: !onlyMine }],
      });
    },
  });

  return {
    toggleMyContact: toggleMyContactMutation.mutate,
    isTogglingMyContact: toggleMyContactMutation.isPending,
  };
}
