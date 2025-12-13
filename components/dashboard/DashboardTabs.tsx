import { Button } from "@/components/ui/button";

const TABS = [
  { key: "recu", label: "Reçus" },
  { key: "mes-projets", label: "Mes projets" },
  { key: "encours", label: "En cours" },
];

export default function DashboardTabs({
  activeTab,
  onChange,
}: {
  activeTab: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex gap-3 py-6 shrink-0">
      {TABS.map(({ key, label }) => (
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
