"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useAssignedProjectDetails } from "@/hooks/useAssignedProjectDetails";
import { useCreateTask } from "@/hooks/useCreateTaks";
import { useTasksByMilestone } from "@/hooks/useTasksByMilestone";

import ProjectDetailsView from "@/components/dashboard/project-details/ProjectDetailsView";
import { AddDocumentPayload } from "@/types/task";

export default function ProjectDetailsContainer() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const milestoneFromUrl = searchParams.get("milestone");

  const { data: project, isLoading } = useAssignedProjectDetails(projectId);

  const activeMilestoneId =
    project?.milestones?.find((m) => m.id === milestoneFromUrl)?.id ??
    project?.milestones?.[0]?.id ??
    null;

  const { data: tasks, isLoading: tasksLoading } = useTasksByMilestone(
    activeMilestoneId ?? ""
  );

  const { mutateAsync: createTask } = useCreateTask();

  const handleTaskAdd = async (payload: AddDocumentPayload) => {
    if (!activeMilestoneId) return;

    try {
      await createTask({ ...payload, milestoneId: activeMilestoneId });
      toast.success("Task added successfully");
    } catch {
      toast.error("Error adding task");
    }
  };

  return (
    <ProjectDetailsView
      project={project}
      isLoading={isLoading}
      tasks={tasks}
      tasksLoading={tasksLoading}
      activeMilestoneId={activeMilestoneId}
      onMilestoneChange={(id: string) =>
        router.push(`?milestone=${id}`, { scroll: false })
      }
      onAddTask={handleTaskAdd}
    />
  );
}
