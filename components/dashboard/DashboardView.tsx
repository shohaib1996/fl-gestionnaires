/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import DashboardFilters from "./DashboardFilters";
import DashboardPagination from "./DashboardPagination";
import DashboardTabs from "./DashboardTabs";
import { HomeCandidate } from "./HomeCandidate";

interface Props {
  activeTab: "recu" | "mes-projets" | "encours";
  projects: any[];
  filters: any;
  loading: boolean;
  page: number;
  onTabChange: (tab: any) => void;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: any) => void;
}

export default function DashboardView({
  activeTab,
  projects,
  loading,
  filters,
  page,
  onTabChange,
  onPageChange,
  onFiltersChange,
}: Props) {
  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden">
        <HomeCandidate />
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="flex flex-col max-h-[71vh]">
          <DashboardTabs activeTab={activeTab} onChange={onTabChange} />

          <DashboardFilters values={filters} onChange={onFiltersChange} />

          {/* Cards */}
          <section className="flex-1 overflow-auto hide-scrollbar">
            {loading ? (
              <Centered text="Chargement des projets..." />
            ) : projects.length === 0 ? (
              <Centered text="Aucun projet trouvé" />
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
                    {projects.map((project) => (
                      <Link href={`/dashboard/${project.id}`} key={project.id}>
                        <article className="bg-white dark:bg-neutral-800 shadow-sm flex flex-col rounded-sm border-2 border-gray-200 hover:border-[#63A053] hover:scale-[0.97] transition-all duration-300 min-h-62">
                          <div className="bg-[#F3F7FF] dark:bg-blue-500/20 px-4 py-2 flex justify-between">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-xl">
                              {project.title ?? "Untitled Project"}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {project.claimed}
                            </span>
                          </div>
                          <div className="p-4 text-md text-gray-700 dark:text-gray-300">
                            <p className="text-sm text-gray-500 mb-1">
                              Reçu :{" "}
                              {new Date(project.created_at).toLocaleDateString(
                                "fr-FR"
                              )}
                            </p>
                            {project.description ?? "No description available"}
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

        <DashboardPagination page={page} onChange={onPageChange} />
      </div>
    </>
  );
}

function Centered({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-600 dark:text-gray-300">{text}</p>
    </div>
  );
}
