"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TOOLS } from "./tools";

const groups: { title: string; rows: [string, string[]][] }[] = [
  {
    title: "Tools",
    rows: TOOLS.map((t) => [t.label, [t.key]] as [string, string[]]).concat([["Lock canvas", ["Q"]]]),
  },
  {
    title: "Editing",
    rows: [
      ["Undo", ["⌘", "Z"]],
      ["Redo", ["⇧", "⌘", "Z"]],
      ["Delete selected", ["⌫"]],
      ["Deselect / cancel", ["Esc"]],
      ["Edit text", ["Double-click"]],
    ],
  },
  {
    title: "View",
    rows: [
      ["Zoom in / out", ["⌘", "+ / −"]],
      ["Reset zoom", ["⌘", "0"]],
      ["Pan", ["Space", "Drag"]],
      ["Pan", ["Scroll wheel", "Drag"]],
      ["Toggle theme", ["⇧", "D"]],
    ],
  },
  {
    title: "Board",
    rows: [
      ["Command palette", ["⌘", "K"]],
      ["Toggle chat", ["C"]],
      ["This window", ["?"]],
    ],
  },
];

export function ShortcutsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>Everything on the board is one key away.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-2">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{g.title}</p>
              <ul className="divide-y rounded-xl border">
                {g.rows.map(([label, keys], i) => (
                  <li key={`${label}-${i}`} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="flex items-center gap-1">
                      {keys.map((k, j) => (
                        <kbd key={j} className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">?</kbd> anytime to toggle this window.
        </p>
      </DialogContent>
    </Dialog>
  );
}
