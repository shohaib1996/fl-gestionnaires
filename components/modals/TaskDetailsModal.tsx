"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCalendarEventDetails } from "@/hooks/useCalendarEventDetails";
import { useEventParticipants } from "@/hooks/useEventParticipants";
import { useUpdateCalendarEvent } from "@/hooks/useUpdateCalendarEvent";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CalendarEventForm, { Participant } from "../form/CalendarEventForm";

type Payload = {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  location_type?: "online" | "onsite" | "hybrid";
  location_label?: string;
  participantIds: string[];
};

export default function TaskDetailsModal({
  open,
  onOpenChange,
  task,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task: {
    id: string;
    title: string;
    subtitle?: string;
    location?: string;
    dateLabel?: string;
    timeFrom?: string;
    timeTo?: string;
    participants?: Participant[];
    description?: string;
    startDate?: Date;
    endDate?: Date;
  } | null;
}) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const { mutateAsync } = useUpdateCalendarEvent();
  const { data: eventDetails } = useCalendarEventDetails(task?.id);
  const { data: eventParticipants } = useEventParticipants(task?.id || "");

  // Reset to view mode when modal is closed
  useEffect(() => {
    if (!open) {
      setMode("view");
    }
  }, [open]);

  if (!task) return null;

  // Convert eventParticipants to Participant format
  const freshParticipants: Participant[] | undefined = eventParticipants?.map(
    (p) => ({
      id: p.id,
      name: p.name || undefined,
      email: p.email,
      img: p.avatar || undefined,
    })
  );

  // Use fresh data from the query if available, otherwise fall back to prop data
  const displayData = eventDetails
    ? {
        title: eventDetails.title,
        subtitle: task.subtitle,
        description: eventDetails.description,
        location: eventDetails.location_label,
        dateLabel: task.dateLabel,
        timeFrom: eventDetails.start_time || task.timeFrom,
        timeTo: eventDetails.end_time || task.timeTo,
        startDate: eventDetails.start_date
          ? new Date(eventDetails.start_date)
          : task.startDate,
        endDate: eventDetails.end_date
          ? new Date(eventDetails.end_date)
          : task.endDate,
        participants: freshParticipants || task.participants,
      }
    : task;

  const {
    title,
    subtitle,
    dateLabel = "Aujourd'hui",
    timeFrom = "11:00 AM",
    timeTo = "12:00",
    participants = [],
    description,
    location,
    startDate,
    endDate,
  } = displayData;

  // Calculate display date (single day or range)
  const isMultipleDays =
    startDate && endDate && !isSameDay(new Date(startDate), new Date(endDate));

  const displayDate = isMultipleDays
    ? `${format(new Date(startDate), "dd MMMM yyyy", {
        locale: fr,
      })} – ${format(new Date(endDate), "dd MMMM yyyy", { locale: fr })}`
    : dateLabel;

  console.log(task);

  const WIDTH = 512;
  const HEIGHT = 539;

  const handleUpdate = async (payload: Payload) => {
    await mutateAsync({
      eventId: task.id,
      ...payload,
    });

    setMode("view");
    toast.success("Tâche mise à jour");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Détails de la tâche</DialogTitle>
      <DialogContent
        className="p-0"
        showCloseButton={false}
        style={{
          minWidth: WIDTH,
          minHeight: HEIGHT,
          padding: 0,
          borderRadius: 8,
          border: "0.5px solid rgba(0,0,0,0.15)",
          boxSizing: "border-box",
          background: "white",
          overflow: "visible",
        }}
      >
        {mode === "view" && (
          <>
            {/* ---------------- TOP GREEN AREA ---------------- */}
            <div
              style={{
                background: "#63A053",
                height: 250,
                marginBottom: -50, // pulls green downward over the curve
                color: "white",
                padding: "28px 24px 12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Title + subtitle */}
              <div style={{ textAlign: "center" }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                  {title}
                </h3>
                {subtitle && (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      opacity: 0.95,
                    }}
                  >
                    {subtitle}
                  </div>
                )}
              </div>

              {/* Calendar + time info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginTop: 10,
                }}
              >
                <div
                  style={{
                    width: 49,
                    height: 47,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="49"
                    height="47"
                    viewBox="0 0 49 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M45.75 34.5C45.75 29.3914 41.6086 25.25 36.5 25.25C31.3914 25.25 27.25 29.3914 27.25 34.5C27.25 39.6086 31.3914 43.75 36.5 43.75C41.6086 43.75 45.75 39.6086 45.75 34.5ZM35.25 29.25C35.25 28.5596 35.8096 28 36.5 28C37.1904 28 37.75 28.5596 37.75 29.25V33.25H40.875C41.5654 33.25 42.125 33.8096 42.125 34.5C42.125 35.1904 41.5654 35.75 40.875 35.75H35.25V29.25ZM48.25 34.5C48.25 40.9893 42.9893 46.25 36.5 46.25C30.0107 46.25 24.75 40.9893 24.75 34.5C24.75 28.0107 30.0107 22.75 36.5 22.75C42.9893 22.75 48.25 28.0107 48.25 34.5Z"
                      fill="white"
                    />
                    <path
                      d="M27.3477 0C27.7742 0 28.1837 0.188532 28.4854 0.524414C28.787 0.860417 28.9561 1.31681 28.9561 1.79199V4.92676C28.9561 5.04555 28.9988 5.16014 29.0742 5.24414C29.1496 5.32798 29.2519 5.37491 29.3584 5.375H33.7822C34.6355 5.375 35.4542 5.7528 36.0576 6.4248C36.6609 7.09672 36.9999 8.00783 37 8.95801V22C35.8894 22 34.8113 22.1393 33.7822 22.4014V17.0205C33.7822 16.7831 33.6976 16.5556 33.5469 16.3877C33.3961 16.2198 33.1917 16.1251 32.9785 16.125H4.02148C3.80825 16.1251 3.60391 16.2198 3.45312 16.3877C3.30241 16.5556 3.21785 16.7831 3.21777 17.0205V38.5205C3.21777 38.7581 3.30228 38.9863 3.45312 39.1543C3.6039 39.3222 3.80828 39.4169 4.02148 39.417H24.7705C25.2418 40.7217 25.918 41.9274 26.7568 43H3.21777C2.36447 43 1.54576 42.6222 0.942383 41.9502C0.339149 41.2783 7.7364e-05 40.3672 0 39.417V8.95801C7.73959e-05 8.00783 0.33915 7.09672 0.942383 6.4248C1.54576 5.7528 2.36447 5.375 3.21777 5.375H5.63086C5.84403 5.37513 6.04847 6.19922 5.6377C6.34989 5.8056 6.43449 6.03312 6.43457 6.27051V10.3018C6.43457 10.658 6.56194 11 6.78809 11.252C7.01435 11.504 7.32161 11.6455 7.6416 11.6455C7.96148 11.6454 8.26794 11.5039 8.49414 11.252C8.7204 11 8.84766 10.6581 8.84766 10.3018V1.79199C8.84766 1.31681 9.01765 0.860417 9.31934 0.524414C9.62088 0.18876 10.0297 0.000137606 10.4561 0C10.8826 0 11.2921 0.188624 11.5938 0.524414C11.8954 0.860417 12.0654 1.31681 12.0654 1.79199V4.92676C12.0654 5.04555 12.1072 5.16014 12.1826 5.24414C12.258 5.32814 12.3611 5.375 12.4678 5.375H22.5215C22.7348 5.375 22.94 5.46969 23.0908 5.6377C23.2414 5.80559 23.3261 6.03319 23.3262 6.27051V10.3018C23.3262 10.6581 23.4535 11 23.6797 11.252C23.9059 11.5039 24.2124 11.6454 24.5322 11.6455C24.8522 11.6455 25.1595 11.504 25.3857 11.252C25.6119 11 25.7393 10.6581 25.7393 10.3018V1.79199C25.7393 1.31681 25.9083 0.860417 26.21 0.524414C26.5116 0.188471 26.9211 4.99559e-05 27.3477 0ZM11.2607 32.8076C11.6874 32.8076 12.0967 33.0088 12.3984 33.3672C12.7001 33.7256 12.8691 34.2119 12.8691 34.7188C12.8691 35.2255 12.7001 35.712 12.3984 36.0703C12.0968 36.4286 11.6873 36.6299 11.2607 36.6299H9.65234C9.22579 36.6299 8.81632 36.4286 8.51465 36.0703C8.21301 35.712 8.044 35.2255 8.04395 34.7188C8.04395 34.2119 8.21297 33.7256 8.51465 33.3672C8.81634 33.0088 9.22569 32.8076 9.65234 32.8076H11.2607ZM19.3047 32.8076C19.7311 32.8077 20.1398 33.009 20.4414 33.3672C20.7431 33.7256 20.9131 34.2119 20.9131 34.7188C20.913 35.2255 20.743 35.712 20.4414 36.0703C20.1398 36.4283 19.731 36.6298 19.3047 36.6299H17.6953C17.269 36.6298 16.8602 36.4283 16.5586 36.0703C16.257 35.712 16.087 35.2255 16.0869 34.7188C16.0869 34.2119 16.2569 33.7256 16.5586 33.3672C16.8602 33.009 17.2689 32.8077 17.6953 32.8076H19.3047ZM11.2607 25.1631C11.6874 25.1631 12.0967 25.3643 12.3984 25.7227C12.7001 26.0811 12.8691 26.5674 12.8691 27.0742C12.8691 27.581 12.7001 28.0674 12.3984 28.4258C12.0968 28.7841 11.6873 28.9854 11.2607 28.9854H9.65234C9.22577 28.9854 8.81632 28.7841 8.51465 28.4258C8.21299 28.0674 8.04398 27.581 8.04395 27.0742C8.04395 26.5674 8.21296 26.0811 8.51465 25.7227C8.81633 25.3643 9.2257 25.1631 9.65234 25.1631H11.2607ZM19.3047 25.1631C19.7311 25.1632 20.1398 25.3645 20.4414 25.7227C20.7431 26.0811 20.9131 26.5674 20.9131 27.0742C20.9131 27.581 20.7431 28.0674 20.4414 28.4258C20.1398 28.7838 19.731 28.9852 19.3047 28.9854H17.6953C17.269 28.9852 16.8602 28.7838 16.5586 28.4258C16.2569 28.0674 16.0869 27.581 16.0869 27.0742C16.0869 26.5674 16.2569 26.0811 16.5586 25.7227C16.8602 25.3645 17.2689 25.1632 17.6953 25.1631H19.3047ZM27.3477 25.1631C27.6464 25.1631 27.9358 25.2631 28.1865 25.4453C27.0983 26.4496 26.1815 27.6367 25.4863 28.959C25.1536 28.896 24.8429 28.7124 24.6016 28.4258C24.2999 28.0674 24.1309 27.581 24.1309 27.0742C24.1309 26.5674 24.2999 26.0811 24.6016 25.7227C24.9032 25.3643 25.3126 25.1631 25.7393 25.1631H27.3477ZM11.2607 17.5186C11.6874 17.5186 12.0968 17.7198 12.3984 18.0781C12.7001 18.4365 12.8691 18.9228 12.8691 19.4297C12.8691 19.9365 12.7001 20.4229 12.3984 20.7812C12.0968 21.1396 11.6873 21.3408 11.2607 21.3408H9.65234C9.22575 21.3408 8.81633 21.1396 8.51465 20.7812C8.21297 20.4229 8.04396 19.9365 8.04395 19.4297C8.04395 18.9228 8.21296 18.4365 8.51465 18.0781C8.81633 17.7198 9.22572 17.5186 9.65234 17.5186H11.2607ZM19.3047 17.5186C19.7311 17.5187 20.1398 17.72 20.4414 18.0781C20.7431 18.4365 20.9131 18.9228 20.9131 19.4297C20.9131 19.9365 20.7431 20.4229 20.4414 20.7812C20.1398 21.1393 19.7311 21.3407 19.3047 21.3408H17.6953C17.2689 21.3407 16.8602 21.1393 16.5586 20.7812C16.2569 20.4229 16.0869 19.9365 16.0869 19.4297C16.0869 18.9228 16.2569 18.4365 16.5586 18.0781C16.8602 17.72 17.2689 17.5187 17.6953 17.5186H19.3047ZM27.3477 17.5186C27.7743 17.5186 28.1837 17.7198 28.4854 18.0781C28.787 18.4365 28.9561 18.9228 28.9561 19.4297C28.956 19.9365 28.787 20.4229 28.4854 20.7812C28.1837 21.1396 27.7743 21.3408 27.3477 21.3408H25.7393C25.3127 21.3408 24.9032 21.1396 24.6016 20.7812C24.2999 20.4229 24.1309 19.9365 24.1309 19.4297C24.1309 18.9228 24.2999 18.4365 24.6016 18.0781C24.9032 17.7198 25.3126 17.5186 25.7393 17.5186H27.3477Z"
                      fill="white"
                    />
                  </svg>
                </div>

                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, opacity: 0.95 }}>
                    {displayDate}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    {timeFrom} — {timeTo}
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- BOTTOM WHITE AREA ---------------- */}
            <div
              style={{
                background: "white",
                height: 308,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                padding: "18px 20px",
                boxSizing: "border-box",
                position: "relative",
                zIndex: 2,

                // ⭐ Centers absolutely everything:
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 16,
              }}
            >
              {/* Participants label */}
              <div
                style={{
                  fontSize: 13,
                  color: "#9B9B9B",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>Participants</span>
                <span
                  style={{
                    background: "#FFF2CC",
                    borderRadius: 999,
                    padding: "2px 8px",
                    fontSize: 12,
                    color: "#6B4D00",
                  }}
                >
                  {participants.length}
                </span>
              </div>

              {/* Avatars row */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {participants.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      background: p.img
                        ? `url(${p.img}) center / cover no-repeat`
                        : "#D9D9D9",
                      border: "3px solid white",
                    }}
                  />
                ))}

                {/* Add button */}
                <div
                  onClick={() => setMode("edit")}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    background: "#EEF6EE",
                    color: "#63A053",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    border: "3px solid white",
                    cursor: "pointer",
                  }}
                >
                  +
                </div>
              </div>

              {/* Description */}
              <div
                style={{
                  color: "#333",
                  fontSize: 13,
                  lineHeight: 1.5,
                  maxWidth: 460,
                }}
              >
                {description ||
                  "No description provided. This is placeholder text for multi-line wrapping."}
              </div>

              {/* Floating edit button */}
              <button
                onClick={() => setMode("edit")}
                style={{
                  position: "absolute",
                  right: 18,
                  bottom: 18,
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: "#63A053",
                  color: "white",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                  cursor: "pointer",
                }}
              >
                ✎
              </button>
            </div>
          </>
        )}
        {mode === "edit" && (
          <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden">
            <div className="w-full h-20 flex items-center justify-center bg-[#63a053] relative shrink-0">
              <h2 className="text-white text-lg font-bold">
                Modifier la tâche
              </h2>
              <button
                onClick={() => setMode("view")}
                className="absolute right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CalendarEventForm
                mode="edit"
                initialValues={{
                  title: title,
                  description: description || undefined,
                  start_date: startDate || new Date(),
                  end_date: endDate || new Date(),
                  start_time: timeFrom || undefined,
                  end_time: timeTo || undefined,
                  location_label: location || undefined,
                  participants: participants,
                }}
                onSubmit={handleUpdate}
                onCancel={() => setMode("view")}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
