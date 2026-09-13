"use client";

import { Check, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FILLS, STROKE_WIDTHS, SWATCHES } from "./tools";

interface StyleRailProps {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  showFill: boolean;
  onStrokeColor: (v: string) => void;
  onFillColor: (v: string) => void;
  onStrokeWidth: (v: number) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

/** Contextual style controls shown when a drawing tool is active. */
export function StyleRail({ strokeColor, fillColor, strokeWidth, showFill, onStrokeColor, onFillColor, onStrokeWidth }: StyleRailProps) {
  const customStroke = !SWATCHES.some((s) => s.value.toLowerCase() === strokeColor.toLowerCase());
  // The engine renders ink as light on a dark board, so preview the swatch the same way.
  const swatchBg = (value: string) => (value === "#1e1e1e" ? "hsl(var(--foreground))" : value);

  return (
    <div className="glass pointer-events-auto w-[196px] animate-scale-in space-y-4 rounded-2xl p-3.5">
      <Section title="Stroke">
        <div className="grid grid-cols-5 gap-1.5">
          {SWATCHES.map((s) => {
            const active = s.value.toLowerCase() === strokeColor.toLowerCase();
            return (
              <Tooltip key={s.value}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={s.name}
                    aria-pressed={active}
                    onClick={() => onStrokeColor(s.value)}
                    className={cn(
                      "grid size-7 place-items-center rounded-lg border transition-transform hover:scale-110 active:scale-95",
                      active ? "border-foreground/40 ring-2 ring-primary/40 ring-offset-1 ring-offset-card" : "border-black/10",
                    )}
                    style={{ background: swatchBg(s.value) }}
                  >
                    {active && <Check size={12} className={cn("drop-shadow", s.value === "#1e1e1e" ? "text-background" : "text-white")} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">{s.name}</TooltipContent>
              </Tooltip>
            );
          })}
          <Tooltip>
            <TooltipTrigger asChild>
              <label
                className={cn(
                  "relative grid size-7 cursor-pointer place-items-center overflow-hidden rounded-lg border border-black/10 transition-transform hover:scale-110",
                  customStroke && "ring-2 ring-primary/40 ring-offset-1 ring-offset-card",
                )}
                style={{ background: customStroke ? strokeColor : "conic-gradient(#f87171,#fbbf24,#34d399,#60a5fa,#a78bfa,#f87171)" }}
              >
                <Pipette size={12} className="text-white drop-shadow" />
                <input type="color" aria-label="Custom stroke colour" value={strokeColor} onChange={(e) => onStrokeColor(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
              </label>
            </TooltipTrigger>
            <TooltipContent side="left">Custom</TooltipContent>
          </Tooltip>
        </div>
      </Section>

      {showFill && (
        <Section title="Fill">
          <div className="grid grid-cols-6 gap-1.5">
            {FILLS.map((f) => {
              const active = f.value === fillColor;
              const none = f.value === "transparent";
              return (
                <Tooltip key={f.value}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={f.name}
                      aria-pressed={active}
                      onClick={() => onFillColor(f.value)}
                      className={cn(
                        "relative grid size-6 place-items-center overflow-hidden rounded-md border transition-transform hover:scale-110 active:scale-95",
                        active ? "border-foreground/40 ring-2 ring-primary/40 ring-offset-1 ring-offset-card" : "border-black/10",
                      )}
                      style={{ background: none ? "transparent" : f.value }}
                    >
                      {none && <span className="absolute h-px w-[140%] rotate-45 bg-destructive/70" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">{f.name}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </Section>
      )}

      <Section title="Width">
        <div className="grid grid-cols-3 gap-1.5">
          {STROKE_WIDTHS.map((w) => {
            const active = w.value === strokeWidth;
            return (
              <button
                key={w.value}
                type="button"
                aria-label={w.name}
                aria-pressed={active}
                onClick={() => onStrokeWidth(w.value)}
                className={cn(
                  "flex h-8 items-center justify-center rounded-lg border transition-colors",
                  active ? "border-primary/40 bg-primary/10" : "border-transparent hover:bg-accent",
                )}
              >
                <span className="w-6 rounded-full bg-foreground" style={{ height: w.value }} />
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
