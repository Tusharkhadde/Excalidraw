"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Command, HelpCircle, ShieldCheck, X } from "lucide-react";
import { Game, preloadImage } from "@/draw/Game";
import { HamburgerMenu } from "./excalidraw/HamburgerMenu";
import { TopRightActions } from "./excalidraw/TopRightActions";
import { TopToolbar } from "./excalidraw/TopToolbar";
import type { Shape } from "@repo/common/types";

export type Tool =
  | "selection"
  | "hand"
  | "lock"
  | "pencil"
  | "rectangle"
  | "circle"
  | "diamond"
  | "arrow"
  | "line"
  | "text"
  | "image"
  | "eraser";

export function Canvas({ roomId, socket }: { socket: WebSocket; roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedToolRef = useRef<Tool>("selection");

  const [game, setGame] = useState<Game | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("selection");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [locked, setLocked] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [showHint, setShowHint] = useState(true);
  const [textInput, setTextInput] = useState<{ x: number; y: number; value: string } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDark, setIsDark] = useState(false);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [dotsEnabled, setDotsEnabled] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const themeMode = isDark ? "dark" : "light";

  useEffect(() => {
    function handleAppKeyDown(e: globalThis.KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (e.key === "?") {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }

      if (e.key === "g" || e.key === "G") {
        e.preventDefault();
        if (!e.shiftKey) {
          setGridEnabled((prev) => {
            setDotsEnabled(false);
            return !prev;
          });
        } else {
          setDotsEnabled((prev) => {
            setGridEnabled(false);
            return !prev;
          });
        }
      }
    }

    window.addEventListener("keydown", handleAppKeyDown);
    return () => window.removeEventListener("keydown", handleAppKeyDown);
  }, []);

  useEffect(() => {
    function resize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      game?.setCanvasBg("#1a1a2e");
    } else {
      document.documentElement.classList.remove("dark");
      game?.setCanvasBg("#ffffff");
    }
  }, [isDark, game]);

  useEffect(() => {
    if (shapes.length > 0) {
      setShowHint(false);
    }
  }, [shapes.length]);

  useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

  useEffect(() => {
    if (selectedTool === "lock") {
      setLocked((current) => !current);
      setSelectedTool("selection");
      return;
    }

    if (!locked) {
      game?.setTool(selectedTool);
    }
  }, [selectedTool, game, locked]);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const nextGame = new Game(canvasRef.current, roomId, socket);
    setGame(nextGame);

    nextGame.setTool(selectedToolRef.current);
    nextGame.setTextClickHandler((x, y) => {
      setTextInput({ x, y, value: "" });
    });
    nextGame.setImageClickHandler(() => {
      fileInputRef.current?.click();
    });
    nextGame.setZoomChangeHandler((value) => setZoom(value));

    const syncInterval = setInterval(() => {
      setShapes([...nextGame.getShapes()]);
    }, 250);

    return () => {
      clearInterval(syncInterval);
      nextGame.destroy();
    };
  }, [roomId, socket, dimensions.width]);

  const handleToolChange = (toolId: string) => {
    if (locked && toolId !== "lock") return;
    setSelectedTool(toolId as Tool);
  };

  const handleClearCanvas = useCallback(() => {
    game?.clearShapes();
    setShapes([]);
    setShowHint(true);
    socket.send(JSON.stringify({ type: "clear", roomId }));
  }, [game, socket, roomId]);

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
      strokeColor: isDark ? "#ffffff" : "#1e1e1e",
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
        const width = img.width * ratio;
        const height = img.height * ratio;
        const x = window.innerWidth / 2 - width / 2;
        const y = window.innerHeight / 2 - height / 2;

        const shape: Shape = {
          type: "image",
          id: `shape_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
          x,
          y,
          width,
          height,
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
    setSelectedTool("selection");
  };

  const handleMenuClick = useCallback(
    (itemId: string) => {
      if (itemId === "reset") {
        handleClearCanvas();
        return;
      }
      if (itemId === "help") {
        setShowShortcuts(true);
      }
    },
    [handleClearCanvas]
  );

  const bgClass = isDark
    ? "bg-[#1a1a2e]"
    : gridEnabled
      ? "canvas-grid"
      : dotsEnabled
        ? "canvas-dots"
        : "bg-[#fcfbff]";

  const textColor = isDark ? "#ffffff" : "#1e1e1e";
  const canvasBg = isDark ? "#1a1a2e" : "#ffffff";

  const shortcuts = [
    { keys: ["V"], desc: "Select tool" },
    { keys: ["H"], desc: "Hand tool" },
    { keys: ["P"], desc: "Pencil tool" },
    { keys: ["R"], desc: "Rectangle" },
    { keys: ["D"], desc: "Diamond" },
    { keys: ["O"], desc: "Circle" },
    { keys: ["A"], desc: "Arrow" },
    { keys: ["L"], desc: "Line" },
    { keys: ["T"], desc: "Text tool" },
    { keys: ["I"], desc: "Insert image" },
    { keys: ["E"], desc: "Eraser" },
    { keys: ["G"], desc: "Toggle grid/dots" },
    { keys: [<Command key="cmd" className="inline h-3 w-3" />, "+"], desc: "Zoom in" },
    { keys: [<Command key="cmd" className="inline h-3 w-3" />, "-"], desc: "Zoom out" },
    { keys: [<Command key="cmd" className="inline h-3 w-3" />, "0"], desc: "Reset zoom" },
    { keys: ["Space", "Drag"], desc: "Pan canvas" },
    { keys: ["Del/Backspace"], desc: "Delete selected" },
    { keys: ["Esc"], desc: "Deselect / Cancel" },
  ];

  return (
    <div ref={containerRef} className={`relative h-screen w-screen overflow-hidden transition-colors duration-300 ${bgClass}`}>
      <div className="pointer-events-none absolute inset-0 z-0 opacity-80">
        {!isDark && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,#fcfbff_56%,#f6f4fb_100%)]" />
        )}
      </div>

      <style>{`.game-canvas-bg { background: ${canvasBg}; }`}</style>

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className={`absolute inset-0 z-10 block h-full w-full game-canvas-bg ${gridEnabled ? "canvas-grid" : dotsEnabled ? "canvas-dots" : ""}`}
        style={{ pointerEvents: locked ? "none" : "auto" }}
      />

      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-6 pt-6 pointer-events-none">
        <div className="flex-shrink-0 pointer-events-auto">
          <HamburgerMenu
            onItemClick={handleMenuClick}
            theme={themeMode}
            onThemeToggle={() => setIsDark((prev) => !prev)}
          />
        </div>

        <div className="absolute left-1/2 top-6 -translate-x-1/2 pointer-events-auto">
          <TopToolbar activeTool={selectedTool} onToolChange={handleToolChange} />
        </div>

        <div className="flex-shrink-0 pointer-events-auto">
          <TopRightActions shapes={shapes} onClear={handleClearCanvas} />
        </div>
      </div>

      {locked && (
        <div className="absolute top-24 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber-200 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 shadow-sm backdrop-blur dark:text-amber-400">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Canvas is locked
        </div>
      )}

      {showHint && !locked && (
        <div className="pointer-events-none absolute inset-x-0 top-28 z-10 flex justify-center">
          <p className="text-center text-[14px] text-[#b3b5c0] dark:text-gray-500">
            To move canvas, hold{" "}
            <kbd className="rounded-md border border-[#e8e6f2] bg-white/90 px-1.5 py-0.5 text-[13px] font-mono text-[#9c9fad] shadow-sm dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-300">
              Scroll wheel
            </kbd>{" "}
            or{" "}
            <kbd className="rounded-md border border-[#e8e6f2] bg-white/90 px-1.5 py-0.5 text-[13px] font-mono text-[#9c9fad] shadow-sm dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-300">
              Space
            </kbd>{" "}
            while dragging, or use the hand tool
          </p>
        </div>
      )}

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
            color: textColor,
          }}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      <div className={`absolute bottom-4 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border ${isDark ? "border-white/10 bg-gray-900/80 text-gray-300" : "border-[#e8e6f2] bg-white/90 text-[#777b8b]"} px-3 py-1.5 text-[11px] shadow-[0_12px_28px_-22px_rgba(16,24,40,0.45)] backdrop-blur transition-colors duration-300`}>
        <span className={`h-1.5 w-1.5 rounded-full ${isDark ? "bg-blue-400" : "bg-blue-500"}`} />
        <span className="font-medium capitalize">{selectedTool}</span>
        <span className={isDark ? "text-gray-500" : "text-[#d1d5e3]"}>•</span>
        <span>{shapes.length} shape{shapes.length === 1 ? "" : "s"}</span>
        <span className={isDark ? "text-gray-500" : "text-[#d1d5e3]"}>•</span>
        <span>{Math.round(zoom * 100)}%</span>
      </div>

      <div className={`absolute bottom-5 right-24 z-20 flex h-10 w-10 items-center justify-center rounded-2xl ${isDark ? "bg-gray-900/80 text-[#8f87f0]" : "bg-white/90 text-[#6d63da]"} shadow-[0_12px_28px_-22px_rgba(16,24,40,0.45)]`}>
        <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
      </div>

      <button
        onClick={() => setShowShortcuts(true)}
        className={`absolute bottom-5 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? "bg-gray-900/80 text-white" : "bg-[#ece9f5] text-[#2d3140]"} shadow-[0_12px_28px_-22px_rgba(16,24,40,0.45)] transition-colors`}
        title="Show shortcuts"
      >
        <HelpCircle className="h-5 w-5" strokeWidth={1.8} />
      </button>

      {showShortcuts && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}>
          <div
            className="cheat-sheet mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 frosted-glass shadow-xl-dark"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowShortcuts(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-1 gap-1">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-white/5">
                    <span className="text-sm text-gray-300">{shortcut.desc}</span>
                    <span className="flex items-center gap-1">
                      {Array.isArray(shortcut.keys) ? (
                        shortcut.keys.map((key, keyIndex) => (
                          <span key={keyIndex}>
                            <kbd className="inline-flex items-center rounded border border-white/10 bg-white/10 px-2 py-0.5 text-xs font-mono text-gray-200">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && <span className="mx-1 text-xs text-gray-500">+</span>}
                          </span>
                        ))
                      ) : (
                        <kbd className="rounded border border-white/10 bg-white/10 px-2 py-0.5 text-xs font-mono text-gray-200">
                          {shortcut.keys}
                        </kbd>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-white/10 px-5 py-3 text-center">
              <p className="text-xs text-gray-500">
                Press <kbd className="rounded bg-white/5 px-1.5 py-0.5 text-xs font-mono">?</kbd> to toggle this window
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-500 ${isDark ? "bg-[#1a1a2e]" : "bg-transparent"}`} />
    </div>
  );
}
