"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Command, HelpCircle, Lock, Maximize, Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";
import { Game, preloadImage } from "@/draw/Game";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Shape } from "@repo/common/types";
import { ToolDock } from "./excalidraw/ToolDock";
import { StyleRail } from "./excalidraw/StyleRail";
import { BoardHeader } from "./excalidraw/BoardHeader";
import { ChatPanel } from "./excalidraw/ChatPanel";
import { CommandPalette } from "./excalidraw/CommandPalette";
import { ShortcutsDialog } from "./excalidraw/ShortcutsDialog";
import { exportPng, exportSvg } from "./excalidraw/exportBoard";
import { STROKE_WIDTHS, STYLED_TOOLS, TOOLS } from "./excalidraw/tools";
import type { BoardCommand, BoardTheme, Connection, Tool } from "./excalidraw/types";

export type { Tool } from "./excalidraw/types";

const THEME_KEY = "drawboard:theme";
const CANVAS_BG: Record<BoardTheme, string> = { light: "#fbfaff", dark: "#0b0c10" };
const TOOL_KEYS = new Map(TOOLS.map((t) => [t.key.toLowerCase(), t.id]));

interface CanvasProps {
  roomId: string;
  /** Null while the session is (re)connecting — the board stays usable offline. */
  socket: WebSocket | null;
  isGuest?: boolean;
  initialShapes?: Shape[];
  roomName?: string | null;
  connection?: Connection;
  attempt?: number;
  onReconnect?: () => void;
}

