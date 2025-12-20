"use client";

import AddDocumentModal from "@/components/modals/AddDocumentModal";
import CreateJalonModal from "@/components/modals/CreateJalonModal";
import EditDocumentModal from "@/components/modals/EditDocumentModal";
import JalonDetailsModal from "@/components/modals/JalonDetailsModal";
import { Ellipsis, Undo2, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { TasksByMilestone } from "@/app/actions/projects/milestones/tasks/getTasksByMilestone";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { Button } from "@/components/ui/button";
import { useAssignedProjectDetails } from "@/hooks/useAssignedProjectDetails";
import { useCreateTask } from "@/hooks/useCreateTaks";
import useEditTask from "@/hooks/useEditTask";
import { useTasksByMilestone } from "@/hooks/useTasksByMilestone";
import { getPublicFileUrl } from "@/lib/utils/getPublicFileUrl";
import { useUser } from "@/providers/UserProvider";
import { toast } from "sonner";
import TaskLists from "../../../../../components/sections/TaskLists";
import { MilestoneTabs } from "./MilestoneTabas";
import PreviewCard from "./PreviewCard";
import PreviewRenderer from "./PreviewRenderer";

interface Phase {
  step: number;
  title: string;
  status: string;
}

interface AddDocumentPayload {
  name: string;
  category: string | null;
  description: string;
  file_format: string;
}

const ProjectDetails = () => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false); // FULLSCREEN MODAL STATE
  const [jalonModalOpen, setJalonModalOpen] = useState(false);
  const [openAddDoc, setOpenAddDoc] = useState(false);
  const [openEditDoc, setOpenEditDoc] = useState(false);
  const [doc, setDoc] = useState<TasksByMilestone | null>(null);
  const [selectedTask, setSelectedTask] = useState<TasksByMilestone | null>(
    null
  );
  const { user } = useUser();

  const [jalonDetailsModalOpen, setJalonDetailsModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  const { projectId } = useParams() as { projectId: string };

  const router = useRouter();
  const searchParams = useSearchParams();

  const milestoneFromUrl = searchParams.get("milestone");

  const { data: project, isLoading } = useAssignedProjectDetails(projectId);

  const activeMilestoneId = useMemo(() => {
    if (!project?.milestones?.length) return null;

    const milestoneIds = project.milestones.map((m) => m.id);

    if (milestoneFromUrl && milestoneIds.includes(milestoneFromUrl)) {
      return milestoneFromUrl;
    }

    return project.milestones[0].id;
  }, [project, milestoneFromUrl]);

  console.log("seelctedTask", selectedTask);

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

  const { mutateAsync } = useCreateTask();
  const { editTaskAsync } = useEditTask(activeMilestoneId ?? "");
  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(phase);
    setJalonDetailsModalOpen(true);
  };

  console.log("data", project, tasks);

  if (!project || isLoading)
    return <div className="p-6 text-gray-500">Loading project...</div>;

  const handleTaskAdd = async (task: AddDocumentPayload) => {
    if (!activeMilestoneId) {
      toast.error("No active milestone selected");
      return;
    }

    const res = await mutateAsync({
      milestoneId: activeMilestoneId,
      title: task.name,
      description: task.description ?? undefined,
      category: task.category,
      file_format: task.file_format,
    });

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    setOpenAddDoc(false);
    toast.success("Task added successfully");
  };

  // const project = data.project;
  const handleDownload = async (url: string, filename = "file") => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Unable to download file.");
    }
  };
  const handlePrint = async (url: string, type: string) => {
    console.log("pdf", url, type);

    try {
      if (type === "image") {
        // Create a hidden window for printing
        const printWindow = window.open("", "_blank", "width=900,height=700");

        if (!printWindow)
          return toast.error("Popup blocked. Allow popups to print.");

        printWindow.document.write(`
        <html>
          <head>
            <title>Print Image</title>
            <style>
              body { margin: 0; padding: 0; text-align: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${url}" />
            <script>
              window.onload = () => {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
        printWindow.document.close();
      } else if (type === "pdf") {
        // PDF can be printed directly
        const printWindow = window.open(url, "_blank");
        if (!printWindow)
          return toast.error("Popup blocked. Allow popups to print.");

        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      } else if (type === "web") {
        const printWindow = window.open(url, "_blank");
        if (!printWindow) return toast.error("Popup blocked.");

        printWindow.onload = () => {
          printWindow.print();
        };
      } else if (type === "video") {
        toast.error(
          "Printing videos is not supported. Try downloading instead."
        );
      }
    } catch (err) {
      console.error("Print failed:", err);
      toast.error("Unable to print file.");
    }
  };

  return (
    <div className="p-0">
      {/* Header Tabs */}
      <div className="flex items-center gap-1 py-0">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          className="flex items-center justify-center bg-[#326EA6] hover:bg-[#285b8b] text-white rounded-none px-3 h-7"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <DashboardTabs
          activeTab={null}
          onChange={(key) => {
            router.push(`/dashboard?tab=${key}&page=1`);
          }}
          role={user?.role || "admin"}
        />
      </div>

      {/* Project Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-md shadow-sm border border-gray-200 dark:border-neutral-700 max-h-[72vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-4 bg-[#63a053]/25 p-4">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">
            {project.name}
          </h1>
          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-5">
            {project.project_id}
            <Ellipsis />
          </span>
        </div>

        {/* Phases */}
        <div className="flex flex-wrap gap-2 mb-4 px-3">
          <MilestoneTabs
            activeMilestoneId={activeMilestoneId}
            milestones={project.milestones}
            onChange={(milestoneId) => {
              router.push(
                `/dashboard/${projectId}/project/${projectId}?milestone=${milestoneId}`
              );
            }}
          />
          <button
            onClick={() => setJalonModalOpen(true)}
            className="ml-auto bg-[#63A053] text-white px-3 py-1 text-sm font-medium rounded-xs cursor-pointer"
          >
            + Jalon
          </button>
        </div>

        {/* Goal + Lead */}
        <div className="flex justify-between items-start mb-6 px-6">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              <strong>Goal:</strong> {project.goal}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={project.manager?.avatarURL || "/images/profile.jpeg"}
              alt={project.manager.name || "Manager"}
              width={40}
              height={40}
              className="rounded-full object-cover h-10"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {project.manager.role}
              </p>
              <p className="text-xs text-gray-500">
                {project.manager.name || "Manager"}
              </p>
            </div>
          </div>
        </div>

        {/* Table + Preview */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-6">
          {/* Documents Table */}
          {/* Table */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="px-3">
              <div className="border-t max-h-[48vh] min-h-[48vh] overflow-y-auto hide-scrollbar">
                {tasksLoading ? (
                  <p className="p-6 text-gray-500">Loading tasks…</p>
                ) : null}
                {!tasksLoading && tasks?.length === 0 ? (
                  <p className="p-6 text-gray-500">
                    No tasks for this milestone.
                  </p>
                ) : null}

                {!tasksLoading && tasks?.length ? (
                  <TaskLists
                    tasks={tasks}
                    setSelectedTask={setSelectedTask}
                    setOpenEditDoc={setOpenEditDoc}
                    setDoc={setDoc}
                    editTaskAsync={editTaskAsync}
                  />
                ) : null}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => setOpenAddDoc(true)}
                className="bg-[#63A053] text-white px-2.5 rounded-xs text-xl cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Preview card */}
          <PreviewCard
            handleDownload={handleDownload}
            handlePrint={handlePrint}
            setFullscreenOpen={setFullscreenOpen}
            previewURL={selectedTask?.document?.file_path || null}
          />
        </div>
      </div>

      {/* ===================================================== */}
      {/* ★ FULLSCREEN MODAL PREVIEW (IMAGE / VIDEO / WEB / PDF) */}
      {/* ===================================================== */}

      {fullscreenOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
          onClick={() => setFullscreenOpen(false)}
        >
          {/* Viewer container */}
          <div
            className="absolute inset-6 bg-transparent rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <PreviewRenderer
              variant="fullscreen"
              url={
                getPublicFileUrl(selectedTask?.document?.file_path || "") || ""
              }
            />

            {/* Close button */}
            <button
              onClick={() => setFullscreenOpen(false)}
              className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-black transition"
              aria-label="Close preview"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      <CreateJalonModal
        open={jalonModalOpen}
        onClose={() => setJalonModalOpen(false)}
        projectId={project.id}
        manager={project.manager}
      />
      {selectedPhase && (
        <JalonDetailsModal
          open={jalonDetailsModalOpen}
          onClose={() => setJalonDetailsModalOpen(false)}
          phase={selectedPhase}
        />
      )}
      <AddDocumentModal
        open={openAddDoc}
        onClose={() => setOpenAddDoc(false)}
        onSubmit={handleTaskAdd}
      />
      {doc && (
        <EditDocumentModal
          open={openEditDoc}
          onClose={() => {
            setOpenEditDoc(false);
            setDoc(null);
          }}
          doc={doc}
          milestoneId={activeMilestoneId ?? ""}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
