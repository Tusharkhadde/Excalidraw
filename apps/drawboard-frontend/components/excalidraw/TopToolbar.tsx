"use client";

import { useState } from "react";
import {
  ArrowRight,
  Circle,
  Diamond,
  Eraser,
  Hand,
  Image as ImageIcon,
  Lock,
  Minus,
  MousePointer2,
  Pencil,
  RectangleHorizontal,
  Type,
} from "lucide-react";
import { ToolButton } from "./ToolButton";
import type { ToolConfig } from "./types";

const baseTools: ToolConfig[] = [
  { id: "lock", icon: Lock, label: "Lock" },
  { id: "hand", icon: Hand, label: "Hand" },
  { id: "selection", icon: MousePointer2, label: "Select" },
  { id: "rectangle", icon: RectangleHorizontal, label: "Rectangle" },
  { id: "diamond", icon: Diamond, label: "Diamond" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "arrow", icon: ArrowRight, label: "Arrow" },
  { id: "line", icon: Minus, label: "Line" },
  { id: "pencil", icon: Pencil, label: "Pencil" },
  { id: "text", icon: Type, label: "Text" },
  { id: "image", icon: ImageIcon, label: "Image" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
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
    <div className="inline-flex items-center rounded-[18px] border border-[#e8e6f2] bg-white/95 px-2 py-1.5 shadow-[0_12px_28px_-22px_rgba(16,24,40,0.5),0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur">
      {baseTools.map((tool, index) => {
        const showDivider = index === 1 || index === 10;

        return (
          <div key={tool.id} className="flex items-center">
            {showDivider && <div className="mx-1 h-10 w-px bg-[#eceaf4]" />}
            <ToolButton
              icon={tool.icon}
              label={tool.label}
              order={String((index + 1) % 10)}
              active={currentActive === tool.id}
              onClick={() => handleClick(tool.id)}
            />
          </div>
        );
      })}
    </div>
  );
}
