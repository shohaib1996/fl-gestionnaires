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
const PAGE_SIZE = 20;

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
  const debouncedFilters = useDebounce(filters, 400);

  /* --------------------------------
   * 3️⃣ INITIAL STATE FROM URL (ONCE)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --------------------------------
   * 4️⃣ DATA FETCH (STATE DRIVEN)
   * -------------------------------- */
  // const { data: projects = [], isLoading } = useProjects({
  //   status: TAB_TO_STATUS[activeTab],
  //   page,
  //   pageSize: PAGE_SIZE,
  //   ...debouncedFilters,
  // });
  const { user, loading: userLoading } = useUser();

  const { data: projects, isLoading } = useProjects({
    tab: activeTab,
    role: user?.role ?? "admin",
    userId: user?.id,
    enabled: !!user && !userLoading,
  });

  console.log("projects", projects);

  /* --------------------------------
   * 5️⃣ URL SYNC (SIDE EFFECT)
   * -------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams();

    params.set("tab", activeTab);
    params.set("page", String(page));

    // optional: sync filters to URL (if you want later)
    // Object.entries(filters).forEach(([key, value]) => {
    //   if (value) params.set(key, value);
    // });

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [activeTab, page, router]);

  /* --------------------------------
   * 6️⃣ HANDLERS (INSTANT)
   * -------------------------------- */
  const handleTabChange = (tab: DashboardTab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1) return;
    setPage(nextPage);
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
