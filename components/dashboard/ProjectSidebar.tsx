"use client";

import { useProjectSidebarOverview } from "@/hooks/useProjectSidebarOverview";

export default function ProjectSidebar({ projectId }: { projectId: string }) {
  const { data, isLoading } = useProjectSidebarOverview(projectId);

  if (isLoading || !data) {
    return (
      <aside className="bg-white dark:bg-neutral-800 p-4 rounded-xs min-h-72">
        Chargement…
      </aside>
    );
  }

  return (
    <aside className="max-h-72 flex flex-col h-full bg-white dark:bg-neutral-800 shadow-sm border rounded-xs py-4 overflow-auto hide-scrollbar">
      <h3 className="text-lg px-4 font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {data.projectName}
      </h3>

      <ul className="w-full divide-y">
        <Item name="Jalons" count={data.milestones} />
        <Item name="Notes" count={data.notes} />
        <Item name="Documents" count={data.tasks} />
        {/* <Item name="Documents" count={data.documents} /> */}
        <Item name="Contacts" count={data.contacts} />
      </ul>
    </aside>
  );
}

function Item({ name, count }: { name: string; count: number }) {
  return (
    <li className="py-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-[#326EA6] transition px-2 rounded">
      <span className="font-medium text-gray-800 dark:text-gray-100 px-4">
        {name} ({count})
      </span>
    </li>
  );
}
