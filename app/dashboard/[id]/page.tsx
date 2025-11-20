"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Ellipsis, Facebook, Linkedin, Twitter, Undo2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ImageGallery from "@/components/Gallery/ImageGallery";
import Link from "next/link";

interface ProjectData {
  project: {
    title: string;
    number: number;
    code: string;
    category: string;
    phase: string;
    description: string;
  };
  images: string[];
  entrepreneur: {
    name: string;
    status: string;
    legal_tutor: string;
    collaborators: string;
    residence_city: string;
    project_city: string;
    residence_province: string;
    phone: string;
    email: string;
    website: string;
    social_links: {
      linkedin: string;
      facebook: string;
      twitter: string;
    };
  };
  scores: {
    project_score: number;
  };
}

const ProjectDetails = () => {
  const [data, setData] = useState<ProjectData | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    fetch("/data/projects.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error fetching project data:", err));
  }, [id]);

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-gray-600 dark:text-gray-300">
        Loading project details...
      </div>
    );
  }

  const { project, images, entrepreneur } = data;

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

        {/* Partager Button */}
        <Button className="bg-[#23405A] hover:bg-[#1d354a] text-white font-semibold rounded-none text-xs h-7">
          Partager
        </Button>

        {/* Reçus Button */}
        <Button className="bg-[#63a053] hover:bg-[#528a45] text-white font-semibold rounded-none text-xs h-7">
          Reçus
        </Button>

        {/* Retenus Button */}
        <Button className="bg-[#326EA6] hover:bg-[#275984] text-white font-semibold rounded-none text-xs h-7">
          Retenus
        </Button>

        {/* En cours Button */}
        <Button className="bg-[#326EA6] hover:bg-[#275984] text-white font-semibold rounded-none text-xs h-7">
          En cours
        </Button>
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
              {project.code}
              <Ellipsis />
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
                <p className="px-3 py-2 rounded text-sm">{project.category}</p>
              </div>

              <div className="col-start-4">
                <label className="block mb-1">
                  <span className="text-sm bg-[#F2F6F8] dark:bg-neutral-700 py-3 px-3 text-gray-500 dark:text-white">
                    Phase actuelle du projet
                  </span>
                </label>
                <p className="px-3 py-2 rounded text-sm">{project.phase}</p>
              </div>
            </div>

            {/* Full-width description */}
            <div>
              <label className="block text-xs bg-[#F2F6F8] dark:bg-neutral-700 py-3 px-3 text-gray-500 dark:text-white mb-3">
                Description non confidentielle du projet ou produit
              </label>
              <p className="bg-[#FFFFFB] dark:bg-[#262626] px-3 py-3 rounded text-sm leading-relaxed border-b">
                {project.description}
              </p>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <ImageGallery images={images} />

        {/* Entrepreneur Info */}
        <section className=" mt-6 pb-10 bg-card">
          <div className="bg-[#63a053]/25 p-4 mb-6">
            <div className="px-6 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Entrepreneur{" "}
                <span className="font-normal ">{entrepreneur.name}</span>
              </h3>
              <span className="text-sm font-semibold text-gray-700 dark:text-white">
                {entrepreneur.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 text-sm px-11">
            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Tuteur légal
              </label>
              <p>{entrepreneur.legal_tutor}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Collaborateurs
              </label>
              <p>{entrepreneur.collaborators}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Ville ou village de résidence
              </label>
              <p>{entrepreneur.residence_city}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Ville / village où se situe le projet
              </label>
              <p>{entrepreneur.project_city}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Province
              </label>
              <p>{entrepreneur.residence_province}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Téléphone
              </label>
              <p>{entrepreneur.phone}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Email
              </label>
              <p>{entrepreneur.email}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Website
              </label>
              <p>{entrepreneur.website}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1 bg-gray-500/20 dark:bg-gray-800/20">
                Liens
              </label>
              <div className="flex gap-4 mt-1">
                <a
                  href={entrepreneur.social_links.facebook}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Facebook className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                </a>
                <a
                  href={entrepreneur.social_links.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Twitter className="w-4 h-4 text-gray-600 hover:text-sky-500" />
                </a>
                <a
                  href={entrepreneur.social_links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin className="w-4 h-4 text-gray-600 hover:text-blue-700" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetails;
