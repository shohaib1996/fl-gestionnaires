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
          label="Projets pris"
          total={data.retained}
          period={data.retainedThisWeek}
          periodLabel="ce mois"
        />
        <Item
          label="Projets en cours"
          total={data.inProgress}
          period={data.inProgressThisWeek}
          periodLabel="ce mois"
        />
        <Item
          label="Projets lancés"
          total={data.launched}
          period={data.launchedThisWeek}
          periodLabel="cette année"
        />
      </ul>
    </aside>
  );
}

function Item({
  label,
  total,
  period,
  periodLabel,
}: {
  label: string;
  total: number;
  period: number;
  periodLabel: string;
}) {
  return (
    <li className="flex flex-col">
      <span>
        <span className="font-semibold">{total}</span> {label}
      </span>
      <span className="text-blue-600 hover:underline text-md">
        {periodLabel}
      </span>
    </li>
  );
}
