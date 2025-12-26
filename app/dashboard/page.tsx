"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import DashboardView from "@/components/dashboard/DashboardView";
import { useDebounce } from "@/hooks/useDebounce";
import { useProjects } from "@/hooks/useProjects";

import { useUser } from "@/providers/UserProvider";
import type { DashboardFilters, DashboardTab } from "@/types/dashboard";
import { TAB_TO_STATUS } from "@/types/dashboard";

const DEFAULT_TAB: DashboardTab = "recu";
const PAGE_SIZE = 8;

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* --------------------------------
   * 1️⃣ STATE = SOURCE OF TRUTH
   * -------------------------------- */
  const [activeTab, setActiveTab] = useState<DashboardTab>(DEFAULT_TAB);
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<DashboardFilters>({});

  /* --------------------------------
   * 2️⃣ DEBOUNCED FILTERS
   * -------------------------------- */
  const debouncedFilters = useDebounce(
    {
      page,
      pageSize: PAGE_SIZE,
      ...filters,
    },
    400
  );

  /* --------------------------------
   * 3️⃣ SYNC STATE FROM URL PARAMS (ON MOUNT)
   * -------------------------------- */
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as DashboardTab | null;
    const pageFromUrl = searchParams.get("page");

    if (tabFromUrl && tabFromUrl in TAB_TO_STATUS) {
      setActiveTab(tabFromUrl);
    }

    if (pageFromUrl && !Number.isNaN(Number(pageFromUrl))) {
      setPage(Number(pageFromUrl));
    }
  }, [searchParams]);

  /* --------------------------------
   * 4️⃣ DATA FETCH (STATE DRIVEN)
   * -------------------------------- */
  const { user, loading: userLoading } = useUser();

  const { data: projects, isLoading } = useProjects({
    tab: activeTab,
    role: user?.role ?? "admin",
    userId: user?.id,
    enabled: !!user && !userLoading,
    filters: debouncedFilters,
  });

  /* --------------------------------
   * 5️⃣ HANDLERS (UPDATE STATE + URL)
   * -------------------------------- */
  const handleTabChange = (tab: DashboardTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setPage(1);
    // Update URL immediately
    router.push(`?tab=${tab}&page=1`, { scroll: false });
  };

  const handlePageChange = (nextPage: number) => {
    console.log("📤 Next Page:", nextPage);
    if (nextPage < 1) return;
    setPage(nextPage);
    // Update URL immediately
    router.push(`?tab=${activeTab}&page=${nextPage}`, { scroll: false });
  };

  const handleFiltersChange = (next: DashboardFilters) => {
    setFilters(next);
    setPage(1); // filter change = reset pagination
  };

  /* --------------------------------
   * 7️⃣ RENDER
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
