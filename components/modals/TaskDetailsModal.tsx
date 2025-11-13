"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

type Participant = { id: string | number; img?: string; name?: string };

export default function TaskDetailsModal({
  open,
  onOpenChange,
  task,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task: {
    title: string;
    subtitle?: string;
    location?: string;
    dateLabel?: string;
    timeFrom?: string;
    timeTo?: string;
    participants?: Participant[];
    description?: string;
  } | null;
}) {
  if (!task) return null;

  const {
    title,
    subtitle,
    dateLabel = "Aujourd'hui",
    timeFrom = "11:00 AM",
    timeTo = "12:00",
    participants = [],
    description,
  } = task;

  const WIDTH = 512;
  const HEIGHT = 539;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0"
        style={{
          width: WIDTH,
          height: HEIGHT,
          padding: 0,
          borderRadius: 8,
          border: "0.5px solid rgba(0,0,0,0.15)",
          boxSizing: "border-box",
          background: "transparent",
          overflow: "visible", // ✅ allow close "X" to display
        }}
      >
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
              {/* Your calendar SVG (kept exactly as in previous version) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="49"
                height="47"
                viewBox="0 0 49 47"
                fill="none"
              >
                <path
                  d="M45.75 34.5C45.75 29.3914 41.6086..."
                  fill="white"
                />
              </svg>
            </div>

            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, opacity: 0.95 }}>{dateLabel}</div>
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
      </DialogContent>
    </Dialog>
  );
}
