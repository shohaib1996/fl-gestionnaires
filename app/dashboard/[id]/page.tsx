"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Ellipsis, Facebook, Linkedin, Twitter, Undo2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ImageGallery from "@/components/Gallery/ImageGallery";

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
  const router = useRouter()
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
    <div className="h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar px-4">
      {/* Header Tabs */}
      <header className="flex items-center gap-2 py-3">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          className="flex items-center justify-center bg-[#326EA6] hover:bg-[#285b8b] text-white rounded-none px-3 py-2"
        >
          <Undo2 className="h-4 w-4" />
        </Button>

        {/* Partager Button */}
        <Button className="bg-[#23405A] hover:bg-[#1d354a] text-white font-semibold rounded-none px-5 py-2">
          Partager
        </Button>

        {/* Reçus Button */}
        <Button className="bg-[#63a053] hover:bg-[#528a45] text-white font-semibold rounded-none px-5 py-2">
          Reçus
        </Button>

        {/* Retenus Button */}
        <Button className="bg-[#326EA6] hover:bg-[#275984] text-white font-semibold rounded-none px-5 py-2">
          Retenus
        </Button>

        {/* En cours Button */}
        <Button className="bg-[#326EA6] hover:bg-[#275984] text-white font-semibold rounded-none px-5 py-2">
          En cours
        </Button>
      </header>
      <div className="bg-background">
        {/* Project Header */}
        <section className="bg-white dark:bg-neutral-800 rounded-md shadow-sm border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-[#63a053]/25">
            <h2 className="text-xl font-semibold text-[#326EA6] dark:text-white">
              {project.title}
            </h2>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex gap-7">
              {project.code}
              <Ellipsis />
            </span>
          </div>
          <div className="px-6 py-5 space-y-6">
            {/* Category + Phase in grid */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Catégorie qui décrit le mieux le projet ou produit
                </label>
                <p className="bg-gray-100 dark:bg-neutral-700 px-3 py-2 rounded text-sm">
                  {project.category}
                </p>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Phase actuelle du projet
                </label>
                <p className="bg-gray-100 dark:bg-neutral-700 px-3 py-2 rounded text-sm">
                  {project.phase}
                </p>
              </div>
            </div>

            {/* Full-width description */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Description non confidentielle du projet ou produit
              </label>
              <p className="bg-gray-100 dark:bg-neutral-700 px-3 py-3 rounded text-sm leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <ImageGallery images={images} />

        {/* Entrepreneur Info */}
        <section className=" rounded-md border border-gray-200 dark:border-neutral-700 mt-6 mb-10 bg-card">
          <div className=" bg-[#63a053]/25 p-4 mb-6 ">
            <div className="px-6 flex justify-between items-center  ">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Entrepreneur{" "}
                <span className="font-normal ">{entrepreneur.name}</span>
              </h3>
              <span className="text-sm font-semibold text-gray-700 dark:text-white">
                {entrepreneur.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 text-sm p-6">
            <div>
              <label className="block text-gray-500 mb-1">Tuteur légal</label>
              <p>{entrepreneur.legal_tutor}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Collaborateurs</label>
              <p>{entrepreneur.collaborators}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">
                Ville ou village de résidence
              </label>
              <p>{entrepreneur.residence_city}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">
                Ville / village où se situe le projet
              </label>
              <p>{entrepreneur.project_city}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Province</label>
              <p>{entrepreneur.residence_province}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Téléphone</label>
              <p>{entrepreneur.phone}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Email</label>
              <p>{entrepreneur.email}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Website</label>
              <p>{entrepreneur.website}</p>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Liens</label>
              <div className="flex gap-4 mt-1">
                <a href={entrepreneur.social_links.facebook} target="_blank">
                  <Facebook className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                </a>
                <a href={entrepreneur.social_links.twitter} target="_blank">
                  <Twitter className="w-4 h-4 text-gray-600 hover:text-sky-500" />
                </a>
                <a href={entrepreneur.social_links.linkedin} target="_blank">
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
