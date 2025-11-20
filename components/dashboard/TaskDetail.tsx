import React from "react";
import { ArrowLeft, List, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface TaskDetailProps {
  onBack: () => void;
}

export const TaskDetail = ({ onBack }: TaskDetailProps) => {
  const tasks = [
    {
      id: 1,
      date: "11 Mars 2026",
      description: "Expired or overdue task or appointment",
      time: "11:00 - 12:00",
      status: "expired", // gray/default
    },
    {
      id: 2,
      date: "13 Mars 2026",
      description: "Task or appointment set by Fond Local",
      time: "11:00 - 12:00",
      status: "fond-local", // blue text
    },
    {
      id: 3,
      date: "16 Mars 2026",
      description: "Task or appointment set by User",
      time: "11:00 - 12:00",
      status: "user", // green dot + blue text
    },
    {
      id: 4,
      date: "13 Mars 2026",
      description: "Task or appointment set by Fond Local",
      time: "11:00 - 12:00",
      status: "fond-local",
    },
    {
      id: 5,
      date: "16 Mars 2026",
      description: "Task or appointment set by User",
      time: "11:00 - 12:00",
      status: "user",
    },
    {
      id: 6,
      date: "16 Mars 2026",
      description: "Task or appointment set by User",
      time: "11:00 - 12:00",
      status: "user",
    },
    {
      id: 7,
      date: "16 Mars 2026",
      description: "Task or appointment set by User",
      time: "11:00 - 12:00",
      status: "user",
    },
    {
      id: 8,
      date: "16 Mars 2026",
      description: "Task or appointment set by User",
      time: "11:00 - 12:00",
      status: "user",
    },
    {
      id: 9,
      date: "16 Mars 2026",
      description: "Task or appointment set by User",
      time: "11:00 - 12:00",
      status: "user",
    },
    {
      id: 10,
      date: "16 Mars 2026",
      description: "Task or appointment set by User",
      time: "11:00 - 12:00",
      status: "user",
    },
  ];

  return (
    <div className="bg-[#e8e8e8] h-screen dark:bg-[#121212] w-full flex flex-col transition-colors duration-300 relative">
      {/* Header */}
      <div className="w-full h-24 flex items-center justify-between bg-white dark:bg-[#1e1e1e] shadow-sm px-6 mb-8 transition-colors duration-300 shrink-0">
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

      {/* Fixed Project Header Card */}
      <div className="px-4 pb-6 shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto bg-[#63a053] rounded-xs px-6 py-6 shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-[#9dcc91] text-sm font-medium mb-1">Tâches</p>
            <h2 className="text-white text-base font-semibold">
              COLA NATURELLE
            </h2>
          </div>
          <List className="text-white opacity-50 w-10 h-10" />
        </motion.div>
      </div>

      {/* Scrollable Tasks List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 hide-scrollbar">
        <div className="w-full max-w-md mx-auto space-y-3">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.1 + index * 0.1,
                duration: 0.4,
                type: "spring",
                stiffness: 100,
              }}
              className="bg-white dark:bg-[#1e1e1e] rounded-xs shadow-sm p-4 transition-colors duration-300"
            >
              <div className="flex items-start gap-3">
                {task.status === "user" && (
                  <div className="w-3 h-3 rounded-full bg-[#63a053] mt-1.5 shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-[#4a5568] dark:text-gray-400 text-sm font-medium mb-1">
                    {task.date}
                  </p>
                  <p
                    className={`text-base font-medium mb-1 ${
                      task.status === "expired"
                        ? "text-[#a0aec0] dark:text-gray-500"
                        : "text-[#3182ce] dark:text-[#63b3ed]"
                    }`}
                  >
                    {task.description}
                  </p>
                  <p className="text-[#718096] dark:text-gray-400 text-sm">
                    {task.time}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#63a053] hover:bg-[#528a43] transition-colors">
        <button className="w-full h-16 text-white font-semibold text-lg flex items-center justify-center gap-2">
          <Plus className="w-6 h-6" />
          Ajouter une tâche
        </button>
      </div>
    </div>
  );
};
