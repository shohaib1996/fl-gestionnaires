"use client";

import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Sélectionner",
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Parse the date string to Date object
  const selectedDate = value ? new Date(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Format as YYYY-MM-DD for the filter
      const formattedDate = format(date, "yyyy-MM-dd");
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-gray-100 dark:bg-neutral-700 border-0 hover:bg-gray-200 dark:hover:bg-neutral-600",
              !value && "text-gray-400",
              value && "pr-8",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              <span className="flex-1">
                {format(selectedDate!, "dd/MM/yyyy", { locale: fr })}
              </span>
            ) : (
              <span className="flex-1">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            locale={fr}
          />
        </PopoverContent>
      </Popover>
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 hover:opacity-100 z-10"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
