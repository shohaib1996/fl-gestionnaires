import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { useUser } from "@/providers/UserProvider";
import DashboardFilters from "./DashboardFilters";
import DashboardPagination from "./DashboardPagination";
import DashboardTabs from "./DashboardTabs";

interface Props {
  activeTab: "recu" | "mes-projets" | "encours" | "reserve";
  projects: any[];
  filters: any;
  loading: boolean;
  page: number;
  total: number;
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
  total,
  onTabChange,
  onPageChange,
  onFiltersChange,
}: Props) {
  const { user } = useUser();

  return (
    <>
      {/* Desktop */}
      <div className="block">
        <div className="flex flex-col ">
          {/* Tabs */}

          <DashboardTabs
            activeTab={activeTab}
            onChange={onTabChange}
            role={user?.role || "admin"}
          />

          <DashboardFilters values={filters} onChange={onFiltersChange} />

          {/* Cards */}
          <section className="flex-1 overflow-auto hide-scrollbar min-h-[60vh]">
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
                  <div className="grid gap-x-1.5 gap-y-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {projects.map((project) => (
                      <Link href={`/dashboard/${project.id}`} key={project.id}>
                        <article className="bg-white dark:bg-neutral-800 shadow-sm dark:shadow-neutral-700/30 flex flex-col rounded-sm border-2 border-gray-200 dark:border-neutral-700 hover:border-[#63A053] dark:hover:border-[#7CB86D] hover:scale-[0.97] transition-all duration-300 min-h-[28vh]">
                          {/* Header */}
                          <div
                            className={`px-4 py-2 flex justify-between items-center ${
                              project.status === "in_progress"
                                ? "bg-[#AECDFF] dark:bg-blue-900/40"
                                : "bg-[#F3F7FF] dark:bg-blue-950/30"
                            } ${
                              project.status === "claimed"
                                ? "border-t-[2.5px] border-t-[#CEE1FF] dark:border-t-blue-800/60"
                                : ""
                            }`}
                          >
                            <h4 className="font-semibold text-[#454B53] dark:text-gray-100 text-[1.25rem] font-sans">
                              {project.title ?? "Untitled Project"}
                            </h4>

                            {/* Show claim count ONLY if claimed */}
                            {project.status === "claimed" &&
                              project.claim_count > 0 && (
                                <span className="text-[0.875rem] text-gray-500 dark:text-gray-400">
                                  {project.claim_count}
                                </span>
                              )}
                          </div>

                          {/* Body */}
                          <div className="p-4 text-[1rem] text-black dark:text-gray-300">
                            <p className="mb-1 text-gray-700 dark:text-gray-400">
                              Reçu :{" "}
                              {new Date(project.created_at).toLocaleDateString(
                                "fr-FR"
                              )}
                            </p>
                            <p className="text-gray-800 dark:text-gray-300">
                              {project.description
                                ? project.description.slice(0, 190) + "..."
                                : "No description available"}
                            </p>
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

        <DashboardPagination
          page={page}
          onChange={onPageChange}
          total={total}
        />
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
