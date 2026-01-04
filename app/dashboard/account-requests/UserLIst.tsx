"use client";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function UserLIst({ req }: any) {
  const router = useRouter();
  return (
    <tr
      onClick={() => router.push(`/dashboard/account-requests/${req.id}`)}
      className="border-t border-gray-200 dark:border-neutral-700 hover:bg-[#E0EFFF] dark:hover:bg-neutral-700 cursor-pointer transition-colors"
    >
      <td className="px-6 py-3 font-normal text-gray-900 dark:text-gray-100">
        {req.first_name} {req.last_name}
      </td>
      <td className="px-6 py-3 font-normal text-gray-700 dark:text-gray-300">
        {req.occupation}
      </td>
      <td className="px-6 py-3 font-normal text-gray-700 dark:text-gray-300">
        {req.email}
      </td>
      <td className="px-6 py-3 font-normal text-gray-700 dark:text-gray-300">
        {req.phone_number}
      </td>
      <td className="px-6 py-3">
        <StatusBadge status={req.status} />
      </td>
    </tr>
  );
}

/* ---------------------------------- */
/* Status Badge                        */
/* ---------------------------------- */
function StatusBadge({ status }: { status: string | null }) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-primary text-primary-foreground">Approuvée</Badge>
      );
    case "rejected":
      return <Badge className="bg-[#A1A1A1]">Rejetée</Badge>;
    default:
      return <Badge className="bg-[#FBDC76] text-[#343E47]">En attente</Badge>;
  }
}
