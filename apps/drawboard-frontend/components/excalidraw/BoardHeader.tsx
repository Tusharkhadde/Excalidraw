"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Command,
  Download,
  FileImage,
  FileCode2,
  HelpCircle,
  Keyboard,
  Link2,
  Moon,
  MoreHorizontal,
  Sun,
  Trash2,
  UserPlus,
  Wifi,
  WifiOff,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { BoardCommand, BoardTheme, Connection } from "./types";

interface BoardHeaderProps {
  roomName?: string | null;
  isGuest: boolean;
  shapeCount: number;
  connection: Connection;
  attempt: number;
  theme: BoardTheme;
  copied: boolean;
  onCommand: (cmd: BoardCommand) => void;
  onReconnect?: () => void;
}

const connectionMeta: Record<Connection, { label: string; dot: string; icon: typeof Wifi }> = {
  open: { label: "Live", dot: "bg-emerald-500", icon: Wifi },
  connecting: { label: "Connecting", dot: "bg-amber-500 animate-pulse", icon: Wifi },
  reconnecting: { label: "Reconnecting", dot: "bg-amber-500 animate-pulse", icon: WifiOff },
  offline: { label: "Offline", dot: "bg-destructive", icon: WifiOff },
};

export function BoardHeader({ roomName, isGuest, shapeCount, connection, attempt, theme, copied, onCommand, onReconnect }: BoardHeaderProps) {
  const meta = connectionMeta[connection];
  const StatusIcon = meta.icon;
  const isEmpty = shapeCount === 0;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4">
      {/* Left: menu */}
      <div className="pointer-events-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group glass grid size-11 place-items-center rounded-2xl transition-transform hover:scale-105 active:scale-95" aria-label="Board menu">
              <span className="relative grid size-8 -rotate-6 place-items-center overflow-hidden rounded-lg shadow-glow transition-transform duration-300 group-hover:rotate-0">
                <Image src="/drawboard-mark.png" alt="" width={32} height={32} className="size-full object-cover" />
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel className="flex items-center justify-between font-normal">
              <span className="truncate text-sm font-medium">{roomName ?? (isGuest ? "Guest sketch" : "Untitled board")}</span>
              <Badge variant="secondary" className="ml-2 tabular-nums">
                {shapeCount}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <ArrowLeft /> Back to workspace
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onCommand("palette")}>
              <Command /> Command palette <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isEmpty} onSelect={() => onCommand("export-png")}>
              <FileImage /> Export PNG
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isEmpty} onSelect={() => onCommand("export-svg")}>
              <FileCode2 /> Export SVG
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onCommand("toggle-theme")}>
              {theme === "dark" ? <Sun /> : <Moon />} {theme === "dark" ? "Light theme" : "Dark theme"}
              <DropdownMenuShortcut>⇧D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onCommand("shortcuts")}>
              <Keyboard /> Keyboard shortcuts <DropdownMenuShortcut>?</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/about">
                <HelpCircle /> About Drawboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isEmpty} onSelect={() => onCommand("clear")} className="text-destructive focus:text-destructive">
              <Trash2 /> Clear board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Centre: room pill */}
      <div className="pointer-events-auto glass hidden h-11 items-center gap-3 rounded-2xl px-4 sm:flex">
        <span className="flex items-center gap-2 text-sm">
          <span className={cn("size-2 rounded-full", meta.dot)} />
          <span className="max-w-[200px] truncate font-medium">{roomName ?? (isGuest ? "Guest sketch" : "Untitled board")}</span>
        </span>
        <span className="h-4 w-px bg-border" />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={connection === "offline" ? onReconnect : undefined}
              className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", connection === "offline" && "hover:text-foreground")}
            >
              <StatusIcon size={13} />
              {meta.label}
              {connection === "reconnecting" && attempt > 0 && <span className="tabular-nums">· {attempt}</span>}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {connection === "open" && "Changes sync to everyone in the room"}
            {connection === "connecting" && "Opening the live session…"}
            {connection === "reconnecting" && "Trying to reconnect — your drawing is safe"}
            {connection === "offline" && "Click to retry. Drawings stay on this device."}
          </TooltipContent>
        </Tooltip>
        <span className="h-4 w-px bg-border" />
        <span className="text-xs tabular-nums text-muted-foreground">{shapeCount} {shapeCount === 1 ? "shape" : "shapes"}</span>
      </div>

      {/* Right: actions */}
      <div className="pointer-events-auto flex items-center gap-2">
        {isGuest ? (
          <Button asChild size="sm" className="h-11 rounded-2xl px-4 shadow-glow">
            <Link href="/signin" prefetch={false}>
              <UserPlus /> Save your work
            </Link>
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => onCommand("copy-link")} size="sm" className={cn("h-11 rounded-2xl px-4 transition-all", copied && "bg-emerald-600 hover:bg-emerald-600")}>
                {copied ? <Check className="animate-check-pop" /> : <Link2 />}
                {copied ? "Copied" : "Share"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy invite link</TooltipContent>
          </Tooltip>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="glass grid size-11 place-items-center rounded-2xl text-muted-foreground transition-colors hover:text-foreground" aria-label="More actions">
              <MoreHorizontal size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem disabled={isEmpty} onSelect={() => onCommand("export-png")}>
              <Download /> Export PNG
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isEmpty} onSelect={() => onCommand("export-svg")}>
              <Download /> Export SVG
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onCommand("toggle-theme")}>
              {theme === "dark" ? <Sun /> : <Moon />} {theme === "dark" ? "Light theme" : "Dark theme"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isEmpty} onSelect={() => onCommand("clear")} className="text-destructive focus:text-destructive">
              <Trash2 /> Clear board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