export function Canvas({ roomId, socket, isGuest = false, initialShapes = [], roomName, connection = "open", attempt = 0, onReconnect }: CanvasProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const selectedToolRef = useRef<Tool>("selection");
  const committedRef = useRef(false);
  /** Last known shapes, so a socket swap rebuilds the board instead of wiping it. */
  const shapesRef = useRef<Shape[]>(initialShapes);
  const styleRef = useRef({ stroke: "#1e1e1e", fill: "transparent", width: STROKE_WIDTHS[1]!.value });

  const [game, setGame] = useState<Game | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("selection");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [locked, setLocked] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [textInput, setTextInput] = useState<{ canvasX: number; canvasY: number; screenX: number; screenY: number; editingShape?: Shape } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [theme, setTheme] = useState<BoardTheme>("light");
  const [strokeColor, setStrokeColor] = useState(styleRef.current.stroke);
  const [fillColor, setFillColor] = useState(styleRef.current.fill);
  const [strokeWidth, setStrokeWidth] = useState(styleRef.current.width);
  const [history, setHistory] = useState({ undo: false, redo: false });
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const isDark = theme === "dark";
  const isEmpty = shapes.length === 0;
  const activeTool = TOOLS.find((t) => t.id === selectedTool);

  /* ---------- theme (persisted) ---------- */
  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    game?.setCanvasBg(CANVAS_BG[theme]);
    // Leaving the board must not leave the rest of the app in dark mode.
    return () => document.documentElement.classList.remove("dark");
  }, [isDark, theme, game]);

  // Persist on user action only — writing from an effect would race the read above on mount.
  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  /* ---------- viewport ---------- */
  useEffect(() => {
    const resize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------- style → engine ---------- */
  useEffect(() => {
    styleRef.current = { stroke: strokeColor, fill: fillColor, width: strokeWidth };
    game?.setStrokeColor(strokeColor);
    game?.setFillColor(fillColor);
    game?.setStrokeWidth(strokeWidth);
  }, [strokeColor, fillColor, strokeWidth, game]);

  useEffect(() => {
    selectedToolRef.current = selectedTool;
    if (!locked) game?.setTool(selectedTool);
  }, [selectedTool, game, locked]);

  useEffect(() => {
    if (textInput) requestAnimationFrame(() => textAreaRef.current?.focus());
  }, [textInput]);

  /* ---------- engine lifecycle ---------- */
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    // Seeded from the last known shapes so a reconnect never drops in-progress work.
    const nextGame = new Game(canvasRef.current, roomId, socket, shapesRef.current);
    setGame(nextGame);

    nextGame.setTool(selectedToolRef.current);
    nextGame.setStrokeColor(styleRef.current.stroke);
    nextGame.setFillColor(styleRef.current.fill);
    nextGame.setStrokeWidth(styleRef.current.width);
    nextGame.setTextClickHandler((canvasX, canvasY, screenX, screenY, editingShape) => {
      committedRef.current = false;
      setTextInput({ canvasX, canvasY, screenX, screenY, editingShape });
    });
    nextGame.setImageClickHandler(() => fileInputRef.current?.click());
    nextGame.setZoomChangeHandler(setZoom);

    const syncInterval = setInterval(() => {
      const live = [...nextGame.getShapes()];
      shapesRef.current = live;
      setShapes(live);
      setHistory({ undo: nextGame.canUndo(), redo: nextGame.canRedo() });
    }, 250);

    return () => {
      clearInterval(syncInterval);
      nextGame.destroy();
    };
  }, [roomId, socket, dimensions.width]);

  // The board fetch can settle after the canvas mounts — seed it once.
  useEffect(() => {
    if (!game || initialShapes.length === 0 || game.getShapes().length > 0) return;
    shapesRef.current = initialShapes;
    game.loadShapes(initialShapes);
    game.redraw();
  }, [game, initialShapes]);

  /* ---------- commands ---------- */
  const selectTool = useCallback(
    (tool: Tool) => {
      if (locked) return;
      setSelectedTool(tool);
    },
    [locked],
  );

  const toggleLock = useCallback(() => {
    setLocked((prev) => {
      const next = !prev;
      toast(next ? "Canvas locked" : "Canvas unlocked", { description: next ? "Viewing only — press Q to unlock." : undefined, duration: 1800 });
      return next;
    });
  }, []);

  const clearBoard = useCallback(() => {
    if (!game || game.getShapes().length === 0) return;
    game.clearShapes();
    setShapes([]);
    socket?.send(JSON.stringify({ type: "clear", roomId }));
    toast("Board cleared", {
      description: "Everyone in the room sees an empty canvas.",
      action: { label: "Undo", onClick: () => game.undo() },
    });
  }, [game, socket, roomId]);

  const copyLink = useCallback(async () => {
    const url = roomId !== "guest" ? `${window.location.origin}/canvas/${roomId}` : window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Invite link copied", { description: "Anyone with the link can join this board." });
    } catch {
      toast("Copy blocked by the browser", { description: url });
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roomId]);

  const runCommand = useCallback(
    (cmd: BoardCommand) => {
      const name = roomId !== "guest" ? `drawboard-${roomId}` : "drawboard";
      switch (cmd) {
        case "undo":
          return game?.undo();
        case "redo":
          return game?.redo();
        case "zoom-in":
          return game?.zoomBy(1.2);
        case "zoom-out":
          return game?.zoomBy(1 / 1.2);
        case "zoom-reset":
          return game?.resetZoom();
        case "toggle-theme":
          return toggleTheme();
        case "toggle-lock":
          return toggleLock();
        case "clear":
          return clearBoard();
        case "export-png":
          if (!canvasRef.current) return;
          exportPng(canvasRef.current, name, CANVAS_BG[theme]);
          return toast.success("PNG exported");
        case "export-svg":
          exportSvg(shapesRef.current, name, CANVAS_BG[theme]);
          return toast.success("SVG exported");
        case "copy-link":
          return void copyLink();
        case "shortcuts":
          return setShowShortcuts(true);
        case "palette":
          return setPaletteOpen(true);
        case "chat":
          return setChatOpen((o) => !o);
        case "home":
          return router.push("/");
      }
    },
    [game, roomId, theme, toggleLock, toggleTheme, clearBoard, copyLink, router],
  );

  /* ---------- keyboard ---------- */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "?") {
        e.preventDefault();
        setShowShortcuts((o) => !o);
        return;
      }
      if (e.shiftKey && e.key === "D") {
        e.preventDefault();
        toggleTheme();
        return;
      }
      if (e.shiftKey) return;

      const key = e.key.toLowerCase();
      if (key === "q") return toggleLock();
      if (key === "c") return setChatOpen((o) => !o);
      const tool = TOOL_KEYS.get(key);
      if (tool) {
        e.preventDefault();
        selectTool(tool);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectTool, toggleLock, toggleTheme]);

  /* ---------- text + image ---------- */
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
      strokeColor,
      strokeWidth: 0,
    };
    game.addShape(shape);
    socket?.send(JSON.stringify({ type: editing ? "update" : "draw", roomId, shape }));
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
        const maxW = 320;
        const ratio = img.width > maxW ? maxW / img.width : 1;
        const width = img.width * ratio;
        const height = img.height * ratio;
        const center = game.toCanvasPoint(window.innerWidth / 2, window.innerHeight / 2);
        const shape: Shape = {
          type: "image",
          id: `shape_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
          x: center.x - width / 2,
          y: center.y - height / 2,
          width,
          height,
          src,
          strokeColor: "transparent",
          strokeWidth: 0,
        };
        preloadImage(src);
        game.addShape(shape);
        socket?.send(JSON.stringify({ type: "draw", roomId, shape }));
        toast.success("Image placed on the board");
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setSelectedTool("selection");
  };

  /* ---------- render ---------- */
  const pill = "glass pointer-events-auto flex h-11 items-center gap-0.5 rounded-2xl px-1.5";
  const pillBtn = "grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className={cn("relative h-screen w-screen select-none overflow-hidden transition-colors duration-500", isDark ? "bg-[#0b0c10]" : "bg-[#fbfaff]")}>
      {!isDark && <div className="pointer-events-none absolute inset-0 z-0 dot-grid opacity-60" />}

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 z-10 block h-full w-full"
        style={{ pointerEvents: locked ? "none" : "auto", touchAction: "none" }}
      />

      <BoardHeader
        roomName={roomName}
        isGuest={isGuest}
        shapeCount={shapes.length}
        connection={connection}
        attempt={attempt}
        theme={theme}
        copied={copied}
        onCommand={runCommand}
        onReconnect={onReconnect}
      />

      {/* Tool dock */}
      <div className="pointer-events-none absolute left-4 top-1/2 z-30 -translate-y-1/2">
        <div className="animate-rise-in">
          <ToolDock active={selectedTool} locked={locked} onSelect={selectTool} onToggleLock={toggleLock} />
        </div>
      </div>

      {/* Style rail — only for tools that leave a mark */}
      {STYLED_TOOLS.has(selectedTool) && !locked && (
        <div className="pointer-events-none absolute right-4 top-1/2 z-30 -translate-y-1/2">
          <StyleRail
            strokeColor={strokeColor}
            fillColor={fillColor}
            strokeWidth={strokeWidth}
            showFill={["rectangle", "circle", "diamond"].includes(selectedTool)}
            onStrokeColor={setStrokeColor}
            onFillColor={setFillColor}
            onStrokeWidth={setStrokeWidth}
          />
        </div>
      )}

      {/* Empty-state welcome */}
      {isEmpty && !locked && !textInput && (
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
          <div className="animate-rise-in text-center">
            <p className="display text-4xl text-foreground/90 sm:text-5xl">Blank page, big ideas.</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Press <kbd className="rounded-md border bg-card px-1.5 py-0.5 font-mono text-[11px]">P</kbd> to sketch,{" "}
              <kbd className="rounded-md border bg-card px-1.5 py-0.5 font-mono text-[11px]">R</kbd> for a box,{" "}
              <kbd className="rounded-md border bg-card px-1.5 py-0.5 font-mono text-[11px]">T</kbd> to type — or{" "}
              <kbd className="rounded-md border bg-card px-1.5 py-0.5 font-mono text-[11px]">⌘K</kbd> for everything.
            </p>
          </div>
        </div>
      )}

      {locked && (
        <div className="pointer-events-none absolute left-1/2 top-20 z-30 -translate-x-1/2">
          <span className="glass inline-flex animate-rise-in items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
            <Lock size={12} /> Canvas locked · press Q to unlock
          </span>
        </div>
      )}

      {/* Text editor */}
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
              if (textInput.editingShape && game) game.cancelEdit(textInput.editingShape);
              setTextInput(null);
            }
          }}
          onBlur={commitText}
          className="absolute z-30 min-w-[160px] resize-none overflow-hidden rounded-md border-2 border-dashed border-primary/60 bg-primary/5 px-1 py-0.5 outline-none"
          style={{
            left: textInput.screenX,
            top: textInput.screenY - 26,
            fontFamily: '"Comic Sans MS", "Comic Sans", Chalkboard SE, Comic Neue, cursive',
            fontSize: "32px",
            lineHeight: "1.2",
            color: strokeColor === "#1e1e1e" ? "hsl(var(--foreground))" : strokeColor,
            minHeight: "40px",
          }}
        />
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      {/* Bottom-left: history + zoom */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-30 flex items-center gap-2">
        <div className={pill}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={() => game?.undo()} disabled={!history.undo} className={pillBtn} aria-label="Undo">
                <Undo2 size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Undo ⌘Z</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={() => game?.redo()} disabled={!history.redo} className={pillBtn} aria-label="Redo">
                <Redo2 size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Redo ⇧⌘Z</TooltipContent>
          </Tooltip>
        </div>
        <div className={pill}>
          <button type="button" onClick={() => game?.zoomBy(1 / 1.2)} className={pillBtn} aria-label="Zoom out">
            <ZoomOut size={16} />
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={() => game?.resetZoom()} className={cn(pillBtn, "w-14 text-xs font-medium tabular-nums text-foreground")}>
                {Math.round(zoom * 100)}%
              </button>
            </TooltipTrigger>
            <TooltipContent>Reset zoom ⌘0</TooltipContent>
          </Tooltip>
          <button type="button" onClick={() => game?.zoomBy(1.2)} className={pillBtn} aria-label="Zoom in">
            <ZoomIn size={16} />
          </button>
          <button type="button" onClick={() => game?.resetZoom()} className={cn(pillBtn, "hidden sm:grid")} aria-label="Fit">
            <Maximize size={15} />
          </button>
        </div>
      </div>

      {/* Bottom-centre: active tool */}
      {activeTool && !locked && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 hidden -translate-x-1/2 md:block">
          <div key={selectedTool} className="glass flex h-9 animate-fade-in items-center gap-2 rounded-full px-3 text-xs">
            <activeTool.icon size={13} className="text-primary" />
            <span className="font-medium">{activeTool.label}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {selectedTool === "selection" && "Click to select, drag to move, double-click text to edit"}
              {selectedTool === "hand" && "Drag to pan around the board"}
              {selectedTool === "pencil" && "Freehand — hold and drag"}
              {selectedTool === "text" && "Click anywhere to start typing"}
              {selectedTool === "image" && "Click the board to place an image"}
              {selectedTool === "eraser" && "Drag over shapes to remove them"}
              {["rectangle", "circle", "diamond", "arrow", "line"].includes(selectedTool) && "Drag to draw · Space + drag to pan"}
            </span>
          </div>
        </div>
      )}

      {/* Bottom-right: chat, palette, help */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-30 flex items-center gap-2">
        <ChatPanel socket={socket} roomId={roomId} currentUserId={user?.id} open={chatOpen} onOpenChange={setChatOpen} />
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={() => setPaletteOpen(true)} className="glass pointer-events-auto grid size-11 place-items-center rounded-2xl text-muted-foreground transition-colors hover:text-foreground" aria-label="Command palette">
              <Command size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Command palette ⌘K</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={() => setShowShortcuts(true)} className="glass pointer-events-auto grid size-11 place-items-center rounded-2xl text-muted-foreground transition-colors hover:text-foreground" aria-label="Keyboard shortcuts">
              <HelpCircle size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Shortcuts ?</TooltipContent>
        </Tooltip>
      </div>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        theme={theme}
        canUndo={history.undo}
        canRedo={history.redo}
        isEmpty={isEmpty}
        isGuest={isGuest}
        onTool={selectTool}
        onCommand={runCommand}
      />
      <ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
    </div>
  );
}
