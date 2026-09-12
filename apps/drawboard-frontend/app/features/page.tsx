import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Command, Download, MousePointer2, Users } from "lucide-react";
import { FeatureGrid, MarketingCTA, MarketingShell, PageHero } from "@/components/Marketing";
import { BoardPreview } from "@/components/BoardPreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Features",
  description: "Simple drawing tools, shared rooms, keyboard shortcuts, and exports. Everything you need to think visually.",
};

const shortcuts = [
  ["V", "Select"],
  ["H", "Hand / pan"],
  ["P", "Pencil"],
  ["R", "Rectangle"],
  ["O", "Ellipse"],
  ["A", "Arrow"],
  ["T", "Text"],
  ["⌘ Z", "Undo"],
];

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="A small toolkit. A world of possibilities."
        title={
          <>
            Less busywork.
            <br />
            <em>More bright ideas.</em>
          </>
        }
        description="A thoughtful set of tools that gets out of your way. From the first rough sketch to the plan your whole team can get behind."
      >
        <Button asChild size="lg" className="rounded-full">
          <Link href="/canvas/guest">
            Try it on a blank canvas <ArrowUpRight />
          </Link>
        </Button>
      </PageHero>

      <section className="container pb-20" aria-label="Drawing and collaboration features">
        <FeatureGrid all />
      </section>

      {/* Deep-dive rows */}
      <section className="border-y bg-muted/40 py-24">
        <div className="container grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="eyebrow">
              <Users className="size-3.5" /> Real-time rooms
            </span>
            <h2 className="display mt-4 text-4xl">
              Everyone on the
              <br />
              <em>same page — literally.</em>
            </h2>
            <p className="prose-muted mt-5 max-w-md">
              Create a room, drop the link in chat, and watch strokes appear as your teammates draw. Built-in chat keeps the conversation next to the canvas.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {["Live strokes and shape updates", "Reconnects with your in-progress work intact", "In-room chat with your team"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="size-1.5 rounded-full bg-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <BoardPreview compact className="rotate-1" />
        </div>
      </section>

      <section className="container grid gap-6 py-24 lg:grid-cols-3">
        <Card className="p-8 shadow-none lg:col-span-2">
          <span className="eyebrow">
            <Command className="size-3.5" /> Keyboard-first
          </span>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">Fly through the toolbar.</h3>
          <p className="prose-muted mt-2 max-w-lg text-sm">Every tool has a single-key shortcut. Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">?</kbd> inside the board to see them all.</p>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {shortcuts.map(([k, l]) => (
              <div key={k} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm">
                <span className="text-muted-foreground">{l}</span>
                <kbd className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium">{k}</kbd>
              </div>
            ))}
          </div>
        </Card>
        <div className="grid gap-6">
          <Card className="bg-lavender p-7 shadow-none">
            <Download className="size-5 text-primary" />
            <h3 className="mt-4 font-semibold tracking-tight">Export in a click</h3>
            <p className="prose-muted mt-1.5 text-sm">PNG for slides and docs, SVG when you want to keep editing elsewhere.</p>
          </Card>
          <Card className="bg-mint p-7 shadow-none">
            <MousePointer2 className="size-5 text-emerald-700" />
            <h3 className="mt-4 font-semibold tracking-tight">Infinite canvas</h3>
            <p className="prose-muted mt-1.5 text-sm">Pan with space + drag, pinch or ⌘ ± to zoom, and reset with ⌘ 0.</p>
          </Card>
        </div>
      </section>

      <MarketingCTA />
    </MarketingShell>
  );
}
