"use client";

import AddTaskDialog from "@/components/modals/AddTaskDialog";
import TaskDetailsModal from "@/components/modals/TaskDetailsModal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useMemo, useState } from "react";

import { fr } from "date-fns/locale";

import { useCalendarEventDetails } from "@/hooks/useCalendarEventDetails";
import { useMyCalendarEvents } from "@/hooks/useCalendarEvents";
import { useEventParticipants } from "@/hooks/useEventParticipants";
import { format, isSameDay } from "date-fns";

export default function LeftSidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [openAdd, setOpenAdd] = useState(false);

  // Fetch ALL events (no date filter) so we have dots for past/future
  const {
    data: events = [],
    isLoading,
    error,
    isError,
  } = useMyCalendarEvents({});

  // Log errors for debugging
  if (isError) {
    console.error("Calendar events error:", error);
  }

  const eventDates = useMemo(() => {
    const dates = events.map((e) => new Date(e.start_date));
    return dates;
  }, [events]);

  // Filter functionality: Show events for the selected date ONLY
  const filteredEvents = useMemo(() => {
    if (!date) return [];
    return events.filter((e) => isSameDay(new Date(e.start_date), date));
  }, [events, date]);

  // modal for task details
  const [openDetails, setOpenDetails] = useState(false);
  const [activeEvent, setActiveEvent] = useState<any | null>(null);

  const { data: event, isLoading: loadingEvent } = useCalendarEventDetails(
    activeEvent?.id
  );

  const { data: participants = [], isLoading: loadingParticipants } =
    useEventParticipants(activeEvent?.id);

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-neutral-800 shadow-sm border-0.5 border-black/10 rounded-xs overflow-hidden">
      {/* Add dialog */}
      <AddTaskDialog open={openAdd} onOpenChange={setOpenAdd} />

      {/* Task details modal */}
      <TaskDetailsModal
        open={openDetails}
        onOpenChange={setOpenDetails}
        task={
          event
            ? {
                id: event.id,
                title: event.title,
                subtitle: event.location_label ?? undefined,
                dateLabel: format(new Date(event.start_date), "dd MMMM yyyy", {
                  locale: fr,
                }),
                timeFrom: event.start_time ?? "",
                timeTo: event.end_time ?? "",
                participants: participants.map((p) => ({
                  id: p.id,
                  img: p.avatar ?? undefined,
                  name: p.name ?? undefined,
                  email: p.email ?? undefined,
                })),
                description: event.description ?? "",
                location: event.location_label ?? "",
                startDate: new Date(event.start_date),
                endDate: new Date(event.end_date),
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

      <h3 className="mt-4.5 mb-2.5 px-4 font-semibold text-[#343E47] dark:text-gray-200 font-sans text-[1rem]">
        Tâches
      </h3>

      <div className="flex-1 overflow-auto px-4 pb-4 hide-scrollbar">
        <div className="space-y-4 text-[1.05rem]">
          {isLoading && (
            <p className="text-[1rem] text-gray-400">Chargement…</p>
          )}

          {isError && (
            <p className="text-[1rem] text-red-500">
              Erreur lors du chargement des tâches
            </p>
          )}

          {!isLoading && !isError && filteredEvents.length === 0 && (
            <p className="text-[1rem] text-gray-400">
              Aucune tâche pour cette date
            </p>
          )}

          {filteredEvents.map((e) => (
            <div
              key={e.id}
              className="pb-3 border-b border-gray-200 dark:border-neutral-700"
            >
              <p className="text-[1rem] font-sans font-medium text-[#343E47]">
                {format(new Date(e.start_date), "dd MMM yyyy", { locale: fr })}
              </p>

              <p
                className="text-[#326EA6] hover:text-[#326EA6]/80 hover:underline cursor-pointer font-medium text-[1rem] font-sans"
                onClick={() => {
                  setActiveEvent(e);
                  setOpenDetails(true);
                }}
              >
                {e.title && e.title.length > 30
                  ? `${e.title.slice(0, 30)}...`
                  : e.title}
              </p>

              {(e.start_time || e.end_time) && (
                <p className="text-[1rem] font-sans font-regular text-[#326EA6]">
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
