"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

import {
  CheckCircle,
  Ellipsis,
  Send,
  ShieldCheck,
  XCircle,
} from "lucide-react";

// -------------------------------------
// TYPES
// -------------------------------------
export type ProjectAction = "invite" | "claim" | "approve" | "decline";

interface ProjectActionsMenuProps {
  onInvite: () => Promise<void> | void;
  onClaim: () => Promise<void> | void;
  onApprove: () => Promise<void> | void;
  onDecline: () => Promise<void> | void;
}

// -------------------------------------
// COMPONENT
// -------------------------------------
export default function ProjectActionsMenu({
  onInvite,
  onClaim,
  onApprove,
  onDecline,
}: ProjectActionsMenuProps) {
  const [dialog, setDialog] = useState<ProjectAction | null>(null);

  const handleConfirm = async () => {
    switch (dialog) {
      case "invite":
        await onInvite();
        break;
      case "claim":
        await onClaim();
        break;
      case "approve":
        await onApprove();
        break;
      case "decline":
        await onDecline();
        break;
    }

    setDialog(null);
  };

  return (
    <>
      {/* Three-dot menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Ellipsis className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuItem
            onClick={() => setDialog("invite")}
            className="flex gap-2 focus:bg-[#326EA6] dark:focus:bg-[#0C4A6E] focus:text-white"
          >
            <Send className="h-4 w-4 focus:bg-[#326EA6] dark:focus:bg-[#0C4A6E] focus:text-white" />
            Envoyer une invitation
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setDialog("claim")}
            className="flex gap-2 focus:bg-[#326EA6] dark:focus:bg-[#0C4A6E] focus:text-white"
          >
            <ShieldCheck className="h-4 w-4 focus:bg-[#326EA6] dark:focus:bg-[#0C4A6E] focus:text-white" />
            Revendiquer
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setDialog("approve")}
            className="flex gap-2 focus:bg-[#326EA6] dark:focus:bg-[#0C4A6E] focus:text-white"
          >
            <CheckCircle className="h-4 w-4 focus:bg-[#326EA6] dark:focus:bg-[#0C4A6E] focus:text-white" />
            Approuver
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setDialog("decline")}
            className="flex gap-2 text-red-600 focus:bg-red-600/10 focus:text-red-600 dark:focus:bg-red-600/20"
          >
            <XCircle className="h-4 w-4 text-red-600 focus:bg-red-600/10 focus:text-red-600 dark:focus:bg-red-600/20" />
            Refuser
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation dialog */}
      <Dialog open={dialog !== null} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog === "invite" && "Envoyer une invitation ?"}
              {dialog === "claim" && "Revendiquer ce projet ?"}
              {dialog === "approve" && "Approuver ce projet ?"}
              {dialog === "decline" && "Refuser ce projet ?"}
            </DialogTitle>

            <DialogDescription>
              Cette action nécessite une confirmation. Voulez-vous continuer ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialog(null)}
              className="rounded-xs cursor-pointer  text-sm px-4 py-2 flex items-center gap-1"
            >
              Annuler
            </Button>

            <Button
              onClick={handleConfirm}
              className="bg-[#63a053] hover:bg-[#528a45] rounded-xs cursor-pointer text-white text-sm px-4 py-2 flex items-center gap-1"
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
