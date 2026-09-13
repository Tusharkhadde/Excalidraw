import {
  ArrowRight,
  Circle,
  Diamond,
  Eraser,
  Hand,
  ImagePlus,
  Minus,
  MousePointer2,
  Pencil,
  Square,
  Type,
} from "lucide-react";
import type { ToolConfig } from "./types";

/** Tool dock order. Keys are single-letter shortcuts (no modifiers). */
export const TOOLS: ToolConfig[] = [
  { id: "selection", icon: MousePointer2, label: "Select", key: "V" },
  { id: "hand", icon: Hand, label: "Hand", key: "H" },
  { id: "pencil", icon: Pencil, label: "Pencil", key: "P" },
  { id: "rectangle", icon: Square, label: "Rectangle", key: "R" },
  { id: "circle", icon: Circle, label: "Ellipse", key: "O" },
  { id: "diamond", icon: Diamond, label: "Diamond", key: "D" },
  { id: "arrow", icon: ArrowRight, label: "Arrow", key: "A" },
  { id: "line", icon: Minus, label: "Line", key: "L" },
  { id: "text", icon: Type, label: "Text", key: "T" },
  { id: "image", icon: ImagePlus, label: "Image", key: "I" },
  { id: "eraser", icon: Eraser, label: "Eraser", key: "E" },
];

/** Tools that leave a mark and therefore use the style rail. */
export const STYLED_TOOLS = new Set(["pencil", "rectangle", "circle", "diamond", "arrow", "line", "text"]);

export const SWATCHES = [
  { name: "Ink", value: "#1e1e1e" },
  { name: "Violet", value: "#6c50d9" },
  { name: "Blue", value: "#2563eb" },
  { name: "Teal", value: "#0d9488" },
  { name: "Green", value: "#16a34a" },
  { name: "Amber", value: "#d97706" },
  { name: "Red", value: "#dc2626" },
  { name: "Pink", value: "#db2777" },
];

export const FILLS = [
  { name: "None", value: "transparent" },
  { name: "Lavender", value: "#ece6fb" },
  { name: "Sky", value: "#dbeafe" },
  { name: "Mint", value: "#dcfce7" },
  { name: "Butter", value: "#fef3c7" },
  { name: "Blush", value: "#fce7f3" },
];

export const STROKE_WIDTHS = [
  { name: "Thin", value: 1.5 },
  { name: "Regular", value: 2.5 },
  { name: "Bold", value: 4.5 },
];
