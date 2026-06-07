"use client";

import { useState } from "react";
import {
  MousePointer2,
  Pencil,
  RectangleHorizontal,
  Circle,
  Minus,
  Type,
  Eraser,
  Trash2,
  Minimize2,
  Maximize2,
  Grid,
  Sun,
  Moon,
  HelpCircle,
} from "lucide-react";
import { ToolButton } from "./ToolButton";
import type { ToolConfig } from "./types";

interface FloatingToolbarProps {
  activeTool: string;
  onToolChange: (toolId: string) => void;
  onClear: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
  onShowShortcuts: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  gridEnabled: boolean;
  dotsEnabled: boolean;
  onToggleGrid: () => void;
  onToggleDots: () => void;
}

const tools: ToolConfig[] = [
  { id: "selection", icon: MousePointer2, label: "Select", shortcut: "V" },
  { id: "pencil", icon: Pencil, label: "Pencil", shortcut: "P" },
  { id: "rectangle", icon: RectangleHorizontal, label: "Rectangle", shortcut: "R" },
  { id: "circle", icon: Circle, label: "Circle", shortcut: "O" },
  { id: "line", icon: Minus, label: "Line", shortcut: "L" },
  { id: "text", icon: Type, label: "Text", shortcut: "T" },
  { id: "eraser", icon: Eraser, label: "Eraser", shortcut: "E" },
];

const panelClassName =
  "rounded-[28px] border border-slate-200/80 bg-white/96 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.32),0_8px_24px_-18px_rgba(15,23,42,0.2)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/82 dark:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)]";

const iconButtonClassName =
  "tool-btn flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)] transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";

export function FloatingToolbar({
  activeTool,
  onToolChange,
  onClear,
  onToggleTheme,
  isDark,
  onShowShortcuts,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  gridEnabled,
  dotsEnabled,
  onToggleGrid,
  onToggleDots,
}: FloatingToolbarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showBgOptions, setShowBgOptions] = useState(false);

  const handleClick = (toolId: string) => {
    if (toolId === "clear") {
      onClear();
      return;
    }
    onToolChange(toolId);
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 pointer-events-auto">
      <div className={`toolbar-float relative overflow-hidden ${panelClassName}`}>
        {!collapsed && (
          <div className="flex w-[112px] flex-col gap-2 p-3">
            {tools.map((tool) => (
              <ToolButton
                key={tool.id}
                icon={tool.icon}
                label={tool.label}
                shortcut={tool.shortcut}
                active={activeTool === tool.id}
                onClick={() => handleClick(tool.id)}
                className="tool-btn"
              />
            ))}

            <div className="my-1 h-px bg-slate-200/80 dark:bg-white/10" />

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-1.5 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-1">
              <button
                onClick={onZoomOut}
                className="tool-btn flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-white hover:text-slate-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                title="Zoom out (Ctrl/Cmd -)"
                aria-label="Zoom out"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <span className="zoom-indicator min-w-[3rem] px-1 text-center text-sm font-semibold text-slate-700 dark:text-slate-100">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={onZoomIn}
                className="tool-btn flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-white hover:text-slate-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                title="Zoom in (Ctrl/Cmd +)"
                aria-label="Zoom in"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              </div>
              <button
                onClick={onResetZoom}
                className="tool-btn mt-1 flex h-9 w-full items-center justify-center rounded-xl border border-transparent text-[11px] font-medium tracking-[0.14em] text-slate-500 transition-colors hover:border-slate-200 hover:bg-white hover:text-slate-700 dark:text-slate-300 dark:hover:border-white/10 dark:hover:bg-white/10 dark:hover:text-white"
                title="Reset zoom (Ctrl/Cmd 0)"
                aria-label="Reset zoom"
              >
                RESET
              </button>
            </div>

            <div className="my-1 h-px bg-slate-200/80 dark:bg-white/10" />

            <button
              onClick={() => setShowBgOptions(!showBgOptions)}
              className="tool-btn flex w-full items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              title="Background options"
              aria-label="Background options"
            >
              <Grid className="h-4 w-4" />
              <span className="text-sm font-medium">Background</span>
              <span className="ml-auto text-[11px] font-semibold tracking-[0.14em] text-slate-400 dark:text-slate-500">G</span>
            </button>

            {showBgOptions && (
              <div className="space-y-1 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-2 dark:border-white/10 dark:bg-white/5">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-sm text-slate-600 transition-colors hover:bg-white dark:text-slate-300 dark:hover:bg-white/10">
                  <input
                    type="checkbox"
                    checked={gridEnabled}
                    onChange={onToggleGrid}
                    className="h-4 w-4 accent-blue-500 rounded"
                  />
                  <span>Grid</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-sm text-slate-600 transition-colors hover:bg-white dark:text-slate-300 dark:hover:bg-white/10">
                  <input
                    type="checkbox"
                    checked={dotsEnabled}
                    onChange={onToggleDots}
                    className="h-4 w-4 accent-blue-500 rounded"
                  />
                  <span>Dots</span>
                </label>
              </div>
            )}

            <div className="my-1 h-px bg-slate-200/80 dark:bg-white/10" />

            <button
              onClick={onClear}
              className="tool-btn flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15"
              title="Clear canvas (Del)"
              aria-label="Clear canvas"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm font-medium">Clear</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute bottom-2 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.45)] transition-all dark:border-white/10 dark:bg-slate-900 dark:text-slate-400 ${collapsed ? "rotate-180" : ""}`}
          title={collapsed ? "Expand toolbar" : "Collapse toolbar"}
          aria-label={collapsed ? "Expand toolbar" : "Collapse toolbar"}
        >
          <Minimize2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <button
          onClick={onToggleTheme}
          className={iconButtonClassName}
          title={isDark ? "Light mode" : "Dark mode"}
          aria-label={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          onClick={onShowShortcuts}
          className={iconButtonClassName}
          title="Keyboard shortcuts (?)"
          aria-label="Keyboard shortcuts"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
