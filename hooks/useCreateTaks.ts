"use client";

import { createTask } from "@/app/actions/projects/milestones/tasks/createTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createTask,
  });
}
