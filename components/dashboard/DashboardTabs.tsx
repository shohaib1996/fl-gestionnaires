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
  activeTab: string | null;
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
    { key: "recu", label: "Disponibles" },
    { key: "mes-projets", label: "Pris" },
    { key: "encours", label: "En cours" },
    { key: "reserve", label: "Réserve" },
  ],

  onterpeoner: [],
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

  return (
    <div className="flex gap-0.5 py-6 shrink-0">
      {tabs.map(({ key, label }) => (
        <Button
          key={key}
          onClick={() => onChange(key)}
          className={`text-white font-medium h-7 rounded w-24 transition-all ${
            activeTab === key
              ? "bg-[#63a053] hover:bg-[#528a45]"
              : "bg-[#326EA6] hover:bg-[#528a45]"
          }`}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
