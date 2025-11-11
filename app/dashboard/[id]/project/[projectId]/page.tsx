"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FileText,
  Video,
  Globe,
  FolderPlus,
  ImageDown,
  Share2,
  ArrowLeft,
} from "lucide-react";

interface ProjectData {
  project: {
    id: string;
    name: string;
    lead: { name: string; role: string };
    goal: string;
    phases: { step: number; title: string; status: string }[];
    documents: {
      date: string;
      description: string;
      category: string;
      status: string;
      type: string;
    }[];
    preview: { image: string; actions: string[] };
  };
}

const iconMap: Record<string, any> = {
  file: FileText,
  video: Video,
  web: Globe,
  folder: FolderPlus,
};

const ProjectDetails = () => {
  const [data, setData] = useState<ProjectData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data/projectDetails.json");
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, []);

  if (!data) return <div className="p-6 text-gray-500">Loading project...</div>;

  const project = data.project;

  return (
    <div className="p-0">
      {/* 🔹 Header Tabs */}
      <div className="flex items-center gap-1 px-4 py-2">
        <button className="bg-[#326EA6] hover:bg-[#275883] text-white px-3 py-1 rounded-sm flex items-center gap-1 text-sm font-medium transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button className="bg-[#326EA6] hover:bg-[#275883] text-white px-4 py-1 rounded-sm text-sm font-medium transition">
          Partager
        </button>
        <button className="bg-[#4D7BB0] hover:bg-[#3C6693] text-white px-4 py-1 rounded-sm text-sm font-medium transition">
          Reçus
        </button>
        <button className="bg-[#4D7BB0] hover:bg-[#3C6693] text-white px-4 py-1 rounded-sm text-sm font-medium transition">
          Retenus
        </button>
        <button className="bg-[#4D7BB0] hover:bg-[#3C6693] text-white px-4 py-1 rounded-sm text-sm font-medium transition">
          En cours
        </button>
      </div>

      {/* 🔹 Project Section */}
      <div className=" bg-white dark:bg-neutral-800 rounded-md shadow-sm border border-gray-200 dark:border-neutral-700 m-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-4 bg-[#63a053]/25 p-4">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">
            {project.name}
          </h1>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {project.id}
          </span>
        </div>

        {/* Phases */}
        <div className="flex flex-wrap gap-2 mb-4 px-6">
          {project.phases.map((phase) => (
            <button
              key={phase.step}
              className={`px-3 py-1 rounded-sm text-sm font-medium ${
                phase.status === "active"
                  ? "bg-[#63A053] text-white"
                  : "bg-[#63A053]/25 text-gray-800 dark:text-gray-200"
              }`}
            >
              {phase.step}. {phase.title}
            </button>
          ))}
          <button className="ml-auto bg-[#63A053] text-white px-3 py-1 text-sm font-medium rounded-sm hover:bg-[#528a45] transition">
            + Jalon
          </button>
        </div>

        {/* Goal & Lead */}
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
              alt={project.lead.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {project.lead.role}
              </p>
              <p className="text-xs text-gray-500">{project.lead.name}</p>
            </div>
          </div>
        </div>

        {/* Document Table + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-6">
          {/* Table */}
          <div className="lg:col-span-2 border border-gray-200 dark:border-neutral-700 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Description</th>
                  <th className="text-left px-4 py-2">Catégorie</th>
                  <th className="text-left px-4 py-2">Progression</th>
                </tr>
              </thead>
              <tbody>
                {project.documents.map((doc, i) => {
                  const Icon = iconMap[doc.type];
                  return (
                    <tr
                      key={i}
                      className={`border-t dark:border-neutral-700 hover:bg-blue-50 dark:hover:bg-neutral-700/50 transition ${
                        i === 1 ? "bg-blue-50 dark:bg-neutral-700/50" : ""
                      }`}
                    >
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                        {new Date(doc.date).toLocaleString("en-US", {
                          month: "short",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <Icon className="w-4 h-4 text-[#326EA6]" />
                        {doc.description}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                        {doc.category}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-100">
                        {doc.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Bottom action bar */}
            <div className="flex items-center gap-3 p-3 border-t bg-gray-50 dark:bg-neutral-800/50">
              <button className="bg-[#63A053] text-white p-2 rounded-sm hover:bg-[#528a45] transition">
                +
              </button>
              <FileText className="w-5 h-5 text-gray-500 hover:text-[#326EA6]" />
              <ImageDown className="w-5 h-5 text-gray-500 hover:text-[#326EA6]" />
              <Video className="w-5 h-5 text-gray-500 hover:text-[#326EA6]" />
              <Globe className="w-5 h-5 text-gray-500 hover:text-[#326EA6]" />
              <FolderPlus className="w-5 h-5 text-gray-500 hover:text-[#326EA6]" />
            </div>
          </div>

          {/* Preview */}
          <div className="border border-gray-200 dark:border-neutral-700 rounded-md p-3 flex flex-col items-center">
            <Image
              src={project.preview.image}
              alt="Preview"
              width={400}
              height={500}
              className="rounded-md object-contain"
            />
            <div className="flex justify-center gap-4 mt-3">
              <button className="bg-gray-100 dark:bg-neutral-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-600 transition">
                ⬇️
              </button>
              <button className="bg-gray-100 dark:bg-neutral-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-600 transition">
                ⤢
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
