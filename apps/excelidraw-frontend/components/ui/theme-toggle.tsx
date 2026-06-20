"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  variant = "pill",
}: {
  className?: string;
  variant?: "pill" | "icon";
}) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  if (!mounted) {
    if (variant === "icon") {
      return (
        <button
          aria-label="Toggle theme"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10",
            className
          )}
        >
          <Sun className="h-4 w-4" />
        </button>
      );
    }
    return (
      <div
        className={cn(
          "h-8 w-[68px] rounded-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 animate-pulse",
          className
        )}
      />
    );
  }

  if (variant === "icon") {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle theme"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10",
          className
        )}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "relative flex h-8 w-[68px] shrink-0 items-center justify-between rounded-full bg-slate-100 dark:bg-black/40 p-1 border border-slate-200 dark:border-white/10 transition-colors",
        className
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 h-6 w-6 rounded-full shadow-md transition-all duration-200 ease-in-out flex items-center justify-center",
          isDark
            ? "translate-x-[34px] bg-indigo-600 text-white"
            : "translate-x-0.5 bg-amber-400 text-white"
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5" />
        ) : (
          <Sun className="h-3.5 w-3.5" />
        )}
      </div>
      <span className="flex h-6 w-6 items-center justify-center text-slate-400 z-10 pointer-events-none">
        <Sun
          className={cn(
            "h-3.5 w-3.5 transition-colors",
            !isDark && "text-transparent"
          )}
        />
      </span>
      <span className="flex h-6 w-6 items-center justify-center text-slate-400 z-10 pointer-events-none">
        <Moon
          className={cn(
            "h-3.5 w-3.5 transition-colors",
            isDark && "text-transparent"
          )}
        />
      </span>
    </button>
  );
}
