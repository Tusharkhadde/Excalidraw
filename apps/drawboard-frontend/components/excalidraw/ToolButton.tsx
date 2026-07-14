"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  order?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ToolButton({
  icon: Icon,
  label,
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
          ? "bg-cyan-400 text-[#061014] shadow-[0_0_24px_rgba(34,211,238,0.3)]"
          : "bg-transparent text-[#2f3342] hover:bg-[#f5f4fb]",
        className
      )}
      aria-label={label}
    >
      <Icon className="h-[20px] w-[20px]" strokeWidth={1.7} />
    </button>
  );
}
