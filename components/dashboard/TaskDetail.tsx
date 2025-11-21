import React, { useState } from "react";
import { ArrowLeft, List, Plus } from "lucide-react";
import { motion } from "framer-motion";
import AddTaskScreen from "./AddTaskScreen";

interface TaskDetailProps {
  onBack: () => void;
}

export const TaskDetail = ({ onBack }: TaskDetailProps) => {
  const [showAddTask, setShowAddTask] = useState(false);

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

  if (showAddTask) {
    return <AddTaskScreen onBack={() => setShowAddTask(false)} />;
  }

  return (
    <div
      className="bg-[#e8e8e8] dark:bg-[#121212] w-full flex flex-col transition-colors duration-300 relative"
      // inline style uses the --vh variable; fallback to 1vh if it's not set
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
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
            d="M1.4375 11H21.5625"
            stroke="#63A053"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.4375 5.25H21.5625"
            stroke="#63A053"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.4375 16.75H21.5625"
            stroke="#63A053"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Fixed Project Header Card */}
      <div className="px-4 pb-6 shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg mx-auto bg-[#63a053] rounded-xs px-6 py-6 shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-[#9dcc91] text-lg font-medium mb-1">Tâches</p>
            <h2 className="text-white text-2xl font-semibold">
              COLA NATURELLE
            </h2>
          </div>
          <List className="text-white opacity-50 w-10 h-10" />
        </motion.div>
      </div>

      {/* Scrollable Tasks List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 hide-scrollbar">
        <div className="w-full max-w-lg mx-auto space-y-3">
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
                  <p className="text-[#4a5568] dark:text-gray-400 text-lg font-medium mb-1">
                    {task.date}
                  </p>
                  <p
                    className={`text-xl font-medium mb-1 ${
                      task.status === "expired"
                        ? "text-[#a0aec0] dark:text-gray-500"
                        : "text-[#3182ce] dark:text-[#63b3ed]"
                    }`}
                  >
                    {task.description}
                  </p>
                  <p className="text-[#718096] dark:text-gray-400 text-lg">
                    {task.time}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-[#63a053] hover:bg-[#528a43] z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          onClick={() => setShowAddTask(true)}
          className="w-full h-16 text-white font-semibold text-xl flex items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Ajouter une tâche
        </button>
      </div>
    </div>
  );
};
