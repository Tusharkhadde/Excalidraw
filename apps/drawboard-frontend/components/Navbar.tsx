"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, LayoutGrid, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Brand } from "./Brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { label: "Features", href: "/features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
];

function initials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Navbar() {
  const { token, user, signout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="absolute inset-x-0 top-0 h-[72px] bg-gradient-to-b from-background via-background/90 to-background/40 backdrop-blur-xl" />
      <div className="absolute inset-x-0 top-[71px] h-px bg-gradient-to-r from-transparent via-border/80 to-transparent" />

      <div className="container relative grid h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="justify-self-start">
          <Brand />
        </div>

        <nav
          aria-label="Main navigation"
          className="hidden items-center rounded-full border border-border/60 bg-card/70 p-1 shadow-soft backdrop-blur-md md:flex"
        >
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-[13px] font-medium tracking-[-0.01em] text-muted-foreground transition-all duration-200 hover:text-foreground",
                  active && "bg-background text-foreground shadow-sm",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center justify-self-end gap-1.5 md:flex">
          {token ? (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:text-foreground">
                <Link href="/">
                  <LayoutGrid /> Workspace
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="rounded-full ring-offset-background transition-shadow hover:ring-2 hover:ring-primary/25 focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Account menu"
                  >
                    <Avatar className="h-9 w-9 border border-border/80">
                      <AvatarFallback className="bg-primary/10 text-[12px] font-semibold text-primary">{initials(user?.name)}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium">{user?.name ?? "Signed in"}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/">
                      <LayoutGrid /> My workspace
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/canvas/guest">
                      <ArrowUpRight /> Quick sketch
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={signout} className="text-destructive focus:text-destructive">
                    <LogOut /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-full px-3.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Button asChild size="sm" className="h-9 rounded-full px-4 shadow-glow">
                <Link href="/canvas/guest">
                  Start drawing
                  <ArrowUpRight className="!size-3.5 opacity-90" />
                </Link>
              </Button>
            </>
          )}
        </div>

        <div className="justify-self-end md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open navigation">
                <Menu className="!size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[300px] flex-col">
              <SheetHeader className="text-left">
                <SheetTitle>
                  <Brand />
                </SheetTitle>
                <SheetDescription className="sr-only">Pages and account options</SheetDescription>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {links.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link href={link.href} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-accent">
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2">
                <SheetClose asChild>
                  <Button asChild size="lg" className="rounded-full">
                    <Link href={token ? "/" : "/canvas/guest"}>
                      {token ? "My workspace" : "Start drawing"} <ArrowUpRight />
                    </Link>
                  </Button>
                </SheetClose>
                {token ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                    onClick={() => {
                      signout();
                      setOpen(false);
                    }}
                  >
                    <LogOut /> Sign out
                  </Button>
                ) : (
                  <SheetClose asChild>
                    <Button asChild variant="outline" size="lg" className="rounded-full">
                      <Link href="/signin">Log in</Link>
                    </Button>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
