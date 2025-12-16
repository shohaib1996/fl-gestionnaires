"use client";

import AddDocumentModal from "@/components/modals/AddDocumentModal";
import CreateJalonModal from "@/components/modals/CreateJalonModal";
import EditDocumentModal from "@/components/modals/EditDocumentModal";
import JalonDetailsModal from "@/components/modals/JalonDetailsModal";
import {
  ArrowLeft,
  Download,
  Ellipsis,
  FileText,
  FolderPlus,
  Fullscreen,
  Globe,
  ImageDown,
  PlaySquare,
  Printer,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAssignedProjectDetails } from "@/hooks/useAssignedProjectDetails";
import { useCreateTask } from "@/hooks/useCreateTaks";
import { useTasksByMilestone } from "@/hooks/useTasksByMilestone";
import { AddDocumentPayload } from "@/types/task";
import { toast } from "sonner";
import { MilestoneTabs } from "./MilestoneTabas";
import TaskLists from "./TaskLists";

interface Phase {
  step: number;
  title: string;
  status: string;
}

interface ProjectData {
  project: {
    id: string;
    name: string;
    lead: { name: string; role: string };
    goal: string;
    phases: Phase[];
    documents: {
      id: string;
      name: string;
      date: string;
      description: string;
      category: string;
      status: string;
      type: string;
      file_format: string;
      file_path?: string | null;
    }[];
    preview: { image: string; type: string };
  };
}

const ProjectDetails = () => {
  const [data, setData] = useState<ProjectData | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false); // FULLSCREEN MODAL STATE
  const [jalonModalOpen, setJalonModalOpen] = useState(false);
  const [openAddDoc, setOpenAddDoc] = useState(false);
  const [openEditDoc, setOpenEditDoc] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    name: string;
    category: string;
    description: string;
    file_format: string;
    file_path?: string | null;
  } | null>(null);
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

  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(phase);
    setJalonDetailsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data/projectDetails.json");
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, []);

  console.log("data", project, tasks);

  if (!project || isLoading)
    return <div className="p-6 text-gray-500">Loading project...</div>;

  const handleTaskAdd = async (task: AddDocumentPayload) => {
    try {
      await mutateAsync({ ...task, milestoneId: activeMilestoneId ?? "" });
      setOpenAddDoc(false);
      toast.success("Task added successfully");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Error adding task");
    }
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
      alert("Unable to download file.");
    }
  };
  const handlePrint = async (url: string, type: string) => {
    try {
      if (type === "image") {
        // Create a hidden window for printing
        const printWindow = window.open("", "_blank", "width=900,height=700");

        if (!printWindow) return alert("Popup blocked. Allow popups to print.");

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
        if (!printWindow) return alert("Popup blocked. Allow popups to print.");

        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      } else if (type === "web") {
        const printWindow = window.open(url, "_blank");
        if (!printWindow) return alert("Popup blocked.");

        printWindow.onload = () => {
          printWindow.print();
        };
      } else if (type === "video") {
        alert("Printing videos is not supported. Try downloading instead.");
      }
    } catch (err) {
      console.error("Print failed:", err);
      alert("Unable to print file.");
    }
  };

  return (
    <div className="p-0">
      {/* Header Tabs */}
      <div className="flex items-center gap-1 py-6">
        <button className="bg-[#326EA6] hover:bg-[#275883] text-white px-3 py-1 rounded-none flex items-center gap-1 text-sm font-medium transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button className="bg-[#326EA6] hover:bg-[#275883] text-white px-4 py-1 text-sm">
          Partager
        </button>
        <button className="bg-[#4D7BB0] text-white px-4 py-1 text-sm">
          Reçus
        </button>
        <button className="bg-[#4D7BB0] text-white px-4 py-1 text-sm">
          Retenus
        </button>
        <button className="bg-[#4D7BB0] text-white px-4 py-1 text-sm">
          En cours
        </button>
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
              src="/images/profile.jpeg"
              alt={project.manager.name || "Project Lead"}
              width={40}
              height={40}
              className="rounded-full object-cover h-10"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {project.manager.name || "Project Lead"}
              </p>
              <p className="text-xs text-gray-500">{project.manager.role}</p>
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
                  <TaskLists tasks={tasks} />
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
              <FileText className="w-5 h-5 text-gray-500" />
              <ImageDown className="w-5 h-5 text-gray-500" />
              <PlaySquare className="w-5 h-5 text-gray-500" />
              <Globe className="w-5 h-5 text-gray-500" />
              <FolderPlus className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          {/* Preview card */}
          <div className="border border-gray-200 dark:border-neutral-700 rounded-md p-3 flex flex-col items-center">
            {project?.preview && (
              <Image
                src={project.preview?.image || ""}
                alt="Preview"
                width={400}
                height={500}
                className="rounded-md object-contain max-h-[44vh] min-w-[35vw]"
              />
            )}

            <div className="flex justify-center gap-3 mt-3">
              <button
                onClick={() =>
                  handleDownload(project.preview.image, "preview-download")
                }
                className="bg-[#E0EFFF] dark:bg-[#275883] p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>

              <button
                onClick={() => handlePrint(project.preview.image, "image")}
                className="bg-[#E0EFFF] dark:bg-[#275883] p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
                title="Print"
              >
                <Printer className="w-5 h-5" />
              </button>

              {/* FULLSCREEN CLICK */}
              <button
                onClick={() => setFullscreenOpen(true)}
                className="bg-[#E0EFFF] dark:bg-[#275883] p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
              >
                <Fullscreen className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* ★ FULLSCREEN MODAL PREVIEW (IMAGE / VIDEO / WEB / PDF) */}
      {/* ===================================================== */}

      {fullscreenOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-9999  p-4"
          onClick={() => setFullscreenOpen(false)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Viewer (supports future types) */}

            <Image
              src={project.preview.image}
              alt="Fullscreen preview"
              width={1400}
              height={1400}
              className="rounded-md object-contain max-h-[90vh]"
            />
            {/* Close button */}
            <button
              onClick={() => setFullscreenOpen(false)}
              className="absolute top-3 right-3 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition"
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
      {selectedDocument && (
        <EditDocumentModal
          open={openEditDoc}
          onClose={() => setOpenEditDoc(false)}
          doc={selectedDocument}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
