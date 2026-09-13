"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Download, Keyboard, Link2, MessageCircle, Moon, Redo2, Search, Sun, Trash2, Undo2, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TOOLS } from "./tools";
import type { BoardCommand, BoardTheme, Tool } from "./types";

interface Entry {
  id: string;
  label: string;
  hint?: string;
  group: "Tools" | "Actions" | "View" | "Navigate";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  run: () => void;
  disabled?: boolean;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: BoardTheme;
  canUndo: boolean;
  canRedo: boolean;
  isEmpty: boolean;
  isGuest: boolean;
  onTool: (tool: Tool) => void;
  onCommand: (cmd: BoardCommand) => void;
}

/** ⌘K palette — every tool and board action, searchable. No extra deps. */
export function CommandPalette({ open, onOpenChange, theme, canUndo, canRedo, isEmpty, isGuest, onTool, onCommand }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const entries = useMemo<Entry[]>(() => {
    const tools: Entry[] = TOOLS.map((t) => ({ id: `tool-${t.id}`, label: t.label, hint: t.key, group: "Tools", icon: t.icon, run: () => onTool(t.id) }));
    const actions: Entry[] = [
      { id: "undo", label: "Undo", hint: "⌘Z", group: "Actions", icon: Undo2, run: () => onCommand("undo"), disabled: !canUndo },
      { id: "redo", label: "Redo", hint: "⇧⌘Z", group: "Actions", icon: Redo2, run: () => onCommand("redo"), disabled: !canRedo },
      { id: "export-png", label: "Export as PNG", group: "Actions", icon: Download, run: () => onCommand("export-png"), disabled: isEmpty },
      { id: "export-svg", label: "Export as SVG", group: "Actions", icon: Download, run: () => onCommand("export-svg"), disabled: isEmpty },
      ...(!isGuest ? [{ id: "copy-link", label: "Copy invite link", group: "Actions" as const, icon: Link2, run: () => onCommand("copy-link") }] : []),
      { id: "chat", label: "Toggle chat", hint: "C", group: "Actions", icon: MessageCircle, run: () => onCommand("chat") },
      { id: "clear", label: "Clear board", group: "Actions", icon: Trash2, run: () => onCommand("clear"), disabled: isEmpty },
    ];
    const view: Entry[] = [
      { id: "zoom-in", label: "Zoom in", hint: "⌘+", group: "View", icon: ZoomIn, run: () => onCommand("zoom-in") },
      { id: "zoom-out", label: "Zoom out", hint: "⌘−", group: "View", icon: ZoomOut, run: () => onCommand("zoom-out") },
      { id: "zoom-reset", label: "Reset zoom", hint: "⌘0", group: "View", icon: Maximize, run: () => onCommand("zoom-reset") },
      { id: "theme", label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme", hint: "⇧D", group: "View", icon: theme === "dark" ? Sun : Moon, run: () => onCommand("toggle-theme") },
      { id: "shortcuts", label: "Keyboard shortcuts", hint: "?", group: "View", icon: Keyboard, run: () => onCommand("shortcuts") },
    ];
    const nav: Entry[] = [{ id: "home", label: "Back to workspace", group: "Navigate", icon: ArrowLeft, run: () => onCommand("home") }];
    return [...tools, ...actions, ...view, ...nav];
  }, [theme, canUndo, canRedo, isEmpty, isGuest, onTool, onCommand]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.label.toLowerCase().includes(q) || e.group.toLowerCase().includes(q));
  }, [entries, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const pick = (entry: Entry) => {
    if (entry.disabled) return;
    onOpenChange(false);
    entry.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = filtered[cursor];
      if (entry) pick(entry);
    }
  };

  let lastGroup: string | null = null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="top-[18%] max-w-[560px] translate-y-0 gap-0 overflow-hidden p-0" onKeyDown={onKeyDown}>
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or tool…"
            className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/70"
          />
          <kbd className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">esc</kbd>
        </div>
        <div ref={listRef} className="nice-scroll max-h-[360px] overflow-y-auto p-2">
          {filtered.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted-foreground">Nothing matches “{query}”.</p>}
          {filtered.map((entry, i) => {
            const showGroup = entry.group !== lastGroup;
            lastGroup = entry.group;
            const Icon = entry.icon;
            return (
              <div key={entry.id}>
                {showGroup && <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground first:pt-1">{entry.group}</p>}
                <button
                  type="button"
                  data-index={i}
                  disabled={entry.disabled}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => pick(entry)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors disabled:opacity-40",
                    i === cursor && !entry.disabled && "bg-accent text-accent-foreground",
                  )}
                >
                  <Icon size={16} className="text-muted-foreground" />
                  <span className="flex-1">{entry.label}</span>
                  {entry.hint && <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{entry.hint}</kbd>}
                </button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
