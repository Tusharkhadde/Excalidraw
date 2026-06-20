"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  Image as ImageIcon,
  PanelRight,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { Shape } from "./types";

interface TopRightActionsProps {
  shapes: Shape[];
  onClear?: () => void;
  isGuest?: boolean;
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
        const points = ("points" in s ? (s as { points: { x: number; y: number }[] }).points : undefined);
        if (points && points.length > 1) {
          const pathData = points
            .map((p: { x: number; y: number }, i: number) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`)
            .join(" ");
          return `<path d="${pathData}" stroke="${s.strokeColor || "#1e1e1e"}" stroke-width="${s.strokeWidth || 2}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;
        }
        return "";
      }
      if (s.type === "text") {
        return `<text x="${s.x}" y="${s.y}" font-size="${s.fontSize}" fill="${s.strokeColor || "#1e1e1e"}">${s.text}</text>`;
      }
      return "";
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${shapeMarkup}</svg>`;
}

export function TopRightActions({ shapes, onClear, isGuest = false }: TopRightActionsProps) {
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
    if (isGuest) {
      promptSignIn();
      return;
    }
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
    if (isGuest) {
      promptSignIn();
      return;
    }
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
    if (isGuest) {
      promptSignIn();
      return;
    }
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

  const promptSignIn = () => {
    setMenuOpen(false);
    if (confirm("You're in guest mode. Sign in to save and share your drawings?")) {
      window.location.href = "/signin";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button className="inline-flex h-[52px] items-center gap-1.5 rounded-2xl border border-[#e8e6f2] bg-[#f2f0fb] px-5 text-sm font-medium text-[#3b3f4d] shadow-[0_12px_28px_-22px_rgba(16,24,40,0.5)] transition-all hover:bg-[#ece8fb]">
        <Sparkles className="h-4 w-4 text-[#6d63da]" />
        <span>Excalidraw+</span>
      </button>

      <button
        onClick={handleShare}
        className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#6d63da] text-white shadow-[0_16px_28px_-22px_rgba(109,99,218,0.8)] transition-colors hover:bg-[#5f56ce]"
        title="Share"
      >
        <Share2 className="h-4 w-4" />
      </button>

      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[#eceaf4] bg-[#f6f5fb] text-[#4c5160] transition-colors hover:bg-[#efedf7]"
          title="More options"
        >
          <PanelRight className="h-4 w-4" />
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[190px] rounded-2xl border border-[#eceaf4] bg-white py-1.5 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.45)]"
          >
            <button
              onClick={handleExportPng}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[#3b3f4d] transition-colors hover:bg-[#f7f6fb]"
            >
              <ImageIcon className="h-4 w-4 text-[#8a8ea3]" />
              <span>Export as PNG</span>
            </button>
            <button
              onClick={handleExport}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[#3b3f4d] transition-colors hover:bg-[#f7f6fb]"
            >
              <Download className="h-4 w-4 text-[#8a8ea3]" />
              <span>Export as SVG</span>
            </button>
            <div className="mx-3 my-1 border-t border-[#f0eef6]" />
            <button
              onClick={() => {
                onClear?.();
                setMenuOpen(false);
              }}
              disabled={shapes.length === 0}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
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
