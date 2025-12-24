"use client";

import { useProjectOverview } from "@/hooks/useGetProjectOverview";

export default function DashboardSidebar() {
  const { data, isLoading } = useProjectOverview();

  if (isLoading || !data) {
    return (
      <aside className="flex flex-col h-full bg-white dark:bg-neutral-800 shadow-sm border border-black/10 rounded-xs p-4 overflow-auto min-h-72">
        Chargement…
      </aside>
    );
  }

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-neutral-800 shadow-sm border border-black/10 rounded-xs p-4 overflow-auto min-h-72">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Aperçu des projets
      </h3>

      <ul className="space-y-5 text-md">
        <Item
          label="Projets reçus"
          total={data.received}
          week={data.receivedThisWeek}
        />
        <Item
          label="Projets retenus"
          total={data.retained}
          week={data.retainedThisWeek}
        />
        <Item
          label="Projets en cours"
          total={data.inProgress}
          week={data.inProgressThisWeek}
        />
        <Item
          label="Projets lancés"
          total={data.launched}
          week={data.launchedThisWeek}
        />
      </ul>
    </aside>
  );
}

function Item({
  label,
  total,
  week,
}: {
  label: string;
  total: number;
  week: number;
}) {
  return (
    <li className="flex flex-col">
      <span>
        <span className="font-semibold">{total}</span> {label}
      </span>
      <span className="text-blue-600 hover:underline text-md">
        {week} cette semaine
      </span>
    </li>
  );
}
