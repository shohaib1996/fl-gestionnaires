"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HomeCandidate } from "@/components/dashboard/HomeCandidate";
import { getAllProjects } from "@/app/actions";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<
    "recu" | "mes projets" | "encours"
  >("recu");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Update active tab based on URL parameter
  useEffect(() => {
    if (tabFromUrl === "mes-projets") {
      setActiveTab("mes projets");
    } else if (tabFromUrl === "encours") {
      setActiveTab("encours");
    } else {
      setActiveTab("recu");
    }
  }, [tabFromUrl]);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const { data, error } = await getAllProjects();

      if (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
        return;
      }

      console.log("📋 All projects from database:", data);
      setProjects(data || []);
      setLoading(false);
    }

    fetchProjects();
  }, []);

  // Filter projects based on active tab
  const filteredProjects = projects.filter((project) => {
    if (activeTab === "recu") {
      return project.status === "submitted";
    }
    // For now, show nothing for other tabs
    // TODO: Implement "mes projets" and "encours" filters
    return false;
  });

  console.log(projects);

  return (
    <>
      {/* Mobile and Tablet View - Hidden on lg and above */}
      <div className="lg:hidden">
        <HomeCandidate />
      </div>

      {/* Desktop View - Hidden below lg breakpoint */}
      <div className="hidden lg:block">
        <div className="flex flex-col max-h-[71vh]">
          {/* Tabs */}
          <div className="flex gap-3 py-6 shrink-0">
            {[
              { key: "recu", label: "Reçus" },
              { key: "mes projets", label: "Mes projets" },
              { key: "encours", label: "En cours" },
            ].map(({ key, label }) => (
              <Button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={` text-white font-medium h-7 rounded-none w-24 transition-all ${
                  activeTab === key
                    ? "bg-[#63a053] scale-105 shadow-sm"
                    : "bg-[#326EA6] hover:bg-[#63a053]"
                }`}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-neutral-800 px-12 py-5 rounded-none shadow-sm shrink-0 mb-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
              Filtrer par :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              {[
                "Location",
                "Catégorie",
                "Date",
                "Name",
                "Identifiant FL (IFL)",
              ].map((label, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                  <Input
                    placeholder={
                      label === "Date"
                        ? "Sélectionner"
                        : "Taper ou sélectionner"
                    }
                    className="bg-gray-100 dark:bg-neutral-700 border-0 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#63a053]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Card Section - only this scrolls */}
          <section className="flex-1 overflow-auto hide-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-600 dark:text-gray-300">
                  Chargement des projets...
                </p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-600 dark:text-gray-300">
                  Aucun projet trouvé
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredProjects.map((project, i) => (
                      <Link href={`/dashboard/${project.id}`} key={project.id}>
                        <article className="bg-white dark:bg-neutral-800 shadow-sm flex flex-col rounded-sm border-2 border-gray-200 hover:border-[#63A053] hover:scale-[0.97] transition-all duration-300 min-h-62">
                          <div className="bg-[#F3F7FF] dark:bg-blue-500/20 px-4 py-2 flex justify-between">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-xl">
                              {project.title || "Untitled Project"}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {project.claimed}
                            </span>
                          </div>
                          <div className="p-4 text-md text-gray-700 dark:text-gray-300">
                            <p className="text-sm text-gray-500 mb-1">
                              Reçu :{" "}
                              {new Date(project.created_at).toLocaleDateString(
                                "fr-FR",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                            {project.description || "No description available"}
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </section>
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 text-sm mt-5 text-gray-500 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
          >
            <path
              d="M9.95898 0L19.9183 17.25H-0.000308037L9.95898 0Z"
              fill="#C7C7C7"
            />
          </svg>{" "}
          1-20{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
          >
            <path
              d="M9.95898 17.25L19.9183 0L-0.000308037 0L9.95898 17.25Z"
              fill="#C7C7C7"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
