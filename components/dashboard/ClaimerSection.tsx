"use client";

import { Claimer, rejectClaim } from "@/app/actions/projects/projects.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/providers/UserProvider";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function ClaimerSection({
  claimer,
  projectId,
  onRejectSuccess,
}: {
  claimer: Claimer;
  projectId: string;
  onRejectSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [showDialog, setShowDialog] = useState(false);
  const { user } = useUser();

  const handleReject = () => {
    startTransition(async () => {
      const res = await rejectClaim(projectId);
      if (res.success) {
        toast.success("Claim rejected successfully");
        setShowDialog(false);
        // Trigger the parent component to refresh the data
        onRejectSuccess?.();
      } else {
        toast.error(res.message || "Failed to reject claim");
      }
    });
  };

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent showCloseButton={!isPending}>
          <DialogHeader>
            <DialogTitle>Reject this claim?</DialogTitle>
            <DialogDescription>
              This action will remove the claimer from this project and reset
              the project status to "submitted". This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isPending}
            >
              {isPending ? "Rejecting..." : "Reject Claim"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section className="mt-1 ">
        <div
          className="
       flex items-center justify-between gap-4 bg-white border rounded
    dark:bg-[#0D1514] dark:border-[#1F2A27] px-11 py-[18px]
     cursor-pointer 
      "
        >
          {/* LEFT SIDE: Avatar + Info */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar */}
            <div className="relative p-1 rounded-full shrink-0">
              <div className="w-12 h-12 rounded-full border-4 border-[#A9C5A1] dark:border-[#4F6D47] overflow-hidden">
                <Image
                  src={claimer.avatarURL || "/images/manager.png"}
                  alt={claimer.fullName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </div>
            </div>

            {/* Name / Role / City inline */}
            <div className="flex items-center gap-3 text-[1rem] text-gray-700 dark:text-gray-200 flex-wrap">
              <span className="font-semibold whitespace-nowrap">
                {claimer.fullName}
              </span>

              <span className="text-gray-400 dark:text-gray-500">|</span>

              <span className="whitespace-nowrap">{claimer.email}</span>
            </div>
          </div>

          {/* RIGHT SIDE: Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              size="lg"
              onClick={() => setShowDialog(true)}
            >
              Reject
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
