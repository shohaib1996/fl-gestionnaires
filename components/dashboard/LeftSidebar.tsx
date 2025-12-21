"use client";

import AddTaskDialog from "@/components/modals/AddTaskDialog";
import TaskDetailsModal from "@/components/modals/TaskDetailsModal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useMemo, useState } from "react";

import { fr } from "date-fns/locale";

import { useMyCalendarEvents } from "@/hooks/useCalendarEvents";
import { format } from "date-fns";

export default function LeftSidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [openAdd, setOpenAdd] = useState(false);

  const { data: events = [], isLoading } = useMyCalendarEvents({
    from: date ? format(date, "yyyy-MM-dd") : undefined,
    // to: date ? format("2025-12-31", "yyyy-MM-dd") : undefined,
  });

  const eventDates = useMemo(() => {
    const dates = events.map((e) => new Date(e.start_date));

    return dates;
  }, [events]);

  // modal for task details
  const [openDetails, setOpenDetails] = useState(false);
  const [activeEvent, setActiveEvent] = useState<any | null>(null);

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-neutral-800 shadow-sm border-0.5 border-black/10 rounded-xs overflow-hidden">
      {/* Add dialog */}
      <AddTaskDialog open={openAdd} onOpenChange={setOpenAdd} />

      {/* Task details modal */}
      <TaskDetailsModal
        open={openDetails}
        onOpenChange={setOpenDetails}
        task={
          activeEvent
            ? {
                title: activeEvent.title,
                subtitle: activeEvent.location_label,
                dateLabel: format(
                  new Date(activeEvent.start_date),
                  "dd MMMM yyyy",
                  { locale: fr }
                ),
                timeFrom: activeEvent.start_time ?? "",
                timeTo: activeEvent.end_time ?? "",
                participants: [], // next step: real participants hook
                description: activeEvent.description,
              }
            : null
        }
      />

      <div className="shrink-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={fr}
          modifiers={{
            hasEvent: eventDates,
          }}
          modifiersClassNames={{
            hasEvent:
              "bg-[#63a053]/20 text-[#2f6f3e] font-semibold rounded-full",
          }}
          className="w-full rounded-md"
        />
      </div>

      <h3 className="mt-4.5 mb-2.5 px-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
        Tâches
      </h3>

      <div className="flex-1 overflow-auto px-4 pb-4 hide-scrollbar">
        <div className="space-y-4 text-md">
          {isLoading && <p className="text-sm text-gray-400">Chargement…</p>}

          {!isLoading && events.length === 0 && (
            <p className="text-sm text-gray-400">Aucune tâche</p>
          )}

          {events.map((e) => (
            <div
              key={e.id}
              className="pb-3 border-b border-gray-200 dark:border-neutral-700"
            >
              <p className="text-sm text-gray-400">
                {format(new Date(e.start_date), "dd MMM yyyy", { locale: fr })}
              </p>

              <p
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                onClick={() => {
                  setActiveEvent(e);
                  setOpenDetails(true);
                }}
              >
                {e.title}
              </p>

              {(e.start_time || e.end_time) && (
                <p className="text-sm text-gray-500">
                  {e.start_time ?? "--"} – {e.end_time ?? "--"}
                </p>
              )}
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
