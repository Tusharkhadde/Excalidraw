"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Share2, MoreHorizontal, Download, Trash2, Image as ImageIcon } from "lucide-react";
import type { Shape } from "./types";

interface TopRightActionsProps {
  shapes: Shape[];
  onClear?: () => void;
}

function exportToSvg(shapes: Shape[]): string {
  const w = 1200;
  const h = 800;
  const shapeMarkup = shapes
    .map((s) => {
      if (s.type === "rect") {
        return `<rect x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" stroke="${s.strokeColor || "#1e1e1e"}" stroke-width="${s.strokeWidth || 2}" fill="none" />`;
      }
      if (s.type === "circle") {
        return `<circle cx="${s.centerX}" cy="${s.centerY}" r="${Math.abs(s.radius)}" stroke="${s.strokeColor || "#1e1e1e"}" stroke-width="${s.strokeWidth || 2}" fill="none" />`;
      }
      if (s.type === "diamond") {
        const cx = s.x + s.width / 2;
        const cy = s.y + s.height / 2;
        return `<polygon points="${cx},${s.y} ${s.x + s.width},${cy} ${cx},${s.y + s.height} ${s.x},${cy}" stroke="${s.strokeColor || "#1e1e1e"}" stroke-width="${s.strokeWidth || 2}" fill="none" />`;
      }
      if (s.type === "ellipse") {
        return `<ellipse cx="${s.x + s.width / 2}" cy="${s.y + s.height / 2}" rx="${Math.abs(s.width / 2)}" ry="${Math.abs(s.height / 2)}" stroke="${s.strokeColor || "#1e1e1e"}" stroke-width="${s.strokeWidth || 2}" fill="none" />`;
      }
      if (s.type === "line" || s.type === "arrow") {
        return `<line x1="${s.x}" y1="${s.y}" x2="${s.x + s.width}" y2="${s.y + s.height}" stroke="${s.strokeColor || "#1e1e1e"}" stroke-width="${s.strokeWidth || 2}" />`;
      }
      if (s.type === "pencil") {
        return `<line x1="${s.startX}" y1="${s.startY}" x2="${s.endX}" y2="${s.endY}" stroke="${s.strokeColor || "#1e1e1e"}" stroke-width="${s.strokeWidth || 2}" />`;
      }
      if (s.type === "text") {
        return `<text x="${s.x}" y="${s.y}" font-size="${s.fontSize}" fill="${s.strokeColor || "#1e1e1e"}">${s.text}</text>`;
      }
      return "";
    })
    .join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${shapeMarkup}</svg>`;
}

export function TopRightActions({ shapes, onClear }: TopRightActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleExport = () => {
    const svg = exportToSvg(shapes);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "excalidraw-export.svg";
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  const handleExportPng = () => {
    const svgString = exportToSvg(shapes);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "excalidraw-export.png";
        a.click();
        URL.revokeObjectURL(pngUrl);
      });
      URL.revokeObjectURL(url);
    };
    img.src = url;
    setMenuOpen(false);
  };

  const handleShare = async () => {
    const json = JSON.stringify({ shapes });
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(json);
        alert("Canvas data copied to clipboard");
      } else {
        alert("Clipboard not available");
      }
    } catch {
      alert("Share failed");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-all hover:bg-gray-50 hover:shadow-sm">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <span>Excalidraw+</span>
      </button>

      <button
        onClick={handleShare}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        title="Share"
      >
        <Share2 className="h-4 w-4" />
      </button>

      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          title="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[180px] rounded-[10px] border border-gray-200 bg-white py-1 shadow-lg"
          >
            <button
              onClick={handleExportPng}
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
            >
              <ImageIcon className="h-4 w-4 text-gray-400" />
              <span>Export as PNG</span>
            </button>
            <button
              onClick={handleExport}
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Download className="h-4 w-4 text-gray-400" />
              <span>Export as SVG</span>
            </button>
            <div className="mx-2 my-1 border-t border-gray-100" />
            <button
              onClick={() => {
                onClear?.();
                setMenuOpen(false);
              }}
              disabled={shapes.length === 0}
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear canvas</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
