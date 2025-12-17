import { createMilestone } from "@/app/actions/projects/milestones/createMilestones";
import { assignedProjectKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMilestone,

    onSuccess: (res, { projectId }) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      queryClient.invalidateQueries({
        queryKey: assignedProjectKeys.details(projectId),
      });
    },
  });
}
