"use client";

import { useEffect, useRef, useState } from "react";
import { Game } from "@/draw/Game";
import { TopToolbar } from "./excalidraw/TopToolbar";
import { HamburgerMenu } from "./excalidraw/HamburgerMenu";
import { TopRightActions } from "./excalidraw/TopRightActions";
import { ShareRoom } from "./ShareRoom";
import { preloadImage } from "@/draw/Game";
import type { Shape } from "@repo/common/types";

export type Tool =
  | "lock"
  | "hand"
  | "selection"
  | "rectangle"
  | "diamond"
  | "ellipse"
  | "arrow"
  | "line"
  | "pencil"
  | "text"
  | "image"
  | "eraser"
  | "more";

export function Canvas({ roomId, socket }: { socket: WebSocket; roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [locked, setLocked] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [showHint, setShowHint] = useState(true);
  const [textInput, setTextInput] = useState<{ x: number; y: number; value: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function resize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (shapes.length > 0) setShowHint(false);
  }, [shapes.length]);

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;
    const g = new Game(canvasRef.current, roomId, socket);
    setGame(g);

    g.setTextClickHandler((x, y) => {
      setTextInput({ x, y, value: "" });
    });

    g.setImageClickHandler(() => {
      fileInputRef.current?.click();
    });

    const syncInterval = setInterval(() => {
      const s = g.getShapes();
      setShapes([...s]);
    }, 250);

    return () => {
      clearInterval(syncInterval);
      g.destroy();
    };
  }, [roomId, socket, dimensions.width]);

  const handleToolChange = (toolId: string) => {
    if (toolId === "lock") {
      setLocked((l) => !l);
      setSelectedTool("pencil");
      return;
    }
    if (toolId === "more") {
      return;
    }
    setSelectedTool(toolId as Tool);
  };

  const handleMenuClick = (itemId: string) => {
    if (itemId === "reset") {
      game?.clearShapes();
      setShapes([]);
      setShowHint(true);
      socket.send(JSON.stringify({ type: "clear", roomId }));
    }
    console.log("Menu item clicked:", itemId);
  };

  const handleClearCanvas = () => {
    game?.clearShapes();
    setShapes([]);
    setShowHint(true);
    socket.send(JSON.stringify({ type: "clear", roomId }));
  };

  const commitText = () => {
    if (!textInput || !textInput.value.trim() || !game) {
      setTextInput(null);
      return;
    }
    const shape: Shape = {
      type: "text",
      id: `shape_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      x: textInput.x,
      y: textInput.y,
      text: textInput.value,
      fontSize: 20,
      strokeColor: "#1e1e1e",
      strokeWidth: 0,
    };
    game.addShape(shape);
    socket.send(JSON.stringify({ type: "draw", roomId, shape }));
    setTextInput(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !game) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const maxW = 300;
        const ratio = img.width > maxW ? maxW / img.width : 1;
        const w = img.width * ratio;
        const h = img.height * ratio;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const shape: Shape = {
          type: "image",
          id: `shape_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
          x: cx - w / 2,
          y: cy - h / 2,
          width: w,
          height: h,
          src,
          strokeColor: "transparent",
          strokeWidth: 0,
        };
        preloadImage(src);
        game.addShape(shape);
        socket.send(JSON.stringify({ type: "draw", roomId, shape }));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setSelectedTool("pencil");
  };

  return (
    <div ref={containerRef} className="relative h-screen w-screen overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="block"
        style={{ pointerEvents: locked ? "none" : "auto" }}
      />

      {/* Top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-start justify-between px-4 pt-3 pointer-events-none">
        <div className="flex-shrink-0 pointer-events-auto">
          <HamburgerMenu onItemClick={handleMenuClick} />
        </div>

        <div className="absolute left-1/2 top-3 -translate-x-1/2 pointer-events-auto">
          <TopToolbar activeTool={selectedTool} onToolChange={handleToolChange} />
        </div>

        <div className="flex-shrink-0 pointer-events-auto">
          <TopRightActions shapes={shapes} onClear={handleClearCanvas} />
        </div>
      </div>

      {/* Locked banner */}
      {locked && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Canvas is locked. Click the Lock tool again to unlock.
        </div>
      )}

      {/* Helper text */}
      {showHint && !locked && (
        <div className="pointer-events-none absolute inset-x-0 top-20 flex justify-center z-10">
          <p className="text-sm text-gray-400">
            To move canvas, hold Scroll wheel or Space while dragging, or use the hand tool
          </p>
        </div>
      )}

      {/* Text input overlay */}
      {textInput && (
        <textarea
          autoFocus
          value={textInput.value}
          onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              commitText();
            } else if (e.key === "Escape") {
              e.preventDefault();
              setTextInput(null);
            }
          }}
          onBlur={commitText}
          placeholder="Type something..."
          className="absolute z-30 min-w-[120px] resize-none border-none bg-transparent p-0 text-[20px] leading-tight outline-none placeholder:text-gray-300"
          style={{
            left: textInput.x,
            top: textInput.y - 22,
            fontFamily: "Virgil, Segoe UI Emoji, sans-serif",
            color: "#1e1e1e",
          }}
        />
      )}

      {/* Image upload input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Bottom status bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-[11px] text-gray-500 shadow-sm backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        <span className="font-medium capitalize">{selectedTool}</span>
        <span className="text-gray-300">•</span>
        <span>{shapes.length} shape{shapes.length === 1 ? "" : "s"}</span>
      </div>

      <ShareRoom roomId={roomId} />
    </div>
  );
}
