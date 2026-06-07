"use client";

import { useState, useRef, useEffect, useCallback, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Shape } from "./types";

interface DrawingCanvasProps {
  activeTool: string;
  locked: boolean;
  onShapesChange?: (shapes: Shape[]) => void;
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  onCursorChange?: (cursor: string) => void;
}

interface PanOffset {
  x: number;
  y: number;
}

type DraftShape = Partial<Shape> & {
  type: Shape["type"] | "text-input";
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  pencilPoints?: { x: number; y: number }[];
  text?: string;
};

const STROKE_COLOR = "#1e1e1e";
const FILL_COLOR = "transparent";
const STROKE_WIDTH = 2;
const FONT_SIZE = 20;
const ERASER_HIT_PADDING = 8;

function makeId() {
  return `shape_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function pointInRect(px: number, py: number, x: number, y: number, w: number, h: number, pad = 0) {
  const minX = Math.min(x, x + w) - pad;
  const maxX = Math.max(x, x + w) + pad;
  const minY = Math.min(y, y + h) - pad;
  const maxY = Math.max(y, y + h) + pad;
  return px >= minX && px <= maxX && py >= minY && py <= maxY;
}

function pointInDiamond(px: number, py: number, x: number, y: number, w: number, h: number) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const dx = Math.abs(px - cx) / (Math.abs(w / 2) || 1);
  const dy = Math.abs(py - cy) / (Math.abs(h / 2) || 1);
  return dx + dy <= 1;
}

function pointInEllipse(px: number, py: number, x: number, y: number, w: number, h: number) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rx = Math.abs(w / 2) || 1;
  const ry = Math.abs(h / 2) || 1;
  const dx = (px - cx) / rx;
  const dy = (py - cy) / ry;
  return dx * dx + dy * dy <= 1;
}

function pointNearLine(px: number, py: number, x1: number, y1: number, x2: number, y2: number, pad = 6) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  if (lenSq === 0) return Math.hypot(A, B) <= pad;
  const t = Math.max(0, Math.min(1, dot / lenSq));
  const projX = x1 + t * C;
  const projY = y1 + t * D;
  return Math.hypot(px - projX, py - projY) <= pad;
}

function hitTestShape(shape: Shape, px: number, py: number): boolean {
  switch (shape.type) {
    case "rect":
      return pointInRect(px, py, shape.x, shape.y, shape.width, shape.height, ERASER_HIT_PADDING);
    case "circle": {
      const d = Math.hypot(px - shape.centerX, py - shape.centerY);
      return d <= Math.abs(shape.radius) + ERASER_HIT_PADDING;
    }
    case "diamond":
      return pointInDiamond(px, py, shape.x, shape.y, shape.width, shape.height);
    case "ellipse":
      return pointInEllipse(px, py, shape.x, shape.y, shape.width, shape.height);
    case "arrow":
    case "line": {
      const x2 = shape.x + shape.width;
      const y2 = shape.y + shape.height;
      return pointNearLine(px, py, shape.x, shape.y, x2, y2, ERASER_HIT_PADDING);
    }
    case "pencil":
      if (shape.points && shape.points.length > 1) {
        for (let i = 1; i < shape.points.length; i++) {
          if (pointNearLine(px, py, shape.points[i - 1].x, shape.points[i - 1].y, shape.points[i].x, shape.points[i].y, ERASER_HIT_PADDING)) {
            return true;
          }
        }
      }
      return false;
    case "text": {
      const w = (shape.text?.length || 0) * shape.fontSize * 0.6;
      const h = shape.fontSize * 1.2;
      return pointInRect(px, py, shape.x, shape.y - shape.fontSize, w, h, ERASER_HIT_PADDING);
    }
    case "image":
      return pointInRect(px, py, shape.x, shape.y, shape.width, shape.height, ERASER_HIT_PADDING);
  }
}

function getShapeStartPoint(shape: Shape): { x: number; y: number } {
  if (shape.type === "circle") {
    return { x: shape.centerX, y: shape.centerY };
  }
  if (shape.type === "pencil") {
    return { x: shape.points?.[0]?.x ?? 0, y: shape.points?.[0]?.y ?? 0 };
  }
  if (shape.type === "text" || shape.type === "image" || shape.type === "rect" || shape.type === "diamond" || shape.type === "ellipse" || shape.type === "line" || shape.type === "arrow") {
    return { x: shape.x, y: shape.y };
  }
  return { x: 0, y: 0 };
}

export function DrawingCanvas({ activeTool, locked, shapes, setShapes, onCursorChange }: DrawingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [panOffset, setPanOffset] = useState<PanOffset>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ offset: PanOffset; startX: number; startY: number } | null>(null);
  const [draft, setDraft] = useState<DraftShape | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [textInputValue, setTextInputValue] = useState("");
  const [textInputPos, setTextInputPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    shapeId: string;
    startX: number;
    startY: number;
    shapeStartX: number;
    shapeStartY: number;
  } | null>(null);

  const getCanvasPoint = useCallback(
    (e: ReactPointerEvent | PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: e.clientX - rect.left - panOffset.x,
        y: e.clientY - rect.top - panOffset.y,
      };
    },
    [panOffset]
  );

  const isShapeTool = ["rectangle", "diamond", "circle", "ellipse", "arrow", "line", "pencil"].includes(activeTool);
  const isTextTool = activeTool === "text";
  const isImageTool = activeTool === "image";
  const isSelectionTool = activeTool === "selection";
  const isHandTool = activeTool === "hand";
  const isEraserTool = activeTool === "eraser";

  useEffect(() => {
    let cursor = "default";
    if (locked) cursor = "not-allowed";
    else if (isShapeTool) cursor = "crosshair";
    else if (isTextTool) cursor = "text";
    else if (isHandTool) cursor = isPanning ? "grabbing" : "grab";
    else if (isEraserTool) cursor = "cell";
    onCursorChange?.(cursor);
  }, [activeTool, locked, isShapeTool, isTextTool, isHandTool, isEraserTool, isSelectionTool, isPanning, onCursorChange]);

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !textInputValue) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setShapes((prev) => prev.filter((s) => s.id !== selectedId));
        setSelectedId(null);
      }
      if (e.key === "Escape") {
        setSelectedId(null);
        setDraft(null);
        setTextInputValue("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, textInputValue, setShapes]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (locked) return;
    if (e.button !== 0) return;
    const point = getCanvasPoint(e);
    (e.target as Element).setPointerCapture?.(e.pointerId);

    if (isHandTool) {
      setIsPanning(true);
      panStartRef.current = { offset: panOffset, startX: e.clientX, startY: e.clientY };
      return;
    }

    if (isShapeTool) {
      const draftShape: DraftShape = {
        type: activeTool === "rectangle" ? "rect" : (activeTool as Shape["type"]),
        startX: point.x,
        startY: point.y,
        currentX: point.x,
        currentY: point.y,
      };
      if (activeTool === "pencil") {
        draftShape.pencilPoints = [{ x: point.x, y: point.y }];
      }
      setDraft(draftShape);
      return;
    }

    if (isTextTool) {
      setTextInputPos({ x: point.x, y: point.y });
      setTextInputValue("");
      return;
    }

    if (isEraserTool) {
      const hit = shapes.find((s) => s.id && hitTestShape(s, point.x, point.y));
      if (hit && hit.id) {
        setShapes((prev) => prev.filter((s) => s.id !== hit.id));
        if (selectedId === hit.id) setSelectedId(null);
      }
      return;
    }

    if (isSelectionTool) {
      const hit = [...shapes].reverse().find((s) => s.id && hitTestShape(s, point.x, point.y));
      if (hit && hit.id) {
        setSelectedId(hit.id);
        const start = getShapeStartPoint(hit);
        dragRef.current = {
          shapeId: hit.id,
          startX: point.x,
          startY: point.y,
          shapeStartX: start.x,
          shapeStartY: start.y,
        };
      } else {
        setSelectedId(null);
      }
      return;
    }
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (locked) return;
    const point = getCanvasPoint(e);

    if (isHandTool && isPanning && panStartRef.current) {
      const dx = e.clientX - panStartRef.current.startX;
      const dy = e.clientY - panStartRef.current.startY;
      setPanOffset({
        x: panStartRef.current.offset.x + dx,
        y: panStartRef.current.offset.y + dy,
      });
      return;
    }

    if (draft && isShapeTool) {
      setDraft((prev) =>
        prev
          ? {
              ...prev,
              currentX: point.x,
              currentY: point.y,
              pencilPoints: prev.type === "pencil" && prev.pencilPoints
                ? [...prev.pencilPoints, { x: point.x, y: point.y }]
                : prev.pencilPoints,
            }
          : prev
      );
      return;
    }

    if (isSelectionTool && dragRef.current) {
      const dx = point.x - dragRef.current.startX;
      const dy = point.y - dragRef.current.startY;
      const id = dragRef.current.shapeId;
      setShapes((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          if (s.type === "circle") {
            return { ...s, centerX: dragRef.current!.shapeStartX + dx, centerY: dragRef.current!.shapeStartY + dy };
          }
          if (s.type === "pencil") {
            const newPoints = s.points?.map(p => ({ x: p.x + dx, y: p.y + dy })) || [];
            return { ...s, points: newPoints };
          }
          return { ...s, x: dragRef.current!.shapeStartX + dx, y: dragRef.current!.shapeStartY + dy };
        })
      );
    }
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (locked) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);

    if (isHandTool) {
      setIsPanning(false);
      panStartRef.current = null;
      return;
    }

    if (draft && isShapeTool) {
      const x = Math.min(draft.startX, draft.currentX);
      const y = Math.min(draft.startY, draft.currentY);
      const width = Math.abs(draft.currentX - draft.startX);
      const height = Math.abs(draft.currentY - draft.startY);

      if (width > 3 || height > 3) {
        const id = makeId();
        const baseProps = {
          id,
          x,
          y,
          width,
          height,
          strokeColor: STROKE_COLOR,
          strokeWidth: STROKE_WIDTH,
          fillColor: FILL_COLOR,
        };
        let newShape: Shape;
        switch (activeTool) {
          case "rectangle":
            newShape = { ...baseProps, type: "rect" };
            break;
          case "diamond":
            newShape = { ...baseProps, type: "diamond" };
            break;
          case "circle": {
            const cx = x + width / 2;
            const cy = y + height / 2;
            const radius = Math.max(width, height) / 2;
            newShape = {
              id,
              type: "circle",
              centerX: cx,
              centerY: cy,
              radius,
              strokeColor: STROKE_COLOR,
              strokeWidth: STROKE_WIDTH,
              fillColor: FILL_COLOR,
            };
            break;
          }
          case "ellipse":
            newShape = { ...baseProps, type: "ellipse" };
            break;
          case "arrow":
            newShape = { ...baseProps, type: "arrow" };
            break;
          case "line":
            newShape = { ...baseProps, type: "line" };
            break;
          case "pencil":
            newShape = {
              id,
              type: "pencil",
              points: draft.pencilPoints || [],
              strokeColor: STROKE_COLOR,
              strokeWidth: STROKE_WIDTH,
            };
            break;
          default:
            newShape = { ...baseProps, type: "rect" };
        }
        setShapes((prev) => [...prev, newShape]);
      }
      setDraft(null);
    }

    if (isSelectionTool) {
      dragRef.current = null;
    }
  };

  const commitText = () => {
    if (textInputValue.trim()) {
      const newShape: Shape = {
        id: makeId(),
        type: "text",
        x: textInputPos.x,
        y: textInputPos.y,
        text: textInputValue,
        fontSize: FONT_SIZE,
        strokeColor: STROKE_COLOR,
        strokeWidth: 0,
        fillColor: "transparent",
      };
      setShapes((prev) => [...prev, newShape]);
    }
    setTextInputValue("");
  };

  const handleTextKeyDown = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setTextInputValue("");
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commitText();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const maxW = 300;
        const ratio = img.width > maxW ? maxW / img.width : 1;
        const w = img.width * ratio;
        const h = img.height * ratio;
        const cx = (containerRef.current?.clientWidth || 0) / 2 - panOffset.x;
        const cy = (containerRef.current?.clientHeight || 0) / 2 - panOffset.y;
        const newShape: Shape = {
          id: makeId(),
          type: "image",
          x: cx - w / 2,
          y: cy - h / 2,
          width: w,
          height: h,
          src,
          strokeColor: "transparent",
          strokeWidth: 0,
        };
        setShapes((prev) => [...prev, newShape]);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  useEffect(() => {
    if (isImageTool && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isImageTool]);

  const renderShape = (shape: Shape, isDraft = false) => {
    const isSelected = !isDraft && selectedId === shape.id;
    const stroke = shape.strokeColor || STROKE_COLOR;
    const sw = shape.strokeWidth || STROKE_WIDTH;
    const fill = shape.fillColor || FILL_COLOR;
    const selectedStroke = "#3b82f6";
    const selectionColor = isSelected ? selectedStroke : stroke;
    const dashArray = isSelected ? "4 3" : undefined;

    switch (shape.type) {
      case "rect": {
        const x = Math.min(shape.x, shape.x + shape.width);
        const y = Math.min(shape.y, shape.y + shape.height);
        return (
          <rect
            key={shape.id}
            x={x}
            y={y}
            width={Math.abs(shape.width)}
            height={Math.abs(shape.height)}
            stroke={selectionColor}
            strokeWidth={sw}
            fill={fill}
            strokeDasharray={dashArray}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pointerEvents: isDraft ? "none" : "auto" }}
          />
        );
      }
      case "circle": {
        return (
          <circle
            key={shape.id}
            cx={shape.centerX}
            cy={shape.centerY}
            r={Math.abs(shape.radius)}
            stroke={selectionColor}
            strokeWidth={sw}
            fill={fill}
            strokeDasharray={dashArray}
            style={{ pointerEvents: isDraft ? "none" : "auto" }}
          />
        );
      }
      case "diamond": {
        const x = Math.min(shape.x, shape.x + shape.width);
        const y = Math.min(shape.y, shape.y + shape.height);
        const w = Math.abs(shape.width);
        const h = Math.abs(shape.height);
        const cx = x + w / 2;
        const cy = y + h / 2;
        const points = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
        return (
          <polygon
            key={shape.id}
            points={points}
            stroke={selectionColor}
            strokeWidth={sw}
            fill={fill}
            strokeDasharray={dashArray}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pointerEvents: isDraft ? "none" : "auto" }}
          />
        );
      }
      case "ellipse": {
        const x = Math.min(shape.x, shape.x + shape.width);
        const y = Math.min(shape.y, shape.y + shape.height);
        const w = Math.abs(shape.width);
        const h = Math.abs(shape.height);
        return (
          <ellipse
            key={shape.id}
            cx={x + w / 2}
            cy={y + h / 2}
            rx={w / 2}
            ry={h / 2}
            stroke={selectionColor}
            strokeWidth={sw}
            fill={fill}
            strokeDasharray={dashArray}
            style={{ pointerEvents: isDraft ? "none" : "auto" }}
          />
        );
      }
      case "line": {
        return (
          <line
            key={shape.id}
            x1={shape.x}
            y1={shape.y}
            x2={shape.x + shape.width}
            y2={shape.y + shape.height}
            stroke={selectionColor}
            strokeWidth={sw}
            strokeDasharray={dashArray}
            strokeLinecap="round"
            style={{ pointerEvents: isDraft ? "none" : "auto" }}
          />
        );
      }
      case "arrow": {
        const x1 = shape.x;
        const y1 = shape.y;
        const x2 = shape.x + shape.width;
        const y2 = shape.y + shape.height;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLen = 14;
        const a1x = x2 - headLen * Math.cos(angle - Math.PI / 6);
        const a1y = y2 - headLen * Math.sin(angle - Math.PI / 6);
        const a2x = x2 - headLen * Math.cos(angle + Math.PI / 6);
        const a2y = y2 - headLen * Math.sin(angle + Math.PI / 6);
        return (
          <g key={shape.id} style={{ pointerEvents: isDraft ? "none" : "auto" }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={selectionColor} strokeWidth={sw} strokeLinecap="round" strokeDasharray={dashArray} />
            <polygon
              points={`${x2},${y2} ${a1x},${a1y} ${a2x},${a2y}`}
              fill={selectionColor}
              stroke={selectionColor}
              strokeWidth={1}
              strokeLinejoin="round"
            />
          </g>
        );
      }
      case "pencil": {
        const points = shape.points || [];
        if (points.length < 2) return null;
        const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
        return (
          <path
            key={shape.id}
            d={pathData}
            stroke={selectionColor}
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={dashArray}
            style={{ pointerEvents: isDraft ? "none" : "auto" }}
          />
        );
      }
      case "text":
        return (
          <text
            key={shape.id}
            x={shape.x}
            y={shape.y}
            fontSize={shape.fontSize}
            fontFamily="Virgil, Segoe UI Emoji, sans-serif"
            fill={selectionColor}
            strokeDasharray={dashArray}
            style={{ pointerEvents: isDraft ? "none" : "auto", userSelect: "none" }}
          >
            {shape.text}
          </text>
        );
      case "image":
        return (
          <g key={shape.id} style={{ pointerEvents: isDraft ? "none" : "auto" }}>
            <image
              href={shape.src}
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              preserveAspectRatio="xMidYMid meet"
            />
            {isSelected && (
              <rect
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill="none"
                stroke={selectedStroke}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                pointerEvents="none"
              />
            )}
          </g>
        );
    }
  };

  const renderDraft = () => {
    if (!draft) return null;
    const x = Math.min(draft.startX, draft.currentX);
    const y = Math.min(draft.startY, draft.currentY);
    const width = Math.abs(draft.currentX - draft.startX);
    const height = Math.abs(draft.currentY - draft.startY);
    const stroke = STROKE_COLOR;
    const sw = STROKE_WIDTH;
    const fill = FILL_COLOR;

    switch (activeTool) {
      case "rectangle":
        return <rect x={x} y={y} width={width} height={height} stroke={stroke} strokeWidth={sw} fill={fill} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />;
      case "diamond": {
        const cx = x + width / 2;
        const cy = y + height / 2;
        return <polygon points={`${cx},${y} ${x + width},${cy} ${cx},${y + height} ${x},${cy}`} stroke={stroke} strokeWidth={sw} fill={fill} pointerEvents="none" />;
      }
      case "circle": {
        const cx = x + width / 2;
        const cy = y + height / 2;
        const radius = Math.max(width, height) / 2;
        return <circle cx={cx} cy={cy} r={radius} stroke={stroke} strokeWidth={sw} fill={fill} pointerEvents="none" />;
      }
      case "ellipse":
        return <ellipse cx={x + width / 2} cy={y + height / 2} rx={width / 2} ry={height / 2} stroke={stroke} strokeWidth={sw} fill={fill} pointerEvents="none" />;
      case "line":
        return <line x1={draft.startX} y1={draft.startY} x2={draft.currentX} y2={draft.currentY} stroke={stroke} strokeWidth={sw} strokeLinecap="round" pointerEvents="none" />;
      case "arrow": {
        const x1 = draft.startX;
        const y1 = draft.startY;
        const x2 = draft.currentX;
        const y2 = draft.currentY;
        const ang = Math.atan2(y2 - y1, x2 - x1);
        const headLen = 14;
        return (
          <g pointerEvents="none">
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
            <polygon
              points={`${x2},${y2} ${x2 - headLen * Math.cos(ang - Math.PI / 6)},${y2 - headLen * Math.sin(ang - Math.PI / 6)} ${x2 - headLen * Math.cos(ang + Math.PI / 6)},${y2 - headLen * Math.sin(ang + Math.PI / 6)}`}
              fill={stroke}
            />
          </g>
        );
      }
      case "pencil": {
        const points = draft.pencilPoints || [];
        if (points.length < 2) return null;
        const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
        return <path d={pathData} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />;
      }
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="absolute inset-0 touch-none select-none"
      style={{
        cursor: locked
          ? "not-allowed"
          : isHandTool
          ? isPanning
            ? "grabbing"
            : "grab"
          : isShapeTool
          ? "crosshair"
          : isTextTool
          ? "text"
          : isEraserTool
          ? "cell"
          : "default",
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}
      >
        {shapes.map((s) => renderShape(s))}
        {renderDraft()}
      </svg>

      {isTextTool && (
        <textarea
          autoFocus
          value={textInputValue}
          onChange={(e) => setTextInputValue(e.target.value)}
          onKeyDown={handleTextKeyDown}
          onBlur={commitText}
          placeholder="Type something..."
          className="absolute z-10 min-w-[120px] resize-none border-none bg-transparent p-0 text-[20px] leading-tight outline-none placeholder:text-gray-300"
          style={{
            left: textInputPos.x + panOffset.x,
            top: textInputPos.y + panOffset.y - 22,
            fontFamily: "Virgil, Segoe UI Emoji, sans-serif",
            color: STROKE_COLOR,
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
    </div>
  );
}
