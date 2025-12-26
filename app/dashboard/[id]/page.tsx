"use client";

import {
  Claimer,
  getProjectById,
  declineProject,
  reserveProject,
} from "@/app/actions/projects/projects.action";
import { assignProjectToAdmin } from "@/app/actions/projects/assignProjectToAdmin";
import { sendProjectNotification } from "@/app/actions/emails/sendNotification";
import ClaimerSection from "@/components/dashboard/ClaimerSection";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import ProjectActionsMenu from "@/components/dashboard/ProjectActionsMenu";
import ImageGallery from "@/components/Gallery/ImageGallery";
import { Button } from "@/components/ui/button";
import { useProjectActions } from "@/hooks/useProjectActions";
import { getProjectActions } from "@/lib/project/getProjectActions";
import { useUser } from "@/providers/UserProvider";
import { ProjectStatus } from "@/types/status";
import { Ellipsis, Undo2, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface Project {
  id: string;
  first_name: string;
  last_name: string;
  parent_name: string;
  phone: string;
  email: string;
  project_city: string;
  residence_city: string;
  province: string;
  collaborators: any;
  title: string;
  description: string;
  categories: string[];
  phase: string;
  links: string[];
  signature: string;
  signer_name: string;
  logo_urls: string[];
  claimed: number;
  claimer: Claimer | null;
  status: ProjectStatus;
  created_at: string;
  project_id: string;
  claim_id?: string;
}

const ProjectDetails = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { claim, approve } = useProjectActions();
  const { user, loading: userLoading } = useUser();

  const fetchProject = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    console.log("Fetching project with ID:", id);
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await getProjectById(id);

      if (error || !data || !data.status) {
        console.error("Error fetching project:", error);
        setErrorMsg(error || "Project not found or invalid data");
        setLoading(false);
        return;
      }

      const mappedProject: Project = {
        id: data.id,
        project_id: data.project_id,
        first_name: data.first_name ?? "",
        last_name: data.last_name ?? "",
        parent_name: data.parent_name ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        project_city: data.project_city ?? "",
        residence_city: data.residence_city ?? "",
        province: data.province ?? "",
        collaborators: data.collaborators ?? null,
        title: data.title ?? "",
        description: data.description ?? "",
        categories: data.categories ?? [],
        links: data.links ?? [],
        phase: data.phase ?? "",
        signature: data.signature ?? "",
        signer_name: data.signer_name ?? "",
        logo_urls: data.logo_urls ?? [],
        claimed: data.claim_count ?? 0,
        claimer: data.claimer ?? null,
        status: data.status,
        created_at: data.created_at ?? "",
        claim_id: data.claim_id,
      };

      console.log("Setting project data:", mappedProject.title);
      setProject(mappedProject);
      setLoading(false);
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setErrorMsg(err.message || "Unexpected error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (userLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="flex h-full items-center justify-center text-red-600">
        Unauthorized access
      </div>
    );
  }

  if (!project && !loading) {
    return (
      <div className="flex flex-col gap-2 h-full items-center justify-center text-gray-600 dark:text-gray-300">
        <p>Project not found</p>
        <p className="text-sm text-red-500">{errorMsg}</p>
        <p className="text-xs text-gray-400">ID: {id}</p>
      </div>
    );
  }

  if (!project) return;
  if (!user) return;

  const actions = getProjectActions({
    role: user.role,
    status: project.status,
  });

  const handleClaim = () => {
    if (user.role !== "admin") return;
    if (project.status !== "submitted") return;

    claim({ projectId: project.id, userId: user.id });
  };

  const handleApprove = () => {
    if (user.role !== "super_admin") return;
    if (project.status !== "claimed") return;

    approve(project.id);
  };

  const handleDecline = async () => {
    if (user.role !== "super_admin") return;

    const result = await declineProject(project.id);
    if (result.success) {
      toast.success("Project declined successfully");
      // Navigate back to dashboard after declining
      router.push("/dashboard?tab=recu&page=1");
    } else {
      toast.error(result.message || "Failed to decline project");
    }
  };

  const handleReserve = async () => {
    if (user.role !== "super_admin") return;

    const result = await reserveProject(project.id);
    if (result.success) {
      toast.success("Project reserved successfully");
      // Navigate back to dashboard after reserving
      router.push("/dashboard?tab=reserve&page=1");
    } else {
      toast.error(result.message || "Failed to reserve project");
    }
  };

  const handleAssign = async (adminId: string) => {
    if (user.role !== "super_admin") return;

    const result = await assignProjectToAdmin(project.id, adminId);
    if (result.success) {
      toast.success("Project assigned successfully");
      // Refresh project data to show updated status
      await fetchProject();
    } else {
      toast.error(result.message || "Failed to assign project");
    }
  };

  const handleSendEmail = async () => {
    if (!project.email) {
      toast.error("Project has no email address associated.");
      return;
    }

    toast.info("Sending notification...");
    const result = await sendProjectNotification(project.id, project.email);

    if (result.success) {
      toast.success("Email sent successfully");
    } else {
      toast.error(result.message || "Failed to send email");
    }
  };

  const handleRedirect = () => {
    if (project.status !== "in_progress") {
      return toast.message("Project is not assigned yet");
    }
    router.push(`/dashboard/${id}/project/${id}`);
  };

  return (
    // make this a column so header stays fixed and the content below scrolls
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header Tabs - keep styles but prevent it from shrinking/scrolling */}
      <header className="flex items-center gap-2 py-0 shrink-0">
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
      </header>

      {/* Make THIS container the scroller (fills remaining height) */}
      <div className="flex-1 bg-background rounded-xs border-0.5 border-black/20 overflow-y-auto hide-scrollbar">
        {/* Project Header */}
        <section className="bg-white dark:bg-neutral-800 rounded-xs ">
          <div className="flex items-center justify-between py-4 px-11 bg-[#63a053]/25">
            <h2
              onClick={handleRedirect}
              className="text-2xl text-[#7F7E83] font-bold dark:text-white relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-[#326EA6] after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
            >
              {project.title}
            </h2>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-7">
              ID: {project.project_id}
              {project.status === "in_progress" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full p-1 transition-colors">
                      <Ellipsis className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={handleSendEmail}
                      className="flex gap-2 cursor-pointer"
                    >
                      <Mail className="h-4 w-4" />
                      Envoyer demande / approuver
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {actions?.length > 0 && (
                <ProjectActionsMenu
                  actions={actions}
                  onClaim={handleClaim}
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                  onReserve={handleReserve}
                  onAssign={handleAssign}
                  projectStatus={project.status}
                />
              )}
            </span>
          </div>
          <div className="px-11 py-5 space-y-6">
            {/* Category + Phase in grid */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <label className="block mb-1">
                  <span className="bg-[#F2F6F8] dark:bg-neutral-700 text-sm py-3 px-3 text-gray-500 dark:text-white">
                    Catégorie qui décrit le mieux le projet ou produit
                  </span>
                </label>
                <p className="px-3 py-2 rounded text-sm">
                  {project.categories?.join(", ") || "Non spécifié"}
                </p>
              </div>

              <div className="col-start-4">
                <label className="block mb-1">
                  <span className="text-sm bg-[#F2F6F8] dark:bg-neutral-700 py-3 px-3 text-gray-500 dark:text-white">
                    Phase actuelle du projet
                  </span>
                </label>
                <p className="px-3 py-2 rounded text-sm">
                  {project.phase || "Non spécifié"}
                </p>
              </div>
            </div>

            {/* Full-width description */}
            <div>
              <label className="block text-xs bg-[#F2F6F8] dark:bg-neutral-700 py-3 px-3 text-gray-500 dark:text-white mb-3">
                Description non confidentielle du projet ou produit
              </label>
              <p className="bg-[#FFFFFB] dark:bg-[#262626] px-3 py-3 rounded text-sm leading-relaxed border-b">
                {project.description || "Aucune description disponible"}
              </p>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        {project.logo_urls && project.logo_urls.length > 0 && (
          <ImageGallery images={project.logo_urls} />
        )}

        {/* Entrepreneur Info */}
        <section className=" mt-6 pb-10 bg-card">
          <div className="bg-[#63a053]/25 p-4 mb-6">
            <div className="px-6 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Entrepreneur{" "}
                <span className="font-normal ">
                  {project.first_name} {project.last_name}
                </span>
              </h3>
              <span className="text-sm font-semibold text-gray-700 dark:text-white">
                {project.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 text-sm px-11">
            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Tuteur légal
              </label>
              <p>{project.parent_name || "Non spécifié"}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Collaborateurs
              </label>
              <div>
                {project.collaborators &&
                typeof project.collaborators === "string" ? (
                  (() => {
                    try {
                      const collabs = JSON.parse(project.collaborators);
                      if (Array.isArray(collabs) && collabs.length > 0) {
                        return collabs.map((collab: any, idx: number) => (
                          <p key={idx} className="mb-1">
                            {collab.firstName} {collab.lastName} ({collab.email}
                            )
                          </p>
                        ));
                      }
                      return <p>Aucun</p>;
                    } catch {
                      return <p>Aucun</p>;
                    }
                  })()
                ) : Array.isArray(project.collaborators) &&
                  project.collaborators.length > 0 ? (
                  project.collaborators.map((collab: any, idx: number) => (
                    <p key={idx} className="mb-1">
                      {collab.firstName} {collab.lastName} ({collab.email})
                    </p>
                  ))
                ) : (
                  <p>Aucun</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Ville ou village de résidence
              </label>
              <p>{project.residence_city || "Non spécifié"}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Ville / village où se situe le projet
              </label>
              <p>{project.project_city || "Non spécifié"}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Province
              </label>
              <p>{project.province || "Non spécifié"}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Téléphone
              </label>
              <p>{project.phone || "Non spécifié"}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Email
              </label>
              <p>{project.email || "Non spécifié"}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Liens
              </label>
              <div className="flex gap-4 mt-1">
                {project.links && project.links.length > 0 ? (
                  project.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {link}
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500">Aucun lien disponible</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Claimers ===== */}
        {user.role === "super_admin" && project.claimer && (
          <ClaimerSection
            claimer={project.claimer}
            projectId={project.id}
            onRejectSuccess={fetchProject}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
