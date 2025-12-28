"use client";
import { MilestoneTabs } from "@/app/dashboard/[id]/project/[projectId]/MilestoneTabas";
import { useAssignedProjectDetails } from "@/hooks/useAssignedProjectDetails";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import TaskPreview from "./TaskPreview";
interface Props {
  onBack: () => void;
  project: {
    id: string;
    title: string;
  };
}

export default function Documents({ onBack, project: projectProps }: Props) {
  const { data: project, isLoading } = useAssignedProjectDetails(
    projectProps.id
  );
  //   console.log(data);
  const router = useRouter();
  const searchParams = useSearchParams();

  const milestoneFromUrl = searchParams.get("milestone");

  const activeMilestoneId = useMemo(() => {
    if (!project || !project?.milestones?.length) return null;

    const milestoneIds = project.milestones.map((m) => m.id);

    if (milestoneFromUrl && milestoneIds.includes(milestoneFromUrl)) {
      return milestoneFromUrl;
    }

    return project.milestones[0].id;
  }, [project, milestoneFromUrl]);

  //   console.log("seelctedTask", selectedTask);

  useEffect(() => {
    if (!activeMilestoneId) return;

    if (milestoneFromUrl !== activeMilestoneId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("milestone", activeMilestoneId);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [activeMilestoneId, milestoneFromUrl, router, searchParams]);

  if (!project) return null;
  return (
    <div className="bg-[#e8e8e8] dark:bg-[#121212] w-full min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="w-full h-24 flex items-center justify-between bg-white dark:bg-[#1e1e1e] shadow-sm px-6 mb-8 transition-colors duration-300">
        {/* Back Arrow */}
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-6 h-6 text-[#63a053]" />
        </button>

        {/* Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="font-bold text-[#63a053] text-2xl tracking-wide">
            FOND LOCAL
          </h1>
        </div>

        {/* Menu Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="22"
          viewBox="0 0 23 22"
          fill="none"
        >
          <path
            d="M5.30769 2.75C5.30769 4.26878 4.11952 5.5 2.65385 5.5C1.18817 5.5 0 4.26878 0 2.75C0 1.23122 1.18817 0 2.65385 0C4.11952 0 5.30769 1.23122 5.30769 2.75Z"
            fill="#63A053"
          />
          <path
            d="M5.30769 11C5.30769 12.5188 4.11952 13.75 2.65385 13.75C1.18817 13.75 0 12.5188 0 11C0 9.48122 1.18817 8.25 2.65385 8.25C4.11952 8.25 5.30769 9.48122 5.30769 11Z"
            fill="#63A053"
          />
          <path
            d="M5.30769 19.25C5.30769 20.7688 4.11952 22 2.65385 22C1.18817 22 0 20.7688 0 19.25C0 17.7312 1.18817 16.5 2.65385 16.5C4.11952 16.5 5.30769 17.7312 5.30769 19.25Z"
            fill="#63A053"
          />
          <path
            d="M14.1538 2.75C14.1538 4.26878 12.9657 5.5 11.5 5.5C10.0343 5.5 8.84615 4.26878 8.84615 2.75C8.84615 1.23122 10.0343 0 11.5 0C12.9657 0 14.1538 1.23122 14.1538 2.75Z"
            fill="#63A053"
          />
          <path
            d="M14.1538 11C14.1538 12.5188 12.9657 13.75 11.5 13.75C10.0343 13.75 8.84615 12.5188 8.84615 11C8.84615 9.48122 10.0343 8.25 11.5 8.25C12.9657 8.25 14.1538 9.48122 14.1538 11Z"
            fill="#63A053"
          />
          <path
            d="M14.1538 19.25C14.1538 20.7688 12.9657 22 11.5 22C10.0343 22 8.84615 20.7688 8.84615 19.25C8.84615 17.7312 10.0343 16.5 11.5 16.5C12.9657 16.5 14.1538 17.7312 14.1538 19.25Z"
            fill="#63A053"
          />
          <path
            d="M23 2.75C23 4.26878 21.8118 5.5 20.3462 5.5C18.8805 5.5 17.6923 4.26878 17.6923 2.75C17.6923 1.23122 18.8805 0 20.3462 0C21.8118 0 23 1.23122 23 2.75Z"
            fill="#63A053"
          />
          <path
            d="M23 11C23 12.5188 21.8118 13.75 20.3462 13.75C18.8805 13.75 17.6923 12.5188 17.6923 11C17.6923 9.48122 18.8805 8.25 20.3462 8.25C21.8118 8.25 23 9.48122 23 11Z"
            fill="#63A053"
          />
          <path
            d="M23 19.25C23 20.7688 21.8118 22 20.3462 22C18.8805 22 17.6923 20.7688 17.6923 19.25C17.6923 17.7312 18.8805 16.5 20.3462 16.5C21.8118 16.5 23 17.7312 23 19.25Z"
            fill="#63A053"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className="px-4 pb-6">
        {/* Project Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg mx-auto bg-[#63a053] rounded-xs px-6 py-6 mb-6 shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-[#9dcc91] text-xl font-medium mb-1">Documents</p>
            <h2 className="text-white text-2xl font-semibold">
              {projectProps.title}
            </h2>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            viewBox="0 0 55 52"
            fill="none"
            className="rounded-md"
          >
            <path
              d="M0 3C0 1.34314 1.34315 0 3 0H55V52H3C1.34315 52 0 50.6569 0 49V3Z"
              fill="currentColor"
              className="text-white dark:text-[#1e1e1e]"
              fillOpacity="0.3"
            />
            <path
              d="M28.2571 13C28.6877 13 29.101 13.1907 29.398 13.5265L34.4266 19.3113C34.7031 19.6251 34.8571 20.0419 34.8571 20.4739V34.9375C34.8571 35.3851 34.6916 35.8143 34.3969 36.1307C34.1022 36.4472 33.7025 36.625 33.2857 36.625H17.5714C17.1547 36.625 16.755 36.4472 16.4603 36.1307C16.1656 35.8143 16 35.3851 16 34.9375V14.6875C16 14.2399 16.1656 13.8107 16.4603 13.4943C16.755 13.1778 17.1547 13 17.5714 13H28.2571ZM33.2857 21.4375H27.7857C27.5773 21.4375 27.3775 21.3486 27.2301 21.1904C27.0828 21.0321 27 20.8175 27 20.5938V14.6875H17.5714V34.9375H33.2857V21.4375ZM21.5 31.5625C21.2916 31.5625 21.0918 31.4736 20.9444 31.3154C20.7971 31.1571 20.7143 30.9425 20.7143 30.7188C20.7143 30.495 20.7971 30.2804 20.9444 30.1221C21.0918 29.9639 21.2916 29.875 21.5 29.875H29.3571C29.5655 29.875 29.7654 29.9639 29.9127 30.1221C30.0601 30.2804 30.1429 30.495 30.1429 30.7188C30.1429 30.9425 30.0601 31.1571 29.9127 31.3154C29.7654 31.4736 29.5655 31.5625 29.3571 31.5625H21.5ZM21.5 26.5C21.2916 26.5 21.0918 26.4111 20.9444 26.2529C20.7971 26.0946 20.7143 25.88 20.7143 25.6562C20.7143 25.4325 20.7971 25.2179 20.9444 25.0596C21.0918 24.9014 21.2916 24.8125 21.5 24.8125H29.3571C29.5655 24.8125 29.7654 24.9014 29.9127 25.0596C30.0601 25.2179 30.1429 25.4325 30.1429 25.6562C30.1429 25.88 30.0601 26.0946 29.9127 26.2529C29.7654 26.4111 29.5655 26.5 29.3571 26.5H21.5ZM23.0714 40C22.863 40 22.6632 39.9111 22.5158 39.7529C22.3685 39.5946 22.2857 39.38 22.2857 39.1562C22.2857 38.9325 22.3685 38.7179 22.5158 38.5596C22.6632 38.4014 22.863 38.3125 23.0714 38.3125H36.4286V23.9688C36.4286 23.745 36.5114 23.5304 36.6587 23.3721C36.8061 23.2139 37.0059 23.125 37.2143 23.125C37.4227 23.125 37.6225 23.2139 37.7699 23.3721C37.9172 23.5304 38 23.745 38 23.9688V38.3125C38 38.7601 37.8344 39.1893 37.5397 39.5057C37.245 39.8222 36.8453 40 36.4286 40H23.0714Z"
              fill="#4C5660"
              className="dark:fill-gray-400"
            />
          </svg>
        </motion.div>

        {/* Steps List */}
        <div className="w-full max-w-lg mx-auto space-y-3">
          <div className="flex flex-wrap gap-2">
            <MilestoneTabs
              milestones={project?.milestones}
              activeMilestoneId={activeMilestoneId}
              onChange={(milestone) => {
                const params = new URLSearchParams(searchParams.toString());

                params.set("milestone", milestone.id);

                router.replace(`?${params.toString()}`, { scroll: false });
              }}
            />
          </div>
          {/* task list and preview */}
          <div>
            <TaskPreview
              activeMilestoneId={activeMilestoneId || ""}
              project={projectProps}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
