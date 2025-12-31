"use client";

import DashboardView from "@/components/dashboard/DashboardView";
import { useDebounce } from "@/hooks/useDebounce";
import { useProjects } from "@/hooks/useProjects";
import { useUser } from "@/providers/UserProvider";
import type { DashboardFilters, DashboardTab } from "@/types/dashboard";
import { TAB_TO_STATUS } from "@/types/dashboard";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const DEFAULT_TAB: DashboardTab = "recu";
const PAGE_SIZE = 8;

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();

  /* --------------------------------
   * 1️⃣ DERIVE STATE FROM URL
   * -------------------------------- */
  const activeTab =
    (searchParams.get("tab") as DashboardTab) in TAB_TO_STATUS
      ? (searchParams.get("tab") as DashboardTab)
      : DEFAULT_TAB;

  const page = Number(searchParams.get("page")) || 1;

  /* --------------------------------
   * 2️⃣ LOCAL STATE (NON-URL)
   * -------------------------------- */
  const [filters, setFilters] = useState<DashboardFilters>({});

  const debouncedFilters = useDebounce(
    {
      page,
      pageSize: PAGE_SIZE,
      ...filters,
    },
    400
  );

  /* --------------------------------
   * 3️⃣ DATA FETCH
   * -------------------------------- */
  const { data: projects, isLoading } = useProjects({
    tab: activeTab,
    role: user?.role ?? "admin",
    userId: user?.id,
    enabled: !!user && !userLoading,
    filters: debouncedFilters,
  });

  /* --------------------------------
   * 4️⃣ NAVIGATION HANDLERS
   * -------------------------------- */
  const handleTabChange = (tab: DashboardTab) => {
    if (tab === activeTab) return;
    router.push(`?tab=${tab}&page=1`, { scroll: false });
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1) return;
    router.push(`?tab=${activeTab}&page=${nextPage}`, { scroll: false });
  };

  const handleFiltersChange = (next: DashboardFilters) => {
    setFilters(next);
    router.push(`?tab=${activeTab}&page=1`, { scroll: false });
  };

  /* --------------------------------
   * 5️⃣ RENDER
   * -------------------------------- */
  return (
    <DashboardView
      activeTab={activeTab}
      projects={projects ?? []}
      loading={isLoading}
      page={page}
      filters={filters}
      onTabChange={handleTabChange}
      onPageChange={handlePageChange}
      onFiltersChange={handleFiltersChange}
    />
  );
}
