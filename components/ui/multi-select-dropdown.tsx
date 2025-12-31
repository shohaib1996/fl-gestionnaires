"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

export function MultiSelectDropdown({
  options,
  value = [],
  onChange,
  placeholder = "Sélectionner",
  searchPlaceholder = "Rechercher...",
  className,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get display text
  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const selected = options.find((opt) => opt.value === value[0]);
      return selected?.label || placeholder;
    }
    return `${value.length} sélectionnés`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleClearAll = () => {
    onChange([]);
    setSearchQuery("");
  };

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-neutral-700 rounded-md text-[1rem] border-0 focus:outline-none focus:ring-1 focus:ring-[#63a053]",
          value.length === 0 && "text-gray-400"
        )}
      >
        <span className="truncate">{getDisplayText()}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 ml-2 transition-transform shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md shadow-lg max-h-[400px] flex flex-col">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200 dark:border-neutral-700">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded text-[1rem] focus:outline-none focus:ring-1 focus:ring-[#63a053]"
              />
            </div>
          </div>

          {/* Clear All Button */}
          {value.length > 0 && (
            <div className="p-2 border-b border-gray-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={handleClearAll}
                className="w-full px-3 py-1.5 text-[1rem] text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                Effacer tout ({value.length})
              </button>
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto p-2">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-8 text-center text-[1rem] text-gray-500">
                Aucun résultat trouvé
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleToggle(option.value)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-[1rem] rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors text-left",
                        isSelected &&
                          "bg-[#63a053]/10 text-[#63a053] font-medium"
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 ml-2 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
