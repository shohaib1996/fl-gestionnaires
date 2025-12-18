"use client";

import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types/role";

// -----------------------------
// Types
// -----------------------------
export interface DashboardTab {
  key: string;
  label: string;
}

interface DashboardTabsProps {
  role: UserRole;
  activeTab: string;
  onChange: (key: string) => void;
}

// -----------------------------
// Role → Tabs mapping
// -----------------------------
export const DASHBOARD_TABS_BY_ROLE: Record<UserRole, DashboardTab[]> = {
  admin: [
    { key: "recu", label: "Reçus" },
    { key: "mes-projets", label: "Mes projets" },
    { key: "encours", label: "En cours" },
  ],

  super_admin: [
    { key: "recu", label: "Reçus" },
    { key: "mes-projets", label: "Mes projets" },
    { key: "encours", label: "En cours" },
    { key: "reserve", label: "Réservé" },
  ],

  user: [],
};

// -----------------------------
// Component
// -----------------------------
export default function DashboardTabs({
  role,
  activeTab,
  onChange,
}: DashboardTabsProps) {
  const tabs = DASHBOARD_TABS_BY_ROLE[role];

  // optional guard
  if (tabs.length === 0) return null;

  return (
    <div className="flex gap-3 py-6 shrink-0">
      {tabs.map(({ key, label }) => (
        <Button
          key={key}
          onClick={() => onChange(key)}
          className={`text-white font-medium h-7 rounded-none w-24 transition-all ${
            activeTab === key
              ? "bg-[#63a053] scale-105 shadow-sm"
              : "bg-[#326EA6] hover:bg-[#63a053]"
          }`}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
