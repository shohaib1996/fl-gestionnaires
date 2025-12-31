"use client";

import {
  approveAccountRequest,
  rejectAccountRequest,
} from "@/app/actions/projects/accountRequestActions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function AccountRequestActions({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /* -------------------------
     Approve handler
  -------------------------- */
  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveAccountRequest(id);

      if (!result.ok) {
        toast.error(result.error ?? "Une erreur est survenue");
        return;
      }

      toast.success("La demande a été approuvée avec succès");
      router.push("/dashboard/account-requests");
    });
  };

  /* -------------------------
     Reject handler
  -------------------------- */
  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectAccountRequest(id);

      if (!result.ok) {
        toast.error(result.error ?? "Une erreur est survenue");
        return;
      }

      toast.success("La demande a été rejetée");
      router.push("/dashboard/account-requests");
    });
  };

  return (
    <div className="flex gap-4">
      <Button
        disabled={isPending}
        onClick={handleApprove}
        className="bg-[#63a053] hover:bg-[#528a45] text-white rounded-none"
      >
        Approuver
      </Button>

      <Button
        disabled={isPending}
        variant="destructive"
        onClick={handleReject}
        className="rounded-none bg-[#63a053] hover:bg-[#528a45] text-white"
      >
        Rejeter
      </Button>
    </div>
  );
}
