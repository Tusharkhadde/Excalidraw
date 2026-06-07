"use client";

import { useEffect, useState } from "react";
import { HelpCircle, ShieldCheck } from "lucide-react";
import { TopToolbar } from "@/components/excalidraw/TopToolbar";
import { HamburgerMenu } from "@/components/excalidraw/HamburgerMenu";
import { TopRightActions } from "@/components/excalidraw/TopRightActions";
import { DrawingCanvas } from "@/components/excalidraw/DrawingCanvas";
import type { Shape } from "@/components/excalidraw/types";

export default function ExcalidrawUIDemo() {
  const [activeTool, setActiveTool] = useState("selection");
  const [locked, setLocked] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [showHint, setShowHint] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (shapes.length > 0) {
      setShowHint(false);
    }
  }, [shapes.length]);

  useEffect(() => {
    if (activeTool === "lock") {
      setLocked((current) => !current);
      setActiveTool("selection");
    }
  }, [activeTool]);

  const handleMenuClick = (itemId: string) => {
    if (itemId === "reset") {
      setShapes([]);
      setShowHint(true);
    }
  };

  const handleClearCanvas = () => {
    setShapes([]);
    setShowHint(true);
  };

  return (
    <div
      className={`relative flex min-h-screen flex-col overflow-hidden ${
        theme === "light" ? "bg-[#fcfbff] text-[#202433]" : "bg-[#17181f] text-white"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,#fcfbff_56%,#f6f4fb_100%)]" />
      </div>

      <div className="relative z-20 flex items-start justify-between px-6 pt-6 pointer-events-none">
        <div className="flex-shrink-0 pointer-events-auto">
          <HamburgerMenu
            onItemClick={handleMenuClick}
            theme={theme}
            onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
          />
        </div>

        <div className="absolute left-1/2 top-6 -translate-x-1/2 pointer-events-auto">
          <TopToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        </div>

        <div className="flex-shrink-0 pointer-events-auto">
          <TopRightActions shapes={shapes} onClear={handleClearCanvas} />
        </div>
      </div>

      <DrawingCanvas
        activeTool={activeTool}
        locked={locked}
        shapes={shapes}
        setShapes={setShapes}
      />

      {locked && (
        <div className="absolute left-1/2 top-24 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Canvas is locked. Pick the Lock tool again to unlock.
        </div>
      )}

      {showHint && (
        <div className="pointer-events-none absolute inset-x-0 top-28 z-10 flex justify-center">
          <p className="text-center text-[14px] text-[#b3b5c0]">
            To move canvas, hold{" "}
            <span className="rounded-md border border-[#e8e6f2] bg-white/90 px-1.5 py-0.5 text-[13px] text-[#9c9fad] shadow-sm">
              Scroll wheel
            </span>{" "}
            or{" "}
            <span className="rounded-md border border-[#e8e6f2] bg-white/90 px-1.5 py-0.5 text-[13px] text-[#9c9fad] shadow-sm">
              Space
            </span>{" "}
            while dragging, or use the hand tool
          </p>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#e8e6f2] bg-white/88 px-3 py-1.5 text-[11px] text-[#777b8b] shadow-[0_12px_28px_-22px_rgba(16,24,40,0.45)] backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        <span className="font-medium capitalize">{activeTool}</span>
        <span className="text-[#d1d5e3]">•</span>
        <span>
          {shapes.length} shape{shapes.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="absolute bottom-5 right-24 z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-[#6d63da] shadow-[0_12px_28px_-22px_rgba(16,24,40,0.45)]">
        <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
      </div>

      <div className="absolute bottom-5 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ece9f5] text-[#2d3140] shadow-[0_12px_28px_-22px_rgba(16,24,40,0.45)]">
        <HelpCircle className="h-5 w-5" strokeWidth={1.8} />
      </div>
    </div>
  );
}
