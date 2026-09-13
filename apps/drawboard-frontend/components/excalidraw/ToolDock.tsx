"use client";

import { Lock, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TOOLS } from "./tools";
import type { Tool } from "./types";

interface ToolDockProps {
  active: Tool;
  locked: boolean;
  onSelect: (tool: Tool) => void;
  onToggleLock: () => void;
}

/** Vertical tool dock on the left edge. Each tool shows its single-key shortcut on hover. */
export function ToolDock({ active, locked, onSelect, onToggleLock }: ToolDockProps) {
  return (
    // Short viewports fold the dock into two columns so it never collides with the header or zoom pill.
    <div className="glass pointer-events-auto grid grid-cols-1 justify-items-center gap-1 rounded-2xl p-1.5 [@media(max-height:760px)]:grid-cols-2">
      {TOOLS.map((tool, i) => {
        const Icon = tool.icon;
        const isActive = active === tool.id;
        const groupBreak = i === 2 || i === 8;
        return (
          <div key={tool.id} className="contents">
            {groupBreak && <span className="col-span-full my-0.5 h-px w-6 bg-border" />}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={tool.label}
                  aria-pressed={isActive}
                  disabled={locked}
                  onClick={() => onSelect(tool.id)}
                  className={cn(
                    "relative grid size-10 place-items-center rounded-xl text-muted-foreground transition-all duration-200",
                    "hover:bg-accent hover:text-foreground active:scale-95 disabled:opacity-40",
                    isActive && "bg-primary text-primary-foreground shadow-glow hover:bg-primary hover:text-primary-foreground",
                  )}
                >
                  <Icon size={18} strokeWidth={1.9} />
                  <span
                    className={cn(
                      "absolute bottom-1 right-1.5 text-[9px] font-semibold leading-none",
                      isActive ? "text-primary-foreground/70" : "text-muted-foreground/60",
                    )}
                  >
                    {tool.key}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-2">
                {tool.label}
                <kbd className="rounded bg-background/20 px-1.5 py-0.5 font-mono text-[10px]">{tool.key}</kbd>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}

      <span className="col-span-full my-0.5 h-px w-6 bg-border" />

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={locked ? "Unlock canvas" : "Lock canvas"}
            aria-pressed={locked}
            onClick={onToggleLock}
            className={cn(
              "grid size-10 place-items-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground active:scale-95",
              locked && "bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 hover:text-amber-600 dark:text-amber-300",
            )}
          >
            {locked ? <Lock size={18} strokeWidth={1.9} /> : <LockOpen size={18} strokeWidth={1.9} />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {locked ? "Unlock canvas" : "Lock canvas"}
          <kbd className="rounded bg-background/20 px-1.5 py-0.5 font-mono text-[10px]">Q</kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
