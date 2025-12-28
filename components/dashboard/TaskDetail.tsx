"use client";

import { motion } from "framer-motion";
import { ArrowLeft, List, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import type { CalendarEvent } from "@/hooks/useCalendarEvents";
import { useMyCalendarEvents } from "@/hooks/useCalendarEvents";
import { useUser } from "@/providers/UserProvider";
import { format, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import AddTaskScreen from "./AddTaskScreen";
import TaskDetailScreen from "./TaskDetailScreen";

interface TaskDetailProps {
  onBack: () => void;
  project: {
    id: string;
    title: string;
  };
}

type UITask = {
  id: string;
  date: string;
  time: string;
  description: string;
  status: "expired" | "user" | "fond_local";
  raw: CalendarEvent;
};

export const TaskDetail = ({ onBack, project }: TaskDetailProps) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CalendarEvent | null>(null);
  // const [tasks, setTasks] = useState<UITask[]>([]);
  const { user } = useUser();

  const { data: tasks = [], isLoading } = useMyCalendarEvents({});

  const currentUserId = user?.id ?? "";

  const uiTasks: UITask[] = useMemo(() => {
    if (!tasks.length) return [];

    const now = new Date();

    return tasks
      .filter((e) => e.created_by === currentUserId)
      .map((e) => {
        const endDateTime = new Date(`${e.end_date}T${e.end_time ?? "23:59"}`);

        const isExpired = isBefore(endDateTime, now);

        const status: UITask["status"] = isExpired
          ? "expired"
          : e.created_by && e.created_by === currentUserId
          ? "user"
          : "fond_local";

        return {
          id: e.id,

          date: format(new Date(e.start_date), "dd MMMM yyyy", {
            locale: fr,
          }),

          time:
            e.start_time && e.end_time
              ? `${e.start_time} - ${e.end_time}`
              : "Toute la journée",

          description:
            e.title ||
            (status === "expired"
              ? "Tâche expirée"
              : status === "user"
              ? "Tâche créée par vous"
              : "Tâche créée par Fond Local"),

          status,

          raw: e,
        };
      });
  }, [tasks, currentUserId]);

  console.log("📋 UI tasks:", uiTasks, isLoading);

  /* -------------------------------
   * Navigation states
   * ------------------------------- */
  if (showAddTask) {
    return <AddTaskScreen onBack={() => setShowAddTask(false)} />;
  }

  if (selectedTask) {
    return (
      <TaskDetailScreen
        task={selectedTask}
        onBack={() => setSelectedTask(null)}
      />
    );
  }

  /* -------------------------------
   * UI
   * ------------------------------- */
  return (
    <div
      className="bg-[#e8e8e8] dark:bg-[#121212] w-full flex flex-col relative"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      {/* Header */}
      <div className="w-full h-24 flex items-center justify-between bg-white shadow-sm px-6 mb-8 shrink-0">
        <button onClick={onBack} className="p-2 rounded-full">
          <ArrowLeft className="w-6 h-6 text-[#63a053]" />
        </button>

        <h1 className="font-bold text-[#63a053] text-2xl">FOND LOCAL</h1>

        <div className="w-6" />
      </div>

      {/* Project Card */}
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
              {project.title}
            </h2>
          </div>
          <List className="text-white opacity-50 w-10 h-10" />
        </motion.div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 hide-scrollbar">
        <div className="w-full max-w-lg mx-auto space-y-3">
          {isLoading ? (
            <p className="text-center text-gray-500">Chargement…</p>
          ) : uiTasks.length === 0 ? (
            <p className="text-center text-gray-500">
              Pas de tâches pour le moment.
            </p>
          ) : (
            uiTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.06,
                  duration: 0.35,
                  type: "spring",
                  stiffness: 120,
                }}
                onClick={() => setSelectedTask(task.raw)}
                className="bg-white rounded-xs shadow-sm p-4 cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-start gap-3">
                  {task.status === "user" && (
                    <div className="w-3 h-3 rounded-full bg-[#63a053] mt-1.5 shrink-0" />
                  )}

                  <div className="flex-1">
                    <p className="text-[#4a5568] text-lg font-medium mb-1">
                      {task.date}
                    </p>

                    <p
                      className={`text-xl font-medium mb-1 ${
                        task.status === "expired"
                          ? "text-[#a0aec0]"
                          : "text-[#3182ce]"
                      }`}
                    >
                      {task.description}
                    </p>

                    <p className="text-[#718096] text-lg">{task.time}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#63a053] z-50">
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
