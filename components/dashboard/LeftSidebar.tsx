"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export default function LeftSidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <aside className="w-[260px] bg-white dark:bg-neutral-800 shadow-sm shrink-0 flex flex-col overflow-hidden mt-17 rounded-2xl">
      <div className="shrink-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-full rounded-md"
        />
      </div>

      {/* Scrollable tasks area */}
      <div className="mt-4 flex-1 overflow-auto pr-1  p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Tâches
        </h3>
        <div className="space-y-3 text-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <p className="text-xs text-gray-400">11 Mars 2025</p>
              <p className="text-blue-600 dark:text-blue-400 hover:underline">
                Appel projet #{i + 1}
              </p>
              <p className="text-xs text-gray-500">8:30 - 9:00</p>
            </div>
          ))}
        </div>
      </div>

      <Button className="mt-3 w-full bg-[#63a053] hover:bg-[#528a45] text-sm py-2">
        + Ajouter
      </Button>
    </aside>
  );
}
