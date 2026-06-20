"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { LogOut, LogIn, Menu, X, PenTool } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";

const navLinks: { label: string; href: string }[] = [];

export function Navbar() {
  const { token, signout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 text-slate-800 transition-colors">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 h-20">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
            <PenTool className="h-5 w-5 text-white transform -rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Excelidraw</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Docs
          </Link>

          <div className="flex items-center gap-4 pl-4 border-l border-slate-100 shrink-0">
            {token ? (
              <div className="flex items-center gap-3 shrink-0">
                <Button asChild variant="secondary" size="sm" className="shrink-0 min-w-max shadow-sm hover:shadow-md transition-all">
                  <Link href="/">Dashboard</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signout}
                  title="Sign out"
                  className="text-slate-400 hover:text-red-400 shrink-0 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 shrink-0">
                <Button asChild variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 shrink-0 min-w-max font-medium">
                  <Link href="/signin">
                    Log in
                  </Link>
                </Button>
                <Button asChild variant="primary" size="sm" className="shrink-0 min-w-max bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md shadow-indigo-500/20 border-0 rounded-xl px-4 font-semibold transition-all hover:scale-105 active:scale-95">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile trigger */}
        <div className="flex md:hidden items-center gap-4">
          <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <Dialog.Trigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-50 rounded-full">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed top-20 left-0 right-0 bottom-0 z-50 bg-white border-t border-slate-100 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-[5%] data-[state=open]:slide-in-from-top-[5%] overflow-y-auto">
                <div className="px-6 py-6 space-y-1">
                  {navLinks.map((link) => (
                    <Dialog.Close key={link.href} asChild>
                      <Link
                        href={link.href}
                        className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                      >
                        {link.label}
                      </Link>
                    </Dialog.Close>
                  ))}
                  <Dialog.Close asChild>
                    <Link
                      href="#"
                      className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Docs
                    </Link>
                  </Dialog.Close>

                </div>

                <div className="px-6 pb-8 pt-4 border-t border-slate-100 space-y-3">
                  {token ? (
                    <>
                      <Dialog.Close asChild>
                        <Button asChild variant="secondary" size="lg" className="w-full justify-center">
                          <Link href="/">Dashboard</Link>
                        </Button>
                      </Dialog.Close>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full justify-center text-red-400 hover:text-red-500"
                        onClick={() => { signout(); setMobileMenuOpen(false); }}
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Dialog.Close asChild>
                        <Button asChild variant="outline" size="lg" className="w-full justify-center backdrop-blur-sm bg-white/50 border-slate-200/60">
                          <Link href="/signin">
                            <LogIn className="h-4 w-4" />
                            Log in
                          </Link>
                        </Button>
                      </Dialog.Close>
                      <Dialog.Close asChild>
                        <Button asChild variant="primary" size="lg" className="w-full justify-center">
                          <Link href="/signup">Get Started</Link>
                        </Button>
                      </Dialog.Close>
                    </>
                  )}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
