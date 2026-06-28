import { type LucideIcon } from "lucide-react";
import type { Shape as CommonShape } from "@repo/common/types";

export interface ToolConfig {
  id: string;
  icon: LucideIcon;
  label: string;
  shortcut?: string;
}

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  rightLabel?: string;
  divider?: boolean;
  submenu?: boolean;
}

export type Shape = CommonShape;
