"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useAssignedProjectDetails } from "@/hooks/useAssignedProjectDetails";
import { useTasksByMilestone } from "@/hooks/useTasksByMilestone";

interface Phase {
  step: number;
  title: string;
  status: string;
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams() as { projectId: string };

  const router = useRouter();
  const searchParams = useSearchParams();

  const milestoneFromUrl = searchParams.get("milestone");

  const { data: project, isLoading } = useAssignedProjectDetails(projectId);

  console.log("data", project);

  const activeMilestoneId = useMemo(() => {
    if (!project?.milestones?.length) return null;

    const milestoneIds = project.milestones.map((m) => m.id);

    if (milestoneFromUrl && milestoneIds.includes(milestoneFromUrl)) {
      return milestoneFromUrl;
    }

    return project.milestones[0].id;
  }, [project, milestoneFromUrl]);

  useEffect(() => {
    if (!activeMilestoneId) return;

    if (milestoneFromUrl !== activeMilestoneId) {
      router.replace(`?milestone=${activeMilestoneId}`, { scroll: false });
    }
  }, [activeMilestoneId, milestoneFromUrl, router]);

  // ✅ Tasks fetch only when milestone resolved
  const { data: tasks, isLoading: tasksLoading } = useTasksByMilestone(
    activeMilestoneId ?? ""
  );

  if (isLoading || !project) {
    return <p className="p-6">Loading project…</p>;
  }

  return <div className="p-0">hello</div>;
}
