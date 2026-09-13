import { type LucideIcon } from "lucide-react";
import type { Shape as CommonShape } from "@repo/common/types";

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

export interface ToolConfig {
  id: Tool;
  icon: LucideIcon;
  label: string;
  /** Single-key shortcut shown in tooltips and the command palette. */
  key: string;
}

export type Shape = CommonShape;

/** Websocket session state, surfaced in the board chrome. */
export type Connection = "connecting" | "open" | "reconnecting" | "offline";

export type BoardTheme = "light" | "dark";

/** Everything the chrome can ask the board to do. One channel keeps shortcuts, menus and ⌘K in sync. */
export type BoardCommand =
  | "undo"
  | "redo"
  | "zoom-in"
  | "zoom-out"
  | "zoom-reset"
  | "toggle-theme"
  | "toggle-lock"
  | "clear"
  | "export-png"
  | "export-svg"
  | "copy-link"
  | "shortcuts"
  | "palette"
  | "chat"
  | "home";
