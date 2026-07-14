"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Download,
  HelpCircle,
  Menu,
  Moon,
  RotateCcw,
  Save,
  Settings,
  Sun,
  Users,
  Palette,
  Droplet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type MenuItem } from "./types";
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerEyeDropper, ColorPickerOutput, ColorPickerFormat } from "@repo/ui/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";

const menuGroups: MenuItem[][] = [
  [
    { id: "save-to", icon: Save, label: "Save to..." },
    { id: "export", icon: Download, label: "Export image...", shortcut: "Ctrl+Shift+E" },
    { id: "live-collab", icon: Users, label: "Invite people..." },
  ],
  [
    { id: "help", icon: HelpCircle, label: "Help", shortcut: "?" },
    { id: "reset", icon: RotateCcw, label: "Reset board" },
  ],
];

interface HamburgerMenuProps {
  onItemClick?: (itemId: string) => void;
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
  strokeColor?: string;
  fillColor?: string;
  onStrokeColorChange?: (color: string) => void;
  onFillColorChange?: (color: string) => void;
}

export function HamburgerMenu({
  onItemClick,
  theme = "light",
  onThemeToggle,
  strokeColor = "#1e1e1e",
  fillColor = "transparent",
  onStrokeColorChange,
  onFillColorChange,
}: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setLangOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (id: string) => {
    onItemClick?.(id);
    if (id !== "preferences") {
      setOpen(false);
    }
  };

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Portuguese",
    "Russian",
    "Arabic",
  ];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#111318] text-zinc-300 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.9)] transition-colors hover:bg-[#1a1d23] hover:text-white"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-[calc(100%+8px)] z-50 w-[248px] origin-top-left overflow-visible rounded-2xl border border-white/10 bg-[#111318] py-2 text-zinc-200 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.85)]"
          >
            {menuGroups.map((group, gi) => (
              <div key={gi}>
                {gi > 0 && <div className="mx-4 my-2 border-t border-[#f0eef6]" />}
                {group.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0 text-zinc-500"
                      )}
                      strokeWidth={1.6}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.shortcut && (
                      <span className="shrink-0 text-[13px] text-[#a0a4b8]">{item.shortcut}</span>
                    )}
                  </button>
                ))}
              </div>
            ))}

            <div className="mx-4 my-2 border-t border-[#f0eef6]" />

            <button
              onClick={() => handleItemClick("preferences")}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Settings className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={1.6} />
              <span className="flex-1 truncate">Preferences</span>
              <ChevronRight className="h-4 w-4 text-[#a0a4b8]" strokeWidth={1.6} />
            </button>

            <div className="mx-4 mt-3 mb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">Appearance</div>

            <div className="mx-4 mb-3 inline-flex items-center rounded-xl border border-white/10 bg-black/20 p-1">
              <button
                onClick={() => theme !== "light" && onThemeToggle?.()}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                  theme === "light" ? "bg-cyan-400 text-black" : "text-zinc-400"
                )}
              >
                <Sun className="h-4 w-4" strokeWidth={1.7} />
              </button>
              <button
                onClick={() => theme !== "dark" && onThemeToggle?.()}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                  theme === "dark" ? "bg-cyan-400 text-black" : "text-zinc-400"
                )}
              >
                <Moon className="h-4 w-4" strokeWidth={1.7} />
              </button>
            </div>

            <div className="mx-4 mt-3 mb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">Board colors</div>

            <div className="mx-4 mb-3 space-y-2">
              <div className="flex items-center gap-3">
                <Palette className="h-4 w-4 text-zinc-500" strokeWidth={1.6} />
                <span className="flex-1 text-[13px] text-zinc-300">Stroke</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="h-7 w-7 rounded-lg border border-white/15 transition-colors hover:border-cyan-400"
                      style={{ backgroundColor: strokeColor }}
                      aria-label="Stroke color"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] border-white/10 bg-[#1a1d23] p-3 text-white" align="end">
                    <ColorPicker value={strokeColor} onChange={([r, g, b]) => onStrokeColorChange?.(`#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`)}>
                      <ColorPickerSelection className="h-40 rounded-lg" />
                      <ColorPickerHue />
                      <ColorPickerAlpha />
                      <div className="flex items-center gap-2">
                        <ColorPickerEyeDropper />
                        <ColorPickerOutput />
                        <ColorPickerFormat />
                      </div>
                    </ColorPicker>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-3">
                <Droplet className="h-4 w-4 text-zinc-500" strokeWidth={1.6} />
                <span className="flex-1 text-[13px] text-zinc-300">Fill</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="h-7 w-7 rounded-lg border border-white/15 transition-colors hover:border-cyan-400"
                      style={{ backgroundColor: fillColor === "transparent" ? "transparent" : fillColor }}
                      aria-label="Fill color"
                    >
                      {fillColor === "transparent" && (
                        <svg className="h-full w-full" viewBox="0 0 24 24">
                          <rect width="24" height="24" fill="url(#checkerboard)" />
                          <defs>
                            <pattern id="checkerboard" patternUnits="userSpaceOnUse" width="8" height="8">
                              <rect width="4" height="4" fill="#ccc" />
                              <rect x="4" y="4" width="4" height="4" fill="#ccc" />
                            </pattern>
                          </defs>
                        </svg>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] border-white/10 bg-[#1a1d23] p-3 text-white" align="end">
                    <ColorPicker value={fillColor} onChange={([r, g, b]) => onFillColorChange?.(`#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`)}>
                      <ColorPickerSelection className="h-40 rounded-lg" />
                      <ColorPickerHue />
                      <ColorPickerAlpha />
                      <div className="flex items-center gap-2">
                        <ColorPickerEyeDropper />
                        <ColorPickerOutput />
                        <ColorPickerFormat />
                      </div>
                    </ColorPicker>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="relative px-4 pb-2">
              <button
                onClick={() => setLangOpen((current) => !current)}
                className="flex w-full items-center gap-3 rounded-xl border border-white/15 px-3 py-2.5 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <span className="flex-1">{language}</span>
                <ChevronRight
                  className={cn("h-4 w-4 text-zinc-500 transition-transform", langOpen ? "rotate-90" : "")}
                  strokeWidth={1.8}
                />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-full top-0 ml-2 min-w-[180px] origin-top-left rounded-2xl border border-white/10 bg-[#1a1d23] py-1 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setLangOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <span className={cn("flex-1", lang === language && "font-medium")}>{lang}</span>
                        {lang === language && <Check className="h-3.5 w-3.5 text-cyan-400" strokeWidth={2} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
