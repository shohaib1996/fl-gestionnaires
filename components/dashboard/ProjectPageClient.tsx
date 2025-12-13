"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectFilters } from "@/lib/api/projects";
import { Project } from "@/types/db";
import { useSearchParams } from "next/navigation";
import CategoryTabs from "./CategoryTabs";
import FiltersPanel from "./FiltersPanel";

export default function ProjectsPageClient({
  initialData,
}: {
  initialData: Project;
}) {
  const params = useSearchParams();
  const filters: Partial<ProjectFilters> = {
    status: params.get("status"),
    search: params.get("search"),
    page: params.get("page") ? Number(params.get("page")) : 1,
    pageSize: params.get("pageSize") ? Number(params.get("pageSize")) : 20,
  };

  const { data, isLoading } = useProjects(filters, initialData);

  return (
    <div>
      <CategoryTabs role="admin" />
      <FiltersPanel />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="projects-grid">
          {data?.map((p: any) => (
            <div key={p.id} className="project-card">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div>{p.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
