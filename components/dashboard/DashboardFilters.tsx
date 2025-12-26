import { Input } from "@/components/ui/input";
import { SearchableDropdown } from "@/components/ui/searchable-dropdown";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { DatePicker } from "@/components/ui/date-picker";
import { PROVINCE_OPTIONS } from "@/lib/location-data";
import { CATEGORY_OPTIONS } from "@/lib/categories-data";
import type { DashboardFilters } from "@/types/dashboard";

interface Props {
  values: DashboardFilters;
  onChange: (values: DashboardFilters) => void;
}

export default function DashboardFilters({ values, onChange }: Props) {
  const update = (key: keyof DashboardFilters, value: string | string[]) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-neutral-800 px-12 py-5 shadow-sm mb-3">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
        Filtrer par :
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <Filter label="Location">
          <SearchableDropdown
            options={PROVINCE_OPTIONS}
            value={values.location}
            onChange={(value) => update("location", value)}
            placeholder="Taper ou sélectionner"
            searchPlaceholder="Rechercher une province..."
            columns={1}
          />
        </Filter>

        <Filter label="Catégorie">
          <MultiSelectDropdown
            options={CATEGORY_OPTIONS}
            value={values.categories || []}
            onChange={(value) => update("categories", value)}
            placeholder="Sélectionner"
            searchPlaceholder="Rechercher une catégorie..."
          />
        </Filter>

        <Filter label="Date">
          <DatePicker
            value={values.date}
            onChange={(value) => update("date", value)}
            placeholder="Sélectionner"
          />
        </Filter>

        <Filter label="Name">
          <Input
            onChange={(e) => update("name", e.target.value)}
            placeholder="Taper"
            className="bg-gray-100 dark:bg-neutral-700 border-0 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#63a053]"
          />
        </Filter>

        <Filter label="Identifiant FL (IFL)">
          <Input
            onChange={(e) => update("ifl", e.target.value)}
            placeholder="Taper"
            className="bg-gray-100 dark:bg-neutral-700 border-0 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#63a053]"
          />
        </Filter>
      </div>
    </div>
  );
}

function Filter({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );
}
