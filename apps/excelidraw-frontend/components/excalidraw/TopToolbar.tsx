"use client";

import { useState } from "react";
import {
  Lock,
  Hand,
  MousePointer2,
  RectangleHorizontal,
  Diamond,
  Circle,
  ArrowRight,
  Minus,
  Pencil,
  Type,
  Image,
  Eraser,
  MoreHorizontal,
} from "lucide-react";
import { ToolButton } from "./ToolButton";
import type { ToolConfig } from "./types";

const tools: ToolConfig[] = [
  { id: "lock", icon: Lock, label: "Lock" },
  { id: "hand", icon: Hand, label: "Hand", shortcut: "H" },
  { id: "selection", icon: MousePointer2, label: "Selection", shortcut: "1" },
  { id: "rectangle", icon: RectangleHorizontal, label: "Rectangle", shortcut: "2" },
  { id: "diamond", icon: Diamond, label: "Diamond", shortcut: "3" },
  { id: "ellipse", icon: Circle, label: "Ellipse", shortcut: "4" },
  { id: "arrow", icon: ArrowRight, label: "Arrow", shortcut: "5" },
  { id: "line", icon: Minus, label: "Line", shortcut: "6" },
  { id: "pencil", icon: Pencil, label: "Pencil", shortcut: "7" },
  { id: "text", icon: Type, label: "Text", shortcut: "8" },
  { id: "image", icon: Image, label: "Image" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
  { id: "more", icon: MoreHorizontal, label: "More" },
];

interface TopToolbarProps {
  activeTool?: string;
  onToolChange?: (toolId: string) => void;
}

export function TopToolbar({ activeTool = "selection", onToolChange }: TopToolbarProps) {
  const [internalActive, setInternalActive] = useState(activeTool);

  const handleClick = (toolId: string) => {
    setInternalActive(toolId);
    onToolChange?.(toolId);
  };

  const currentActive = onToolChange ? activeTool : internalActive;

  return (
    <div className="inline-flex items-center gap-0.5 rounded-[10px] border border-gray-200 bg-white px-2 py-1.5 shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06)]">
      {tools.map((tool, i) => (
        <ToolButton
          key={tool.id}
          icon={tool.icon}
          label={tool.label}
          shortcut={tool.shortcut}
          active={currentActive === tool.id}
          onClick={() => handleClick(tool.id)}
        />
      ))}
    </div>
  );
}
