"use client";
import { getProjectMilestones } from "@/app/actions/milestones/getProjectMilestones";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Step {
  id: number;
  title: string;
  completed: boolean;
}

interface EvolutionDetailProps {
  onBack: () => void;
  project: {
    title: string;
    id: string;
  };
}

export const EvolutionDetail = ({ onBack, project }: EvolutionDetailProps) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMilestones() {
      try {
        const milestones = await getProjectMilestones(project.id);

        if (!milestones.success || !milestones.data) {
          throw new Error(milestones.message);
        }

        const mapped: Step[] = milestones.data.map((m: any) => ({
          id: m.order_index, // UI step number
          title: m.title,
          completed: Boolean(m.status === "completed"),
        }));

        setSteps(mapped);
      } finally {
        setLoading(false);
      }
    }

    loadMilestones();
  }, [project]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading evolution…
      </div>
    );
  }

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
          <Link href="/projects">
            <h1 className="font-bold text-[#63a053] text-2xl tracking-wide">
              FOND LOCAL
            </h1>
          </Link>
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
            <p className="text-[#9dcc91] text-xl font-medium mb-1">Evolution</p>
            <h2 className="text-white text-2xl font-semibold">
              {project.title}
            </h2>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            viewBox="0 0 55 52"
            fill="none"
          >
            <path
              d="M0 3C0 1.34314 1.34315 0 3 0H55V52H3C1.34315 52 0 50.6569 0 49V3Z"
              fill="white"
              fillOpacity="0.3"
            />
            <path
              d="M41.4004 17.5996V31.4004H12.5996V17.5996H41.4004Z"
              fill="#F4F4F4"
              fillOpacity="0.3"
              stroke="white"
              strokeWidth="0.8"
            />
            <path d="M15 20H31V29H15V20Z" fill="white" />
          </svg>
        </motion.div>

        {/* Steps List */}
        <div className="w-full max-w-lg mx-auto space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.1 + index * 0.1,
                duration: 0.4,
                type: "spring",
                stiffness: 100,
              }}
              className={`flex items-center px-6 py-4 rounded-xs shadow-sm cursor-pointer transition-all ${
                step.completed
                  ? "bg-[#63a053] hover:bg-[#528a45] text-white"
                  : "bg-white dark:bg-[#1e1e1e] text-[#2d3748] dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#2d2d2d]"
              }`}
            >
              {step.completed && <Check className="w-5 h-5 mr-3 shrink-0" />}
              <span className="font-medium text-2xl">
                {step.id}. {step.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
