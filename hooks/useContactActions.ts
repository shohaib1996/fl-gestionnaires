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
  search?: string;
  titleFilter?: string;
}

export type PaginatedContacts = {
  data: ContactListItem[];
  total: number;
};

export function useContactActions({
  onlyMine,
  page,
  pageSize,
  search,
  titleFilter,
}: UseContactActionsOptions) {
  const queryClient = useQueryClient();

  /* ---------------------------
     GET CONTACTS (QUERY)
  ---------------------------- */
  const contactsQuery = useQuery<PaginatedContacts>({
    queryKey: ["contacts", { onlyMine, page, pageSize, search, titleFilter }],
    queryFn: () =>
      getContacts({ onlyMine, page, pageSize, search, titleFilter }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
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
