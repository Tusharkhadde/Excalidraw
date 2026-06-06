"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  FolderOpen,
  Save,
  Download,
  Users,
  Command,
  Search,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Heart,
  MessageCircle,
  UserPlus,
  Settings,
  Sun,
  Moon,
  Globe,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type MenuItem } from "./types";

const menuGroups: MenuItem[][] = [
  [
    { id: "open", icon: FolderOpen, label: "Open" },
    { id: "save-to", icon: Save, label: "Save to...", submenu: true },
    { id: "export", icon: Download, label: "Export image...", submenu: true },
  ],
  [
    { id: "live-collab", icon: Users, label: "Live collaboration...", submenu: true },
  ],
  [
    { id: "command-palette", icon: Command, label: "Command palette", shortcut: "Ctrl+Shift+P" },
    { id: "find", icon: Search, label: "Find on canvas", shortcut: "Ctrl+F" },
    { id: "help", icon: HelpCircle, label: "Help" },
    { id: "reset", icon: RotateCcw, label: "Reset the canvas" },
  ],
  [
    { id: "excalidraw-plus", icon: Sparkles, label: "Excalidraw+" },
    { id: "github", icon: ExternalLink, label: "GitHub" },
    { id: "follow-us", icon: Heart, label: "Follow us" },
    { id: "discord", icon: MessageCircle, label: "Discord chat" },
    { id: "sign-up", icon: UserPlus, label: "Sign up" },
  ],
  [
    { id: "preferences", icon: Settings, label: "Preferences" },
  ],
];

interface HamburgerMenuProps {
  onItemClick?: (itemId: string) => void;
}

export function HamburgerMenu({ onItemClick }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
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
    if (id === "theme") {
      setTheme((t) => (t === "light" ? "dark" : "light"));
      return;
    }
    if (id === "language") {
      setLangOpen(!langOpen);
      return;
    }
    onItemClick?.(id);
    setOpen(false);
  };

  const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Portuguese", "Russian", "Arabic"];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
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
            className="absolute left-0 top-[calc(100%+4px)] z-50 min-w-[260px] origin-top-left rounded-[10px] border border-gray-200 bg-white py-1 shadow-lg"
          >
            {menuGroups.map((group, gi) => (
              <div key={gi}>
                {gi > 0 && <div className="mx-2 my-1 border-t border-gray-100" />}
                {group.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={1.5} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.shortcut && (
                      <span className="shrink-0 text-[11px] text-gray-400">{item.shortcut}</span>
                    )}
                    {item.submenu && (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" strokeWidth={1.5} />
                    )}
                  </button>
                ))}
              </div>
            ))}

            <div className="mx-2 my-1 border-t border-gray-100" />

            {/* Theme switcher */}
            <button
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
            >
              {theme === "light" ? (
                <Sun className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={1.5} />
              ) : (
                <Moon className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={1.5} />
              )}
              <span className="flex-1">Theme</span>
              <span className="text-[11px] text-gray-400 capitalize">{theme}</span>
            </button>

            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
              >
                <Globe className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={1.5} />
                <span className="flex-1">Language</span>
                <span className="text-[11px] text-gray-400">{language}</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" strokeWidth={1.5} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-full top-0 ml-1 min-w-[180px] origin-top-left rounded-[10px] border border-gray-200 bg-white py-1 shadow-lg"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setLangOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <span className={cn("flex-1", lang === language && "font-medium")}>{lang}</span>
                        {lang === language && <Check className="h-3.5 w-3.5 text-blue-600" strokeWidth={2} />}
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
