"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Command,
  Download,
  ExternalLink,
  FolderOpen,
  Globe,
  Heart,
  HelpCircle,
  Menu,
  MessageCircle,
  Moon,
  RotateCcw,
  Save,
  Search,
  Settings,
  Sparkles,
  Sun,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type MenuItem } from "./types";

const menuGroups: MenuItem[][] = [
  [
    { id: "open", icon: FolderOpen, label: "Open", shortcut: "Ctrl+O" },
    { id: "save-to", icon: Save, label: "Save to..." },
    { id: "export", icon: Download, label: "Export image...", shortcut: "Ctrl+Shift+E" },
    { id: "live-collab", icon: Users, label: "Live collaboration..." },
  ],
  [
    { id: "command-palette", icon: Command, label: "Command palette", shortcut: "Ctrl+/" },
    { id: "find", icon: Search, label: "Find on canvas", shortcut: "Ctrl+F" },
    { id: "help", icon: HelpCircle, label: "Help", shortcut: "?" },
    { id: "reset", icon: RotateCcw, label: "Reset the canvas" },
  ],
  [
    { id: "excalidraw-plus", icon: Sparkles, label: "Excalidraw+" },
    { id: "github", icon: ExternalLink, label: "GitHub" },
    { id: "follow-us", icon: Heart, label: "Follow us" },
    { id: "discord", icon: MessageCircle, label: "Discord chat" },
    { id: "sign-up", icon: UserPlus, label: "Sign up" },
  ],
];

interface HamburgerMenuProps {
  onItemClick?: (itemId: string) => void;
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
}

export function HamburgerMenu({
  onItemClick,
  theme = "light",
  onThemeToggle,
}: HamburgerMenuProps) {
  const [open, setOpen] = useState(true);
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
        className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[#eceaf4] bg-[#f6f5fb] text-[#4c5160] transition-colors hover:bg-[#efedf7] hover:text-[#232734]"
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
            className="absolute left-0 top-[calc(100%+10px)] z-50 min-w-[322px] origin-top-left overflow-visible rounded-[18px] border border-[#e8e6f2] bg-white py-2 shadow-[0_28px_80px_-34px_rgba(15,23,42,0.5)]"
          >
            {menuGroups.map((group, gi) => (
              <div key={gi}>
                {gi > 0 && <div className="mx-4 my-2 border-t border-[#f0eef6]" />}
                {group.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-6 py-3 text-left text-[15px] text-[#202433] transition-colors hover:bg-[#f8f7fc]",
                      item.id === "command-palette" || item.id === "sign-up" ? "font-semibold text-[#6d63da]" : ""
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0 text-[#2d3140]",
                        item.id === "command-palette" || item.id === "sign-up" ? "text-[#6d63da]" : ""
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
              className="flex w-full items-center gap-3 px-6 py-3 text-left text-[15px] text-[#202433] transition-colors hover:bg-[#f8f7fc]"
            >
              <Settings className="h-4 w-4 shrink-0 text-[#2d3140]" strokeWidth={1.6} />
              <span className="flex-1 truncate">Preferences</span>
              <ChevronRight className="h-4 w-4 text-[#a0a4b8]" strokeWidth={1.6} />
            </button>

            <div className="mx-6 mt-2 mb-1 text-[15px] text-[#202433]">Theme</div>

            <div className="mx-6 mb-4 inline-flex items-center rounded-2xl border border-[#eceaf4] bg-white p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <button
                onClick={() => theme !== "light" && onThemeToggle?.()}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                  theme === "light" ? "bg-[#6d63da] text-white" : "text-[#6d63da]"
                )}
              >
                <Sun className="h-4 w-4" strokeWidth={1.7} />
              </button>
              <button
                onClick={() => theme !== "dark" && onThemeToggle?.()}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                  theme === "dark" ? "bg-[#6d63da] text-white" : "text-[#6d63da]"
                )}
              >
                <Moon className="h-4 w-4" strokeWidth={1.7} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-xl text-[#6d63da] transition-colors">
                <Globe className="h-4 w-4" strokeWidth={1.7} />
              </button>
            </div>

            <div className="relative px-6 pb-2">
              <button
                onClick={() => setLangOpen((current) => !current)}
                className="flex w-full items-center gap-3 rounded-xl border border-[#eceaf4] px-4 py-3 text-left text-[15px] text-[#202433] transition-colors hover:bg-[#f8f7fc]"
              >
                <span className="flex-1">{language}</span>
                <ChevronRight
                  className={cn("h-4 w-4 text-[#202433] transition-transform", langOpen ? "rotate-90" : "")}
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
                    className="absolute left-full top-0 ml-2 min-w-[180px] origin-top-left rounded-2xl border border-[#eceaf4] bg-white py-1 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setLangOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-[#202433] transition-colors hover:bg-[#f8f7fc]"
                      >
                        <span className={cn("flex-1", lang === language && "font-medium")}>{lang}</span>
                        {lang === language && <Check className="h-3.5 w-3.5 text-[#6d63da]" strokeWidth={2} />}
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
