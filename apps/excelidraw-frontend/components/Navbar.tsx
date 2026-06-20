"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { LogOut, Menu, X, Sun, Moon, ArrowUpRight, PenTool } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, token, signout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 text-slate-800 dark:text-white transition-colors">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 h-20">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
            <PenTool className="h-5 w-5 text-white transform -rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Excelidraw</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#demo" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Demo
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            How it works
          </Link>
          <Link href="#open-source" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Self-host
          </Link>
          <Link href="#" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Docs
          </Link>
          <a
            href="https://github.com/excalidraw/excalidraw"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            GitHub
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
          </a>

          {/* Theme Toggle Pill */}
          <div className="flex items-center gap-4 pl-4 border-l border-slate-100 dark:border-white/10">
            {mounted ? (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="relative flex h-8 w-[68px] shrink-0 items-center justify-between rounded-full bg-slate-100 dark:bg-black/40 p-1 border border-slate-200 dark:border-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {/* Sliding Indicator Circle */}
                <div
                  className={cn(
                    "absolute top-0.5 h-6 w-6 rounded-full shadow-md transition-all duration-200 ease-in-out flex items-center justify-center",
                    isDark ? "translate-x-9 bg-indigo-600 text-white" : "translate-x-0.5 bg-amber-400 text-white"
                  )}
                >
                  {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                </div>
                <span className="flex h-6 w-6 items-center justify-center text-slate-400 z-10 pointer-events-none">
                  <Sun className={cn("h-3.5 w-3.5 transition-colors", !isDark && "text-transparent")} />
                </span>
                <span className="flex h-6 w-6 items-center justify-center text-slate-400 z-10 pointer-events-none">
                  <Moon className={cn("h-3.5 w-3.5 transition-colors", isDark && "text-transparent")} />
                </span>
              </button>
            ) : (
              <div className="h-8 w-[68px] rounded-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 animate-pulse" />
            )}

            {/* Auth Session Info or Action Button */}
            {token ? (
              <div className="flex items-center gap-3">
                <Link href="/" className="text-sm font-semibold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white transition-all">
                  Dashboard
                </Link>
                <button
                  onClick={signout}
                  className="flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/signin"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 shadow-md shadow-indigo-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="relative flex h-7 w-14 items-center justify-between rounded-full bg-slate-100 dark:bg-black/40 p-0.5 border border-slate-200 dark:border-white/10"
              aria-label="Toggle theme"
            >
              <div
                className={cn(
                  "absolute h-5 w-5 rounded-full shadow-md transition-all duration-200 flex items-center justify-center",
                  isDark ? "translate-x-7 bg-indigo-600 text-white" : "translate-x-0.5 bg-amber-400 text-white"
                )}
              >
                {isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
              </div>
              <span className="w-5" />
              <span className="w-5" />
            </button>
          )}
          <button
            className="p-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0F172A] border-t border-slate-100 dark:border-white/5 px-6 py-5 space-y-4 shadow-xl">
          <Link href="#features" className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            Features
          </Link>
          <Link href="#demo" className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            Demo
          </Link>
          <Link href="#how-it-works" className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            How it works
          </Link>
          <Link href="#open-source" className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            Self-host
          </Link>
          <Link href="#" className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            Docs
          </Link>
          <a
            href="https://github.com/excalidraw/excalidraw"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            GitHub ↗
          </a>
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
            {token ? (
              <>
                <Link href="/" className="block text-sm font-semibold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-center" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={() => { signout(); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2 text-sm font-medium text-red-400 hover:text-red-500"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/signin"
                  className="text-center py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700 py-2.5 text-center text-sm font-semibold text-white transition-all shadow-md shadow-indigo-500/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

