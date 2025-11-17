"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import AddTaskDialog from "@/components/modals/AddTaskDialog";
import TaskDetailsModal from "@/components/modals/TaskDetailsModal";

export default function LeftSidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [openAdd, setOpenAdd] = useState(false);

  // modal for task details
  const [openDetails, setOpenDetails] = useState(false);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);

  // sample participants (replace with real urls)
  const sampleParticipants = [
    { id: 1, img: "/images/Profil1.svg", name: "A" },
    { id: 2, img: "/images/Profil2.svg", name: "B" },
    { id: 3, img: "/images/Profil3.svg", name: "C" },
    { id: 4, img: "/images/Profil4.svg", name: "D" },
  ];

  const tasks = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    title: `Appel projet #${i + 1}`,
    date: "11 Mars 2025",
    time: "8:30 - 9:00",
    description:
      "Gather and validate all legal files required for the design drafts, or updated business registration, and operating licenses. Ensure the team is fully ready before moving to the next stage.",
    participants: sampleParticipants,
    location: "2445 North West Library",
  }));

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-neutral-800 shadow-sm border-0.5 border-black/10 rounded-xs overflow-hidden">
      {/* Add dialog */}
      <AddTaskDialog open={openAdd} onOpenChange={setOpenAdd} />

      {/* Task details modal */}
      <TaskDetailsModal
        open={openDetails}
        onOpenChange={setOpenDetails}
        task={
          activeTaskIndex !== null
            ? {
                title: tasks[activeTaskIndex].title,
                subtitle: tasks[activeTaskIndex].location,
                dateLabel: "Aujourd'hui",
                timeFrom: "11:00 AM",
                timeTo: "12:00",
                participants: tasks[activeTaskIndex].participants,
                description: tasks[activeTaskIndex].description,
              }
            : null
        }
      />

      <div className="shrink-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-full rounded-md "
        />
      </div>

      <h3 className="mt-4.5 mb-2.5 px-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
        Tâches
      </h3>

      <div className="flex-1 overflow-auto px-4 pb-4 hide-scrollbar">
        <div className="space-y-4 text-md">
          {tasks.map((t, i) => (
            <div
              key={t.id}
              className="pb-3 border-b border-gray-200 dark:border-neutral-700"
            >
              <p className="text-sm text-gray-400">{t.date}</p>

              {/* clickable title opens modal */}
              <p
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                onClick={() => {
                  setActiveTaskIndex(i);
                  setOpenDetails(true);
                }}
              >
                {t.title}
              </p>

              <p className="text-sm text-gray-500">{t.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 shrink-0">
        <Button
          className="w-full bg-[#63a053] hover:bg-[#528a45] rounded-xs text-sm py-2 cursor-pointer dark:text-white"
          onClick={() => setOpenAdd(true)}
        >
          + Ajouter
        </Button>
      </div>
    </aside>
  );
}
