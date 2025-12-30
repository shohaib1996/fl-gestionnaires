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
      <h3 className="text-[11px] font-sans font-bold mb-4 text-[#343E47] dark:text-gray-100">
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
      <span className="font-medium text-[11px] font-sans">
        {total} {label}
      </span>
      <span className="text-[#326EA6] hover:underline text-[11px] font-regular">
        {periodLabel}
      </span>
    </li>
  );
}
