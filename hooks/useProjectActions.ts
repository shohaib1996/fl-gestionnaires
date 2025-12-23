"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  approveProject,
  claimProject,
  declineProject,
} from "@/lib/api/projectActions";

export function useProjectActions() {
  const queryClient = useQueryClient();

  /* ---------------------------
     CLAIM
  ---------------------------- */
  const claim = useMutation({
    mutationFn: claimProject,

    onSuccess: (result) => {
      if (result.success) {
        toast.success("Project claimed successfully.");
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      } else {
        toast.error(result.message);
      }
    },

    onError: () => {
      toast.error("Unexpected error while claiming project.");
    },
  });

  /* ---------------------------
     DECLINE
  ---------------------------- */
  const decline = useMutation({
    mutationFn: declineProject,

    onSuccess: (result) => {
      if (result.success) {
        toast.success("Project declined.");
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      } else {
        toast.error(result.message);
      }
    },

    onError: () => {
      toast.error("Unexpected error while declining project.");
    },
  });

  const approve = useMutation({
    mutationFn: approveProject,

    onSuccess: (result) => {
      if (result.success) {
        toast.success("Project approved and activated.");
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      } else {
        toast.error(result.message);
      }
    },

    onError: () => {
      toast.error("Error approving project.");
    },
  });

  return {
    claim: (payload: { projectId: string; userId: string }) =>
      claim.mutate(payload),

    decline: (projectId: string) => decline.mutate(projectId),

    approve: (projectId: string) => approve.mutate(projectId),
    loading: {
      claim: claim.isPending,
      decline: decline.isPending,
      approve: approve.isPending,
    },
  };
}
