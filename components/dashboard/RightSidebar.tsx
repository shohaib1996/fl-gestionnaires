"use client";

import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const isProjectPage = pathname.includes("/project/");

  if (isProjectPage) {
    // -------------------------
    // PROJECT SIDEBAR VERSION
    // -------------------------
    return (
      <aside className="flex flex-col h-full bg-white dark:bg-neutral-800 shadow-sm border rounded-xs p-4 overflow-auto hide-scrollbar">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Cola Naturelle
        </h3>

        <ul className="w-full divide-y">
          {[
            { name: "Jalons" },
            { name: "Notes", count: 5 },
            { name: "Tâches", count: 4 },
            { name: "Documents", count: 7 },
            { name: "Contacts", count: 10 },
          ].map((item, idx) => (
            <li
              key={idx}
              className="py-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-[#326EA6] transition px-2 rounded"
            >
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {item.name}
                {item.count ? ` (${item.count})` : ""}
              </span>
            </li>
          ))}
        </ul>
      </aside>
    );
  }

  // -------------------------
  // DEFAULT GLOBAL SIDEBAR (FROM YOUR CODE)
  // -------------------------
  return (
    <aside className="flex flex-col h-full bg-white dark:bg-neutral-800 shadow-sm border border-black/10 rounded-xs p-4 overflow-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Aperçu des projets
      </h3>

      <ul className="space-y-5 text-md">
        {[
          { label: "Projets reçus", value: 105 },
          { label: "Projets retenus", value: 11 },
          { label: "Projets en cours", value: 6 },
          { label: "Projets lancés", value: 5 },
        ].map(({ label, value }, i) => (
          <li key={i} className="flex flex-col">
            <span>
              <span className="font-semibold">{value}</span> {label}
            </span>
            <a href="#" className="text-blue-600 hover:underline text-md">
              Cette semaine
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
