"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  active?: boolean;
  onClick?: () => void;
}

export function ToolButton({ icon: Icon, label, shortcut, active, onClick }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-[1px] rounded-lg px-2 py-1.5 min-w-[40px] transition-all duration-150",
        active
          ? "bg-blue-100 text-blue-700"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      )}
      title={label}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
      {shortcut && (
        <span className="text-[9px] leading-none font-medium text-gray-400">
          {shortcut}
        </span>
      )}
    </button>
  );
}
