import { ArrowRight, Circle, Hand, Minus, MousePointer2, Pencil, Plus, Redo2, Square, Type, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

const collaborators = [
  { name: "A", className: "bg-lavender text-primary" },
  { name: "J", className: "bg-peach text-orange-800" },
  { name: "M", className: "bg-mint text-emerald-800" },
];

/** A lightweight, animated illustration of a board — not a second editor. */
export function BoardPreview({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div
      role="img"
      aria-label="Example whiteboard with an idea, a plan, and a launch connected by arrows"
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-lift ring-1 ring-black/[0.03]",
        className,
      )}
    >
      {/* Window header */}
      <div className="flex items-center justify-between gap-3 border-b bg-card px-4 py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <i className="size-2.5 rounded-full bg-[#ff5f57]" />
            <i className="size-2.5 rounded-full bg-[#febc2e]" />
            <i className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="ml-2 font-medium text-foreground/80">the-next-big-thing</span>
        </span>
        <span className="group/avatars flex items-center">
          {collaborators.map((c, i) => (
            <span
              key={c.name}
              className={cn(
                "grid size-6 place-items-center rounded-full border-2 border-card text-[10px] font-semibold transition-transform duration-300 group-hover/avatars:-translate-y-1",
                i > 0 && "-ml-2",
                c.className,
              )}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {c.name}
            </span>
          ))}
          <span className="ml-2 text-[10px]">+ you</span>
        </span>
      </div>

      {/* Canvas */}
      <div className={cn("dot-grid relative bg-background/60 px-5 pb-14 pt-5", compact ? "min-h-[300px]" : "min-h-[380px]")}>
        {/* toolbar */}
        <div className="mx-auto flex w-max items-center gap-0.5 rounded-xl border bg-card p-1 shadow-soft">
          {[MousePointer2, Hand, Square, Circle, Pencil, Type].map((Icon, i) => (
            <span key={i} className={cn("grid size-8 place-items-center rounded-lg text-muted-foreground", i === 0 && "bg-primary/10 text-primary")}>
              <Icon size={15} />
            </span>
          ))}
        </div>

        <p className="mt-6 text-center font-serif text-[15px] italic text-muted-foreground">a little messy. a lot of possibility.</p>

        {/* Flow */}
        <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
          <FlowNode label="01 / THE SPARK" title="What if…?" body="Every great thing starts right here." className="-rotate-2 border-primary/30 bg-lavender text-primary" delay={0} />
          <ArrowRight className="size-5 shrink-0 text-muted-foreground/60" />
          <FlowNode label="02 / THE PLAN" title="Connect the dots" body="Explore. Sketch. Find a way forward." className="rotate-1 border-amber-500/30 bg-butter text-amber-800" delay={120} />
          <ArrowRight className="size-5 shrink-0 text-muted-foreground/60" />
          <FlowNode label="03 / LET'S GO" title="Make it happen ✦" body="Less talking about it. More doing it." className="-rotate-1 border-emerald-500/30 bg-mint text-emerald-800" delay={240} />
        </div>

        {/* Sticky */}
        <div className="absolute bottom-12 left-[10%] hidden -rotate-6 animate-float rounded-sm bg-butter px-3.5 py-3 font-serif text-sm italic leading-snug text-amber-900 shadow-md sm:block">
          Think outside
          <br />
          the board. ↗
        </div>

        {/* Scribble drawn in */}
        <svg className="absolute bottom-10 right-[12%] hidden w-32 text-primary/40 sm:block" viewBox="0 0 240 60" fill="none" aria-hidden="true">
          <path
            d="M5 38C58 4 160 4 210 26C235 42 151 60 75 39C35 22 160 14 231 35"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="600"
            strokeDashoffset="600"
            className="animate-draw-path"
          />
        </svg>

        {/* Live cursor */}
        <div className="absolute bottom-[86px] right-[18%] animate-cursor-drift text-primary">
          <MousePointer2 size={18} fill="currentColor" />
          <span className="ml-4 -mt-0.5 block w-max rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground shadow">Alex</span>
        </div>

        {/* Bottom controls */}
        <div className="absolute inset-x-4 bottom-3 flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1 rounded-lg border bg-card p-1 shadow-soft">
            <i className="grid size-6 place-items-center rounded-md"><Undo2 size={13} /></i>
            <i className="grid size-6 place-items-center rounded-md"><Redo2 size={13} /></i>
          </span>
          <span className="flex items-center gap-1 rounded-lg border bg-card p-1 text-[11px] shadow-soft">
            <i className="grid size-6 place-items-center"><Minus size={12} /></i>
            <b className="w-10 text-center font-medium tabular-nums">100%</b>
            <i className="grid size-6 place-items-center"><Plus size={12} /></i>
          </span>
        </div>
      </div>
    </div>
  );
}

function FlowNode({ label, title, body, className, delay }: { label: string; title: string; body: string; className: string; delay: number }) {
  return (
    <div
      className={cn("w-full max-w-[150px] animate-scale-in rounded-lg border px-3 py-4 text-center shadow-sm", className)}
      style={{ animationDelay: `${delay + 200}ms` }}
    >
      <span className="block text-[8px] font-semibold tracking-[0.12em] opacity-70">{label}</span>
      <strong className="mt-2 block font-serif text-[15px] font-normal leading-tight">{title}</strong>
      <small className="mt-1.5 hidden text-[10px] leading-relaxed opacity-80 sm:block">{body}</small>
    </div>
  );
}
