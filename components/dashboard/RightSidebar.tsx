"use client";

export default function RightSidebar() {
  return (
    <aside className="flex flex-col h-full bg-white dark:bg-neutral-800 shadow-sm border border-black/10 rounded-sm p-4 overflow-auto hide-scrollbar">
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
