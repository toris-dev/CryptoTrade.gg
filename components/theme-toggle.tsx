"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white/50 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950/50 dark:hover:bg-gray-800/50 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 text-yellow-500 transition-transform duration-200 dark:rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 text-blue-500 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
