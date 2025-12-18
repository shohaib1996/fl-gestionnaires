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
}

export function useContactActions({ onlyMine }: UseContactActionsOptions) {
  const queryClient = useQueryClient();

  /* ---------------------------
     GET CONTACTS (QUERY)
  ---------------------------- */
  const contactsQuery = useQuery<ContactListItem[]>({
    queryKey: ["contacts", { onlyMine }],
    queryFn: () => getContacts({ onlyMine }),
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
    /* -------- DATA -------- */
    contacts: contactsQuery.data ?? [],

    /* -------- ACTIONS -------- */
    toggleMyContact: (contactId: string) => toggle.mutate(contactId),

    /* -------- LOADING STATES -------- */
    loading: {
      list: contactsQuery.isLoading || contactsQuery.isFetching,
      toggle: toggle.isPending,
    },
  };
}
