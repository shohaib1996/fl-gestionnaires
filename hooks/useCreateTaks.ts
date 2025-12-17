"use client";

import { createTask } from "@/app/actions/projects/milestones/tasks/createTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskKeys } from "./useTasksByMilestone";

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createTask,

    onSuccess: (_res, { milestoneId }) => {
      qc.invalidateQueries({ queryKey: taskKeys.byMilestone(milestoneId) });
    },
  });
}
