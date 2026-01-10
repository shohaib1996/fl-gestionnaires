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

import {
  Archive,
  CheckCircle,
  Ellipsis,
  Send,
  ShieldCheck,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AdminUser, getAdmins } from "@/app/actions/users/getAdmins";
import { AdminSelect } from "@/components/ui/admin-select";
import { ProjectAction } from "@/lib/project/getProjectActions";
import { ProjectStatus } from "@/types/status";

interface ProjectActionsMenuProps {
  onInvite?: () => void;
  onClaim: () => void;
  onApprove: () => void;
  onDecline: () => void;
  onReserve: () => void;
  onAssign?: (adminId: string) => void;

  actions: ProjectAction[];
  projectStatus: ProjectStatus;
}

export default function ProjectActionsMenu({
  onClaim,
  onApprove,
  onDecline,
  onReserve,
  onAssign,
  actions,
  projectStatus,
}: ProjectActionsMenuProps) {
  const [dialog, setDialog] = useState<ProjectAction | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string>("");

  // Fetch admins when component mounts
  useEffect(() => {
    async function fetchAdmins() {
      const result = await getAdmins();
      if (result.success && result.data) {
        setAdmins(result.data);
      }
    }
    fetchAdmins();
  }, []);

  if (actions.length === 0) return null;

  const handleConfirm = async () => {
    if (dialog === "claim") await onClaim();
    if (dialog === "approve") await onApprove();
    if (dialog === "decline") await onDecline();
    if (dialog === "reserve") await onReserve();
    if (dialog === "assign" && onAssign && selectedAdminId) {
      await onAssign(selectedAdminId);
    }
    setDialog(null);
    setSelectedAdminId("");
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
              className="flex gap-2 focus:bg-[#E0EFFF] group focus:text-[#2085F4] rounded-xs"
            >
              <Send className="h-4 w-4 group-focus:text-[#2085F4]" />
              Envoyer une invitation
            </DropdownMenuItem>
          )}

          {actions.includes("claim") && (
            <DropdownMenuItem
              onClick={() => setDialog("claim")}
              className="flex gap-2 focus:bg-[#E0EFFF] focus:text-[#2085F4] rounded-xs group"
            >
              <ShieldCheck className="h-4 w-4 group-focus:text-[#2085F4]" />
              Prendre
            </DropdownMenuItem>
          )}

          {actions.includes("approve") && (
            <DropdownMenuItem
              onClick={() => setDialog("approve")}
              className="flex gap-2 group focus:bg-[#E0EFFF] focus:text-[#2085F4] rounded-xs"
              disabled={projectStatus !== "claimed"}
            >
              <CheckCircle className="h-4 w-4 group-focus:text-[#2085F4]" />
              Approuver
            </DropdownMenuItem>
          )}

          {actions.includes("decline") && (
            <DropdownMenuItem
              onClick={() => setDialog("decline")}
              className="flex gap-2 group focus:bg-[#E0EFFF] focus:text-[#2085F4] rounded-xs"
            >
              <XCircle className="h-4 w-4 group-focus:text-[#2085F4]" />
              Retourner
            </DropdownMenuItem>
          )}

          {actions.includes("reserve") && (
            <DropdownMenuItem
              onClick={() => setDialog("reserve")}
              className="flex gap-2 group focus:bg-[#E0EFFF] focus:text-[#2085F4] rounded-xs"
            >
              <Archive className="h-4 w-4 group-focus:text-[#2085F4]" />
              Réserver
            </DropdownMenuItem>
          )}

          {actions.includes("assign") && (
            <DropdownMenuItem
              onClick={() => setDialog("assign")}
              className="flex gap-2 group focus:bg-[#E0EFFF] focus:text-[#2085F4] rounded-xs"
            >
              <UserPlus className="h-4 w-4 group-focus:text-[#2085F4]" />
              Attribuer
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
              {dialog === "decline" && "Decline this project?"}
              {dialog === "reserve" && "Reserve this project?"}
              {dialog === "assign" && "Assign Project to Admin"}
            </DialogTitle>

            <DialogDescription>
              {dialog === "decline" &&
                "This will mark the project as declined and it will appear in the Declined tab."}
              {dialog === "reserve" &&
                "This will mark the project as reserved and it will appear in the Reserved tab."}
              {dialog === "assign" &&
                "Select an admin to assign this project. The project status will be changed to 'in_progress' and the admin can start working immediately."}
              {(dialog === "invite" ||
                dialog === "claim" ||
                dialog === "approve") &&
                "Cette action nécessite une confirmation."}
            </DialogDescription>
          </DialogHeader>

          {dialog === "assign" && (
            <div className="py-4">
              <label className="text-sm font-medium">Select Admin</label>
              <AdminSelect
                admins={admins}
                value={selectedAdminId}
                onChange={setSelectedAdminId}
                placeholder="Choose an admin to assign..."
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>
              Annuler
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-[#63a053] hover:bg-[#528a45] text-white"
              disabled={dialog === "assign" && !selectedAdminId}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
