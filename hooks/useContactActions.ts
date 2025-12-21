"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  ContactListItem,
  getContacts,
  toggleMyContact,
} from "@/app/actions/contact/contact.actions";

interface UseContactActionsOptions {
  onlyMine: boolean;
  page?: number;
  pageSize?: number;
}

export type PaginatedContacts = {
  data: ContactListItem[];
  total: number;
};

export function useContactActions({
  onlyMine,
  page,
  pageSize,
}: UseContactActionsOptions) {
  const queryClient = useQueryClient();

  /* ---------------------------
     GET CONTACTS (QUERY)
  ---------------------------- */
  const contactsQuery = useQuery<PaginatedContacts>({
    queryKey: ["contacts", { onlyMine, page, pageSize }],
    queryFn: () => getContacts({ onlyMine, page, pageSize }),
  });

  /* ---------------------------
     TOGGLE MY CONTACT (MUTATION)
  ---------------------------- */
  const toggle = useMutation({
    mutationFn: (contactId: string) => toggleMyContact(contactId),

    onSuccess: () => {
      // invalidate both views to stay consistent
      queryClient.invalidateQueries({ queryKey: ["contacts", { onlyMine }] });
      queryClient.invalidateQueries({
        queryKey: ["contacts", { onlyMine: !onlyMine }],
      });
    },

    onError: () => {
      toast.error("Unable to update contact.");
    },
  });

  return {
    contacts: contactsQuery.data?.data ?? [],
    total: contactsQuery.data?.total ?? 0,

    toggleMyContact: (contactId: string) => toggle.mutate(contactId),

    loading: {
      list: contactsQuery.isLoading || contactsQuery.isFetching,
      toggle: toggle.isPending,
    },
  };
}
