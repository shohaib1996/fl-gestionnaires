"use client";

import { updateMilestone } from "@/app/actions/milestones/actions";
import { createTask } from "@/app/actions/tasks/createTask";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMilestoneDetails } from "@/hooks/useMilestoneDetails";
import { taskKeys } from "@/hooks/useTasksByMilestone";
import { assignedProjectKeys } from "@/lib/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import JalonDetailsBodySkeleton from "../common/skeletons/MileStoneDetailsSkeleton";
import { MilestoneForm } from "../form/MilestoneForm";
import { Skeleton } from "../ui/skeleton";

interface Phase {
  step: number;
  title: string;
  status: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  milestoneId: string | null;
  setAddDocumentModalOpen: (open: boolean) => void;
  projectId?: string;
}

export default function JalonDetailsModal({
  open,
  onClose,
  milestoneId,
  setAddDocumentModalOpen,
  projectId,
}: Props) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading } = useMilestoneDetails(milestoneId ?? undefined);

  if (!open || !milestoneId) return null;

  const handleSubmit = async (values: any, tasks: any[]) => {
    if (!data) return;

    setIsSubmitting(true);
    try {
      // 1️⃣ Update milestone meta
      await updateMilestone(data.milestone.id, {
        title: values.title,
        description: values.description,
        start_date: values.startDate,
        end_date: values.endDate,
        start_time: values.startTime,
        end_time: values.endTime,
        priority: values.priority,
        manager_id: values.managerId,
      });

      console.log(tasks);

      // 2️⃣ Separate new vs existing tasks
      const newTasks = tasks.filter((t) => !t.id);
      // const existingTasks = tasks.filter((t) => t.id);

      // 3️⃣ Create new tasks
      await Promise.all(
        newTasks.map((task) =>
          createTask({
            milestoneId: data.milestone.id,
            title: task.name,
            description: task.description,
            category: task.category,
            file_format: task.file_format,
          })
        )
      );

      // 4️⃣ Update existing tasks
      // await Promise.all(
      //   existingTasks.map((task) =>
      //     editTask({
      //       taskId: task.id,
      //       title: task.name,
      //       description: task.description,
      //       category: task.category,
      //       file_format: task.file_format,
      //     })
      //   )
      // );

      // 5️⃣ Invalidate and wait for refetch to complete BEFORE switching to view mode
      // Invalidate milestone details (for this modal)
      qc.invalidateQueries({
        queryKey: ["milestone-details", milestoneId],
      });

      // Invalidate tasks by milestone (for the main page table)
      qc.invalidateQueries({
        queryKey: taskKeys.byMilestone(data.milestone.id),
      });

      // Invalidate project details (for milestone tabs in main page)
      if (projectId) {
        qc.invalidateQueries({
          queryKey: assignedProjectKeys.details(projectId),
        });

        // Invalidate sidebar overview to update document counts
        qc.invalidateQueries({
          queryKey: ["project-sidebar-overview", projectId],
        });
      }

      // Wait for all queries to refetch with fresh data
      const refetchPromises = [
        qc.refetchQueries({
          queryKey: ["milestone-details", milestoneId],
        }),
        qc.refetchQueries({
          queryKey: taskKeys.byMilestone(data.milestone.id),
        }),
      ];

      if (projectId) {
        refetchPromises.push(
          qc.refetchQueries({
            queryKey: assignedProjectKeys.details(projectId),
          })
        );
      }

      await Promise.all(refetchPromises);

      toast.success("Jalon mis à jour");
      setMode("view");
    } catch (error) {
      console.error("Failed to update milestone:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Échec de la mise à jour du jalon"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-white dark:bg-neutral-900 min-w-[70vw] max-h-[90vh] overflow-auto border-none rounded-none text-gray-800 dark:text-gray-200">
        {/* HEADER */}
        <DialogHeader className="px-8 py-4 bg-[#63A053] dark:bg-[#4e8742] text-white">
          <DialogTitle className="text-lg font-semibold">
            {isLoading || !data ? (
              <Skeleton className="h-5 w-64 bg-white/30" />
            ) : (
              <>
                Jalon {data.milestone.order_index} : {data.milestone.title}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
        {isLoading || !data ? (
          <JalonDetailsBodySkeleton />
        ) : mode === "view" ? (
          (() => {
            const { milestone, tasks, manager } = data;

            return (
              <div className="px-10 py-7 space-y-10">
                {/* TOP SECTION GRID */}
                <div className="grid grid-cols-12 gap-8">
                  {/* Description */}
                  <div className="col-span-6">
                    <p className="font-semibold text-sm mb-2">
                      Brève description
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {milestone.description || "—"}
                    </p>
                  </div>

                  {/* Date Start */}
                  <div className="col-span-2 space-y-1">
                    <p className="font-semibold text-sm">Date de début</p>
                    <p>{milestone.start_date || "—"}</p>
                    <p className="text-sm">{milestone.start_time || "—"}</p>

                    <div className="mt-5">
                      <p className="font-semibold text-sm">
                        Responsable du jalon
                      </p>
                      <div className="flex gap-3 mt-2">
                        <img
                          src="/images/profile.jpeg"
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{manager?.email || "—"}</p>
                          <p className="text-sm text-gray-500">Manager</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date End */}
                  <div className="col-span-2 space-y-1">
                    <p className="font-semibold text-sm">Date butoir</p>
                    <p>{milestone.end_date || "—"}</p>
                    <p className="text-sm">{milestone.end_time || "—"}</p>
                  </div>

                  {/* Priority */}
                  <div className="col-span-2">
                    <p className="font-semibold text-sm">Priorités</p>
                    <p className="capitalize">{milestone.priority}</p>
                  </div>
                </div>

                {/* DELIVERABLES */}
                <div>
                  <p className="text-sm italic mb-4">Livrables de ce jalon</p>

                  <div className="grid grid-cols-3 gap-10">
                    {tasks.length === 0 ? (
                      <p className="text-sm text-gray-500">Aucun livrable</p>
                    ) : (
                      tasks.map((task) => (
                        <div key={task.id}>
                          <hr className="mb-1" />
                          <div className="flex gap-4">
                            <FileText className="w-6 h-6 text-[#326EA6]" />
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <p className="text-xs">{task.category}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setMode("edit")}
                    className="px-6 py-2 bg-[#63A053] hover:bg-[#528a45] text-white rounded-xs"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="px-10 py-7">
            <MilestoneForm
              defaultValues={{
                title: data.milestone.title,
                description: data.milestone.description || "",
                startDate: data.milestone.start_date || "",
                endDate: data.milestone.end_date || "",
                startTime: data.milestone.start_time || "",
                endTime: data.milestone.end_time || "",
                priority: data.milestone.priority,
                managerId: data.milestone.manager_id || "",
              }}
              manager={{
                id: data.milestone.manager_id || "",
                name: data.manager?.fullName || "",
              }}
              onCancel={() => setMode("view")}
              onSubmit={handleSubmit}
              loading={isSubmitting}
              defaultTasks={(data.tasks || []).map((task) => ({
                id: task.id,
                name: task.title,
                category: task.category,
                description: task.description ?? "",
                file_format: task.file_format,
              }))}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
