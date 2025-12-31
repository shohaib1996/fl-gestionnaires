"use client";

import { format, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Grip, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { useMyCalendarEvents } from "@/hooks/useCalendarEvents";
import { useUser } from "@/providers/UserProvider";
import Link from "next/link";

type UITask = {
  id: string;
  date: string;
  time: string;
  description: string;
  status: "expired" | "user" | "fond_local";
};

interface CalendarScreenProps {
  onBack: () => void;
  onAddTask: () => void;
}

export default function CalendarScreen({
  onBack,
  onAddTask,
}: CalendarScreenProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: tasks = [], isLoading } = useMyCalendarEvents({});

  const { user } = useUser();

  const currentUserId = user?.id ?? "";

  const uiTasks = useMemo(() => {
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

          type: status,

          color:
            status === "expired"
              ? "#D6D7D8"
              : status === "user"
              ? "#E8AD3F"
              : "#499EDB",

          textColor:
            status === "expired"
              ? "#FFFFFF"
              : status === "user"
              ? "#FFFFFF"
              : "#FFFFFF",
        };
      });
  }, [tasks, currentUserId]);

  const eventDates = useMemo(() => {
    return tasks
      .filter((e) => e.created_by === currentUserId)
      .map((e) => new Date(e.start_date));
  }, [tasks, currentUserId]);

  return (
    <div
      className="bg-[#e8e8e8] dark:bg-[#121212] w-full flex flex-col transition-colors duration-300 relative"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      {/* Header */}
      <div className="w-full h-24 flex items-center justify-between bg-[#F4F4F4] dark:bg-[#1e1e1e] shadow-sm px-6 mb-4 transition-colors duration-300 shrink-0">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-6 h-6 text-[#63a053]" />
        </button>

        <Link href="/projects">
          <h1 className="font-bold text-[#63a053] text-2xl tracking-wide">
            FOND LOCAL
          </h1>
        </Link>

        {/* Grid Menu Icon */}
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
          <Grip className="w-8 h-8 text-[#63a053]" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 hide-scrollbar">
        {/* Calendar Card */}
        <div className="bg-background rounded-xs p-4 mb-6 shadow-sm">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={fr}
            className="w-full"
            modifiers={{
              hasEvent: eventDates,
            }}
            modifiersClassNames={{
              hasEvent:
                "bg-[#63a053]/20 text-[#2f6f3e] font-semibold rounded-full",
            }}
            classNames={{
              caption_label: "text-xl font-semibold",
              day_button: "text-xl",
              weekday:
                "text-muted-foreground rounded-md flex-1 font-normal text-[1.2rem] select-none",
              button_previous: "p-0 flex items-center justify-center",
              button_next: "p-0 flex items-center justify-center",
            }}
          />
        </div>

        {/* Selected Date Info */}
        <div className="text-center mb-6">
          <p className="text-[#4a5568] dark:text-gray-300 text-lg font-medium">
            Votre programme Fond Local du{" "}
            {date ? format(date, "d MMMM", { locale: fr }) : ""}
          </p>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {uiTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xs p-0 flex overflow-hidden min-h-[70px]"
              style={{ backgroundColor: task.color }}
            >
              {/* Time Column */}
              <div className="w-1/3 flex items-center justify-center p-4 border-r border-white/20">
                <span className="text-[#4a5568] text-lg font-medium">
                  {task.time}
                </span>
              </div>

              {/* Description Column */}
              <div className="flex-1 flex items-center p-4 relative">
                {task.type !== "expired" && (
                  <div className="absolute left-3 w-2 h-2 bg-white rounded-full" />
                )}
                <p className="text-white text-lg font-medium leading-tight pl-4">
                  {task.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-[#63a053] hover:bg-[#528a43] z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          onClick={onAddTask}
          className="w-full h-16 text-white font-semibold text-xl flex items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Ajouter une tâche
        </button>
      </div>
    </div>
  );
}
