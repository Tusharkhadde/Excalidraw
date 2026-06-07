"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  order?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ToolButton({
  icon: Icon,
  label,
  shortcut,
  order,
  active,
  onClick,
  className,
}: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex h-[52px] min-w-[54px] items-center justify-center rounded-2xl border border-transparent px-3 transition-all duration-150",
        active
          ? "bg-[#ece9ff] text-[#5d5bd6] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
          : "bg-transparent text-[#2f3342] hover:bg-[#f5f4fb]",
        className
      )}
      title={`${label}${shortcut ? ` (${shortcut})` : ""}`}
      aria-label={label}
    >
      <Icon className="h-[20px] w-[20px]" strokeWidth={1.7} />
      {(order || shortcut) && (
        <span className="absolute bottom-[6px] right-[8px] text-[11px] font-medium leading-none text-[#8a8ea3]">
          {order || shortcut}
        </span>
      )}
    </button>
  );
}
