"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className=" h-[31px] cursor-pointer"
    >
      <Sun className="h-full transition-all dark:hidden" />
      <Moon className="hidden h-full transition-all dark:block" />
    </button>
  );
}
