import { createMilestone } from "@/app/actions/projects/milestones/createMilestones";
import { milestoneKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateMilestone(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMilestone,

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message ?? "Milestone created");

      queryClient.invalidateQueries({
        queryKey: milestoneKeys.project(projectId),
      });
    },
  });
}
