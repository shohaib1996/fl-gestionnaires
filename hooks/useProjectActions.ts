"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  approveProject,
  claimProjectSimple,
  declineProject,
  inviteUser,
} from "@/lib/api/projectActions";

import {
  ActionError,
  ActionResult,
  ActionVariable,
  Project,
} from "@/types/actions";

export function useProjectActions() {
  const queryClient = useQueryClient();

  // ---------------------------
  // CLAIM
  // ---------------------------
  const claim = useMutation<ActionResult<Project>, ActionError, ActionVariable>(
    {
      mutationFn: claimProjectSimple,

      onSuccess: (result) => {
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: ["projects"] });
          toast.success("Project claimed successfully!");
        } else {
          toast.error(result.message);
        }
      },

      onError: (error) => {
        toast.error(error.message ?? "Error claiming project.");
      },
    }
  );

  // ---------------------------
  // APPROVE
  // ---------------------------
  const approve = useMutation<
    ActionResult<Project>,
    ActionError,
    ActionVariable
  >({
    mutationFn: approveProject,

    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        toast.success("Project approved!");
      } else {
        toast.error(result.message);
      }
    },

    onError: (error) => {
      toast.error(error.message ?? "Error approving project.");
    },
  });

  // ---------------------------
  // DECLINE
  // ---------------------------
  const decline = useMutation<
    ActionResult<Project>,
    ActionError,
    ActionVariable
  >({
    mutationFn: declineProject,

    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        toast.success("Project declined.");
      } else {
        toast.error(result.message);
      }
    },

    onError: (error) => {
      toast.error(error.message ?? "Error declining project.");
    },
  });

  // ---------------------------
  // INVITE
  // ---------------------------
  const invite = useMutation<
    ActionResult<{ email: string }>,
    ActionError,
    ActionVariable
  >({
    mutationFn: inviteUser,

    onSuccess: (result) => {
      if (result.success) {
        toast.success(`Invitation sent to ${result.data.email}`);
      } else {
        toast.error(result.message);
      }
    },

    onError: (error) => {
      toast.error(error.message ?? "Error sending invitation.");
    },
  });

  return {
    claim: (id: string) => claim.mutate(id),
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
