"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { generateTimeOptions } from "@/lib/utils/time";
import { useMemo } from "react";

interface TimePicker24Props {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  interval?: number;
  disabled?: boolean;
  className?: string;
}

export function TimePicker24({
  value,
  onChange,
  placeholder = "HH:MM",
  interval = 5,
  disabled = false,
  className,
}: TimePicker24Props) {
  const times = useMemo(() => generateTimeOptions(interval), [interval]);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "bg-gray-100 mt-1 w-full pl-10 relative [&>svg]:hidden",
          className
        )}
      >
        {/* ICON */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.40039 3.3999V6.3999H8.90039M12.4004 6.3999C12.4004 9.71361 9.7141 12.3999 6.40039 12.3999C3.08668 12.3999 0.400391 9.71361 0.400391 6.3999C0.400391 3.08619 3.08668 0.399902 6.40039 0.399902C9.7141 0.399902 12.4004 3.08619 12.4004 6.3999Z"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="max-h-64">
        {times.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
