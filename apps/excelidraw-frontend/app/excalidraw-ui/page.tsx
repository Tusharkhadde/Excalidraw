"use client";

import { useState, useEffect } from "react";
import { TopToolbar } from "@/components/excalidraw/TopToolbar";
import { HamburgerMenu } from "@/components/excalidraw/HamburgerMenu";
import { TopRightActions } from "@/components/excalidraw/TopRightActions";
import { DrawingCanvas } from "@/components/excalidraw/DrawingCanvas";
import type { Shape } from "@/components/excalidraw/types";

const gridPattern = `
  radial-gradient(circle, #e5e7eb 0.8px, transparent 0.8px)
`;

export default function ExcalidrawUIDemo() {
  const [activeTool, setActiveTool] = useState("selection");
  const [locked, setLocked] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (shapes.length > 0) setShowHint(false);
  }, [shapes.length]);

  useEffect(() => {
    if (activeTool === "lock") {
      setLocked((l) => !l);
      setActiveTool("selection");
    }
  }, [activeTool]);

  const handleMenuClick = (itemId: string) => {
    if (itemId === "reset") {
      setShapes([]);
      setShowHint(true);
    }
    console.log("Menu item clicked:", itemId);
  };

  const handleClearCanvas = () => {
    setShapes([]);
    setShowHint(true);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-hidden">
      {/* Top bar */}
      <div className="relative z-20 flex items-start justify-between px-4 pt-3 pointer-events-none">
        {/* Left: Hamburger */}
        <div className="flex-shrink-0 pointer-events-auto">
          <HamburgerMenu onItemClick={handleMenuClick} />
        </div>

        {/* Center: Toolbar */}
        <div className="absolute left-1/2 top-3 -translate-x-1/2 pointer-events-auto">
          <TopToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        </div>

        {/* Right: Actions */}
        <div className="flex-shrink-0 pointer-events-auto">
          <TopRightActions shapes={shapes} onClear={handleClearCanvas} />
        </div>
      </div>

      {/* Drawing canvas */}
      <DrawingCanvas
        activeTool={activeTool}
        locked={locked}
        shapes={shapes}
        setShapes={setShapes}
      />

      {/* Locked banner */}
      {locked && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Canvas is locked. Pick the Lock tool again to unlock.
        </div>
      )}

      {/* Helper text */}
      {showHint && (
        <div className="pointer-events-none absolute inset-x-0 top-20 flex justify-center z-10">
          <p className="text-sm text-gray-400">
            To move canvas, hold Scroll wheel or Space while dragging, or use the hand tool
          </p>
        </div>
      )}

      {/* Bottom status bar with active tool & shape count */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-[11px] text-gray-500 shadow-sm backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        <span className="font-medium capitalize">{activeTool}</span>
        <span className="text-gray-300">•</span>
        <span>{shapes.length} shape{shapes.length === 1 ? "" : "s"}</span>
      </div>
    </div>
  );
}
