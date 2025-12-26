"use client";

import { Claimer, rejectClaim } from "@/app/actions/projects/projects.action";
import { useUser } from "@/providers/UserProvider";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

      <section className="mt-6 pb-10 bg-card">
        <div className="bg-[#63a053]/25 p-4 mb-6">
          <div className="px-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Claimer
            </h3>
            {claimer && user?.role === "super_admin" && (
              <Button
                onClick={() => setShowDialog(true)}
                disabled={isPending}
                variant="destructive"
                size="sm"
              >
                Reject Claim
              </Button>
            )}
          </div>
        </div>

      <div className="px-11">
        {!claimer ? (
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Aucun utilisateur n’a encore réclamé ce projet.
          </p>
        ) : (
          <div className="flex items-center justify-between bg-white dark:bg-neutral-800 border border-border rounded-xs px-4 py-3">
            {/* Claimer info */}
            <div className="space-y-1">
              <p className="font-medium text-gray-800 dark:text-white">
                {claimer.fullName || "Unnamed User"}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {claimer.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  );
}
