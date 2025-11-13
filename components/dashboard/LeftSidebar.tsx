"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export default function LeftSidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-neutral-800 shadow-sm border-0.5 border-black/10 rounded-xs overflow-hidden">
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

      {/* Scrollable tasks */}
      <div className="flex-1 overflow-auto px-4 pb-4 hide-scrollbar">
        <div className="space-y-4 text-md">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="pb-3 border-b border-gray-200 dark:border-neutral-700"
            >
              <p className="text-sm text-gray-400">11 Mars 2025</p>
              <p className="text-blue-600 dark:text-blue-400 hover:underline">
                Appel projet #{i + 1}
              </p>
              <p className="text-sm text-gray-500">8:30 - 9:00</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 shrink-0">
        <Button className="w-full bg-[#63a053] hover:bg-[#528a45] rounded-xs text-sm py-2">
          + Ajouter
        </Button>
      </div>
    </aside>
  );
}
