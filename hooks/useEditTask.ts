"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { editTask } from "@/app/actions/projects/milestones/tasks/editTask";
import { EditTaskInput } from "@/types/task";
import { taskKeys } from "./useTasksByMilestone";

export default function useEditTask(milestoneId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: EditTaskInput) => {
      const result = await editTask(data);

      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },

    onSuccess: () => {
      // ✅ revalidate project → milestones → tasks
      queryClient.invalidateQueries({
        queryKey: taskKeys.byMilestone(milestoneId),
      });

      toast.success("Task updated successfully");
    },

    onError: (error) => {
      console.error("Edit task failed:", error);
      toast.error("Failed to update task");
    },
  });

  return {
    editTask: mutation.mutate,
    editTaskAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
