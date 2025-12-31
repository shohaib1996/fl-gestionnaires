"use client";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function UserLIst({ req }: any) {
  const router = useRouter();
  return (
    <tr
      onClick={() => router.push(`/dashboard/account-requests/${req.id}`)}
      className="border-t border-[#989898]/80 hover:bg-[#E0EFFF] cursor-pointer"
    >
      <td className="px-4 py-3 font-medium">
        {req.first_name} {req.last_name}
      </td>
      <td className="px-4 py-3">{req.email}</td>
      <td className="px-4 py-3">{req.phone_number}</td>
      <td className="px-4 py-3">{req.occupation}</td>
      <td className="px-4 py-3">
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
