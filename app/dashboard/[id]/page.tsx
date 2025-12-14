"use client";

import { getProjectById } from "@/app/actions";
import ClaimerSection from "@/components/dashboard/ClaimerSection";
import ProjectActionsMenu from "@/components/dashboard/ProjectActions";
import ImageGallery from "@/components/Gallery/ImageGallery";
import { Button } from "@/components/ui/button";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useUser } from "@/providers/UserProvider";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Project {
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
  logo_url: string;
  logo_urls: string[]; // Array of logo image URLs
  claimed: number;
  status: string;
  created_at: string;
  project_id: string;
}

const ProjectDetails = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { claim, approve, decline, invite } = useProjectActions();
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;

      const { data, error } = await getProjectById(id);

      if (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
        return;
      }

      console.log("📋 Project details:", data);
      setProject(data);
      setLoading(false);
    }

    fetchProject();
  }, [id]);

  if (loading || userLoading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-600 dark:text-gray-300">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center text-gray-600 dark:text-gray-300">
        Project not found
      </div>
    );
  }

  return (
    // make this a column so header stays fixed and the content below scrolls
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header Tabs - keep styles but prevent it from shrinking/scrolling */}
      <header className="flex items-center gap-2 py-6 shrink-0">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          className="flex items-center justify-center bg-[#326EA6] hover:bg-[#285b8b] text-white rounded-none px-3 h-7"
        >
          <Undo2 className="h-4 w-4" />
        </Button>

        {/* Reçus Button */}
        <Link href="/dashboard?tab=recu">
          <Button className="bg-[#63a053] hover:bg-[#528a45] text-white font-semibold rounded-none text-xs h-7">
            Reçus
          </Button>
        </Link>

        {/* Mes projets Button */}
        <Link href="/dashboard?tab=mes-projets">
          <Button className="bg-[#326EA6] hover:bg-[#275984] text-white font-semibold rounded-none text-xs h-7">
            Mes projets
          </Button>
        </Link>

        {/* En cours Button */}
        <Link href="/dashboard?tab=encours">
          <Button className="bg-[#326EA6] hover:bg-[#275984] text-white font-semibold rounded-none text-xs h-7">
            En cours
          </Button>
        </Link>
      </header>

      {/* Make THIS container the scroller (fills remaining height) */}
      <div className="flex-1 bg-background rounded-xs border-0.5 border-black/20 overflow-y-auto hide-scrollbar">
        {/* Project Header */}
        <section className="bg-white dark:bg-neutral-800 rounded-xs ">
          <div className="flex items-center justify-between py-4 px-11 bg-[#63a053]/25">
            <Link href={`/dashboard/${id}/project/${id}`}>
              <h2 className="text-2xl text-[#7F7E83] font-bold dark:text-white relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-[#326EA6] after:transition-all after:duration-300 hover:after:w-full">
                {project.title}
              </h2>
            </Link>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-7">
              ID: {project.project_id}
              {user && (
                <ProjectActionsMenu
                  onInvite={() => invite(project.email)}
                  onClaim={() =>
                    claim({ project_id: project.id, claimed_by: user.id })
                  }
                  onApprove={() => approve(id)}
                  onDecline={() => decline(id)}
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
        {project.status === "claimed" && (
          <ClaimerSection projectId={project.id} />
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
