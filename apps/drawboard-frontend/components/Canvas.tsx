"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Command, HelpCircle, X } from "lucide-react";
import { Game, preloadImage } from "@/draw/Game";
import { HamburgerMenu } from "./excalidraw/HamburgerMenu";
import { TopRightActions } from "./excalidraw/TopRightActions";
import { TopToolbar } from "./excalidraw/TopToolbar";
import { ChatPanel } from "./excalidraw/ChatPanel";
import { useAuth } from "@/lib/auth";
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerOutput,
  ColorPickerFormat,
} from "@repo/ui/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
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

export function Canvas({ roomId, socket, isGuest = false }: { socket: WebSocket; roomId: string; isGuest?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const selectedToolRef = useRef<Tool>("selection");
  const committedRef = useRef(false);

  const [game, setGame] = useState<Game | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("selection");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [locked, setLocked] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [showHint, setShowHint] = useState(true);
  const [textInput, setTextInput] = useState<{ canvasX: number; canvasY: number; screenX: number; screenY: number; editingShape?: Shape } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDark, setIsDark] = useState(false);
  const [gridEnabled] = useState(false);
  const [dotsEnabled] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#1e1e1e");
  const [fillColor, setFillColor] = useState("transparent");
  const { user } = useAuth();

  const themeMode = isDark ? "dark" : "light";

  useEffect(() => {
    function handleAppKeyDown(e: globalThis.KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (e.key === "?") {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
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
    game?.setStrokeColor(strokeColor);
  }, [strokeColor, game]);

  useEffect(() => {
    game?.setFillColor(fillColor);
  }, [fillColor, game]);

  useEffect(() => {
    if (shapes.length > 0) {
      setShowHint(false);
    }
  }, [shapes.length]);

  useEffect(() => {
    if (textInput) {
      requestAnimationFrame(() => textAreaRef.current?.focus());
    }
  }, [textInput]);

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
    nextGame.setTextClickHandler((canvasX, canvasY, screenX, screenY, editingShape) => {
      committedRef.current = false;
      setTextInput({ canvasX, canvasY, screenX, screenY, editingShape });
    });
    nextGame.setImageClickHandler(() => {
      fileInputRef.current?.click();
    });
    nextGame.setZoomChangeHandler((value) => setZoom(value));
    nextGame.setStrokeColor(strokeColor);
    nextGame.setFillColor(fillColor);

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
    const tool = toolId as Tool;
    setSelectedTool(tool);
  };

  const handleClearCanvas = useCallback(() => {
    game?.clearShapes();
    setShapes([]);
    setShowHint(true);
    socket.send(JSON.stringify({ type: "clear", roomId }));
  }, [game, socket, roomId]);

  const commitText = () => {
    if (committedRef.current) return;
    const value = textAreaRef.current?.value ?? "";
    if (!textInput || !value.trim() || !game) {
      setTextInput(null);
      return;
    }

    committedRef.current = true;
    const editing = textInput.editingShape;
    const editingFont = editing?.type === "text" ? editing.fontSize : undefined;
    const shape: Shape = {
      type: "text",
      id: editing ? editing.id : `shape_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      x: textInput.canvasX,
      y: textInput.canvasY,
      text: value,
      fontSize: editingFont ?? 32,
      strokeColor: isDark ? "#ffffff" : (strokeColor || "#1e1e1e"),
      strokeWidth: 0,
    };

    game.addShape(shape);
    socket.send(JSON.stringify({ type: editing ? "update" : "draw", roomId, shape }));
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
            strokeColor={strokeColor}
            fillColor={fillColor}
            onStrokeColorChange={setStrokeColor}
            onFillColorChange={setFillColor}
          />
        </div>

        <div className="absolute left-1/2 top-6 -translate-x-1/2 pointer-events-auto flex items-center gap-4">
          <TopToolbar activeTool={selectedTool} onToolChange={handleToolChange} />
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur transition-colors ${
                    isDark
                      ? "border-white/10 bg-gray-900/80 text-white shadow-[0_12px_28px_-22px_rgba(16,24,40,0.45)]"
                      : "border-gray-200 bg-white text-gray-600 shadow-lg shadow-gray-200/50"
                  }`}
                  title="Colors"
                >
                  <div className="h-5 w-5 rounded-full border border-current" style={{ backgroundColor: strokeColor }} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className={`w-[280px] p-3 ${isDark ? "border-white/10 bg-gray-900/95 text-white" : "border-gray-200 bg-white text-gray-900 shadow-xl"}`}
                align="start"
              >
                <ColorPicker value={strokeColor} onChange={([r, g, b]) => setStrokeColor(`#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`)}>
                  <ColorPickerSelection className="h-40 rounded-lg" />
                  <ColorPickerHue />
                  <ColorPickerAlpha />
                  <div className="flex items-center gap-2">
                    <ColorPickerEyeDropper />
                    <ColorPickerOutput />
                    <ColorPickerFormat />
                  </div>
                </ColorPicker>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex-shrink-0 pointer-events-auto">
          <TopRightActions shapes={shapes} onClear={handleClearCanvas} isGuest={isGuest} roomId={roomId} isDark={isDark} />
        </div>
      </div>

      {locked && (
        <div className="absolute top-24 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          Canvas is locked
        </div>
      )}

      {showHint && !locked && (
        <div className="pointer-events-none absolute inset-x-0 top-28 z-10 flex justify-center">
          <p className="text-center text-[14px] text-gray-400">
            To move canvas, hold{" "}
            <kbd className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[13px] font-mono text-gray-500 shadow-sm">
              Scroll wheel
            </kbd>{" "}
            or{" "}
            <kbd className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[13px] font-mono text-gray-500 shadow-sm">
              Space
            </kbd>{" "}
            while dragging, or use the hand tool
          </p>
        </div>
      )}

      {textInput && (
        <textarea
          ref={textAreaRef}
          autoFocus
          defaultValue={textInput.editingShape?.type === "text" ? textInput.editingShape.text : ""}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              commitText();
            } else if (e.key === "Escape") {
              e.preventDefault();
              if (textInput.editingShape && game) {
                game.cancelEdit(textInput.editingShape);
              }
              setTextInput(null);
            }
          }}
          onBlur={commitText}
          className="absolute z-30 min-w-[140px] resize-none overflow-hidden rounded-none border-0 border-b-2 border-dashed border-blue-400 bg-transparent p-0 text-[20px] leading-tight outline-none"
          style={{
            left: textInput.screenX,
            top: textInput.screenY - 26,
            fontFamily: "Caveat, Virgil, Segoe UI Emoji, sans-serif",
            fontSize: "32px",
            lineHeight: "1.2",
            color: textColor,
            background: isDark ? "rgba(0,0,0,0.3)" : "rgba(59,130,246,0.06)",
            borderRadius: "2px",
            padding: "4px 2px",
            minHeight: "32px",
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

      <div className={`absolute bottom-4 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border ${isDark ? "border-white/10 bg-gray-900/80 text-gray-300" : "border-gray-200 bg-white text-gray-600 shadow-lg shadow-gray-200/50"} px-3 py-1.5 text-[11px] backdrop-blur transition-colors duration-300`}>
        <span className={`h-1.5 w-1.5 rounded-full ${isDark ? "bg-blue-400" : "bg-blue-500"}`} />
        <span className="font-medium capitalize">{selectedTool}</span>
        <span className={isDark ? "text-gray-500" : "text-gray-300"}>•</span>
        <span>{Math.round(zoom * 100)}%</span>
      </div>

      <div className="absolute bottom-5 right-24 z-20 flex items-center gap-2">
        <ChatPanel socket={socket} roomId={roomId} isDark={isDark} currentUserId={user?.id} />
      </div>

      <button
        onClick={() => setShowShortcuts(true)}
        className={`absolute bottom-5 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? "bg-gray-900/80 text-white" : "bg-white text-gray-700 shadow-lg shadow-gray-200/50"} transition-colors`}
        title="Show shortcuts"
      >
        <HelpCircle className="h-5 w-5" strokeWidth={1.8} />
      </button>

      {showShortcuts && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}>
          <div
            className="cheat-sheet mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowShortcuts(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-1 gap-1">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-50">
                    <span className="text-sm text-gray-600">{shortcut.desc}</span>
                    <span className="flex items-center gap-1">
                      {Array.isArray(shortcut.keys) ? (
                        shortcut.keys.map((key, keyIndex) => (
                          <span key={keyIndex}>
                            <kbd className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-mono text-gray-700">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && <span className="mx-1 text-xs text-gray-400">+</span>}
                          </span>
                        ))
                      ) : (
                        <kbd className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-mono text-gray-700">
                          {shortcut.keys}
                        </kbd>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 px-5 py-3 text-center">
              <p className="text-xs text-gray-400">
                Press <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">?</kbd> to toggle this window
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-500 ${isDark ? "bg-[#1a1a2e]" : "bg-transparent"}`} />
    </div>
  );
}
