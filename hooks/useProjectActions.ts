"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  approveProject,
  claimProjectSimple,
  declineProject,
  inviteUser,
} from "@/lib/api/projectActions";

export function useProjectActions() {
  const queryClient = useQueryClient();

  /* ---------------------------
     CLAIM
  ---------------------------- */
  const claim = useMutation({
    mutationFn: claimProjectSimple,

    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        toast.success("Project claimed successfully!");
      } else {
        toast.error(result.message ?? "Project already claimed.");
      }
    },

    onError: () => {
      toast.error("Error claiming project.");
    },
  });

  /* ---------------------------
     APPROVE
  ---------------------------- */
  const approve = useMutation({
    mutationFn: approveProject,

    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        toast.success("Project approved!");
      } else {
        toast.error(result.message);
      }
    },

    onError: () => {
      toast.error("Error approving project.");
    },
  });

  /* ---------------------------
     DECLINE
  ---------------------------- */
  const decline = useMutation({
    mutationFn: declineProject,

    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        toast.success("Project declined.");
      } else {
        toast.error(result.message);
      }
    },

    onError: () => {
      toast.error("Error declining project.");
    },
  });

  /* ---------------------------
     INVITE
  ---------------------------- */
  const invite = useMutation({
    mutationFn: inviteUser,

    onSuccess: (result) => {
      if (result.success) {
        toast.success(`Invitation sent to ${result.data.email}`);
      } else {
        toast.error(result.message);
      }
    },

    onError: () => {
      toast.error("Error sending invitation.");
    },
  });

  return {
    claim: ({
      project_id,
      claimed_by,
    }: {
      project_id: string;
      claimed_by: string;
    }) => claim.mutate({ projectId: project_id, userId: claimed_by }),
    approve: (id: string) => approve.mutate(id),
    decline: (id: string) => decline.mutate(id),
    invite: (email: string) => invite.mutate(email),

    loading: {
      claim: claim.isPending,
      approve: approve.isPending,
      decline: decline.isPending,
      invite: invite.isPending,
    },
  };
}
