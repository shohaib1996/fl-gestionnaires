import { getContacts } from "@/app/actions/contact/contact.actions";
import { useQuery } from "@tanstack/react-query";

export function useContacts(onlyMine: boolean) {
  return useQuery({
    queryKey: ["contacts", { onlyMine }],
    queryFn: () => getContacts({ onlyMine }),
  });
}
