"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AutosuggestProps {
  id?: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  noResultsText?: string;
  className?: string;
  maxSuggestions?: number;
}

export const Autosuggest: React.FC<AutosuggestProps> = ({
  id,
  options,
  value,
  onChange,
  placeholder = "",
  noResultsText = "Aucun résultat trouvé.",
  className = "",
  maxSuggestions = 200,
}) => {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);

  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // click outside
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const normalized = (s: string) => s.toLowerCase();

  const filtered = React.useMemo(() => {
    const q = normalized(inputValue).trim();
    if (!q) return options.slice(0, maxSuggestions);
    return options
      .filter((o) => normalized(o).includes(q))
      .slice(0, maxSuggestions);
  }, [options, inputValue, maxSuggestions]);

  const onSelect = (v: string) => {
    onChange(v);
    setInputValue(v);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((s) => Math.min(s + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((s) => Math.max(s - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      if (open && activeIndex >= 0 && activeIndex < filtered.length) {
        e.preventDefault();
        onSelect(filtered[activeIndex]);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
  };

  const highlightMatch = (label: string) => {
    const q = normalized(inputValue).trim();
    if (!q) return label;
    const idx = normalized(label).indexOf(q);
    if (idx === -1) return label;
    return (
      <>
        {label.slice(0, idx)}
        <span className="font-semibold">
          {label.slice(idx, idx + q.length)}
        </span>
        {label.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <input
        id={id}
        ref={inputRef}
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onChange={(e) => {
          setInputValue(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onKeyDown={onKeyDown}
        className="bg-[#F0F6F4] border-b border-black/60 rounded-none border-t-0 border-x-0 h-12 px-3 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black w-full"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={id ? `${id}-listbox` : undefined}
        role="combobox"
      />

      {/* Dropdown */}
      {open && (
        <div
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          className="absolute left-0 right-0 mt-1 z-9999 max-h-56 overflow-auto rounded-md border bg-white shadow-lg"
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              {noResultsText}
            </div>
          ) : (
            filtered.map((opt, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={opt}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(e) => {
                    // prevent blur before click
                    e.preventDefault();
                    onSelect(opt);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "px-3 py-2 cursor-pointer text-sm",
                    isActive ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  )}
                >
                  {highlightMatch(opt)}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
