import { createMilestone } from "@/app/actions/projects/milestones/createMilestones";
import { assignedProjectKeys } from "@/lib/queryKeys";
import type { ActionResult } from "@/types/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Infer input type directly from the server action
type CreateMilestoneInput = Parameters<typeof createMilestone>[0];

//Explicit success data shape
type CreateMilestoneSuccess = {
  id: string;
};

export function useCreateMilestone() {
  const queryClient = useQueryClient();

  return useMutation<
    ActionResult<CreateMilestoneSuccess>,
    Error,
    CreateMilestoneInput
  >({
    mutationFn: createMilestone,

    onSuccess: (res, variables) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Jalon créé avec succès");

      queryClient.invalidateQueries({
        queryKey: assignedProjectKeys.details(variables.projectId),
      });
    },
  });
}
