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

import { CheckCircle, Ellipsis, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { ProjectAction } from "@/lib/project/getProjectActions";

interface ProjectActionsMenuProps {
  onInvite?: () => void;
  onClaim: () => void;
  onApprove: () => void;

  actions: ProjectAction[];
}

export default function ProjectActionsMenu({
  onClaim,
  onApprove,
  actions,
}: ProjectActionsMenuProps) {
  const [dialog, setDialog] = useState<ProjectAction | null>(null);

  if (actions.length === 0) return null;

  const handleConfirm = async () => {
    if (dialog === "claim") await onClaim();
    if (dialog === "approve") await onApprove();
    setDialog(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Ellipsis className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {actions.includes("invite") && (
            <DropdownMenuItem
              onClick={() => setDialog("invite")}
              className="flex gap-2"
            >
              <Send className="h-4 w-4" />
              Envoyer une invitation
            </DropdownMenuItem>
          )}

          {actions.includes("claim") && (
            <DropdownMenuItem
              onClick={() => setDialog("claim")}
              className="flex gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              Revendiquer
            </DropdownMenuItem>
          )}

          {actions.includes("approve") && (
            <DropdownMenuItem
              onClick={() => setDialog("approve")}
              className="flex gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Approuver
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialog !== null} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog === "invite" && "Envoyer une invitation ?"}
              {dialog === "claim" && "Revendiquer ce projet ?"}
              {dialog === "approve" && "Approuver ce projet ?"}
            </DialogTitle>

            <DialogDescription>
              Cette action nécessite une confirmation.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>
              Annuler
            </Button>
            <Button onClick={handleConfirm} className="bg-[#63a053] text-white">
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
