import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  Layers,
  MousePointer2,
  Pencil,
  Share2,
  Sparkles,
  Users,
  Zap,
  Keyboard,
  Wifi,
  Lock,
} from "lucide-react";
import { Navbar } from "./Navbar";
import LandingFooter from "./LandingFooter";
import { BoardPreview } from "./BoardPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────── Data ─────────────────────────────── */

export const productFeatures = [
  { icon: Pencil, title: "Your ideas, without limits", description: "Sketch freely, add shapes and text, and turn a complicated thought into something everyone can see.", tone: "lavender" },
  { icon: Users, title: "Better when we're together", description: "Create a room, share its link, and work on the same canvas with your team in real time.", tone: "peach" },
  { icon: Download, title: "Take your work with you", description: "Export your board as PNG or SVG. From a quick sketch to a finished diagram, it's yours to keep.", tone: "mint" },
  { icon: MousePointer2, title: "Room to explore", description: "Pan, zoom, move, and resize. Your canvas gives every idea the space it needs.", tone: "peach" },
  { icon: Layers, title: "A home for every project", description: "Sign in to create named rooms and return to your saved work from your personal workspace.", tone: "mint" },
  { icon: Zap, title: "From zero to drawing", description: "Open a guest board and start right away. No account or installation needed for a local sketch.", tone: "lavender" },
] as const;

const toneStyles: Record<string, { card: string; icon: string }> = {
  lavender: { card: "bg-lavender", icon: "text-primary" },
  peach: { card: "bg-peach", icon: "text-orange-700" },
  mint: { card: "bg-mint", icon: "text-emerald-700" },
};

const steps = [
  { title: "Open your canvas", text: "Start a quick guest sketch, or create an account for saved project rooms." },
  { title: "Make room for everyone", text: "Create a room and send the link to your team. Great thinking is a team sport." },
  { title: "Get it out of your head", text: "Draw, discuss, and connect. Export the result when you're ready to take the next step." },
];

const faqs = [
  { q: "Can I try it without an account?", a: "Yes. Open a guest canvas and draw immediately, even without the collaboration server. Guest boards stay in the current session, so export your work before leaving." },
  { q: "How do I draw with my team?", a: "Create an account, make a room from your workspace, and share its link. Teammates sign in to join. Saved rooms and real-time collaboration require the backend services to be running." },
  { q: "Can I download my drawings?", a: "Absolutely. Use the export menu in the canvas to download a PNG image or an SVG file, including in guest mode." },
  { q: "Is it open source?", a: "Yes. Drawboard is built in the open with Next.js, a custom canvas engine, and a small WebSocket server. Contributions are welcome." },
];

/* ─────────────────────────────── Blocks ─────────────────────────────── */

export function FeatureGrid({ all = false }: { all?: boolean }) {
  const items = productFeatures.slice(0, all ? 6 : 3);
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, title, description, tone }, i) => (
        <Card
          key={title}
          className={cn(
            "group relative overflow-hidden border-black/[0.04] p-7 shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
            toneStyles[tone].card,
          )}
        >
          <div className={cn("grid size-11 place-items-center rounded-xl bg-white/80 shadow-sm", toneStyles[tone].icon)}>
            <Icon size={20} />
          </div>
          <span className="absolute right-6 top-7 font-serif text-sm italic text-muted-foreground/70">0{i + 1}</span>
          <h3 className="mt-10 text-[17px] font-semibold tracking-tight">{title}</h3>
          <p className="prose-muted mt-2.5 text-sm">{description}</p>
        </Card>
      ))}
    </div>
  );
}

export function MarketingCTA() {
  return (
    <section className="container pb-20 pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-ink-foreground shadow-lift sm:px-14 sm:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 size-[380px] rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-[300px] rounded-full bg-fuchsia-400/20 blur-3xl" />
        <span className="pointer-events-none absolute right-[8%] top-1/2 hidden -translate-y-1/2 font-serif text-[220px] leading-none text-primary/40 md:block" aria-hidden="true">
          ✳
        </span>
        <div className="relative max-w-xl">
          <Badge variant="outline" className="border-white/20 text-white/80">
            <Sparkles className="size-3.5" /> Your next big idea starts here
          </Badge>
          <h2 className="display mt-6 text-4xl sm:text-5xl">
            Give your thoughts
            <br />a place to <em className="text-[#c8b3ed]">play.</em>
          </h2>
          <p className="mt-5 text-base text-white/70">No perfect lines required. Just a little imagination.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="light">
              <Link href="/canvas/guest">
                Open a fresh canvas <ArrowUpRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              <Link href="/signup">Create a free account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: React.ReactNode; description: string; children?: React.ReactNode }) {
  return (
    <section className="container reveal pb-14 pt-20 text-center sm:pt-24">
      <span className="eyebrow justify-center">{eyebrow}</span>
      <h1 className="display mx-auto mt-5 max-w-3xl text-5xl sm:text-6xl">{title}</h1>
      <p className="prose-muted mx-auto mt-6 max-w-xl text-lg">{description}</p>
      {children && <div className="mt-8 flex justify-center gap-3">{children}</div>}
    </section>
  );
}

/* ─────────────────────────────── Landing ─────────────────────────────── */

export function LandingPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 dot-grid [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="container grid items-center gap-14 pb-20 pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:pb-28 lg:pt-24">
          <div className="reveal text-center lg:text-left">
            <Badge variant="soft" className="mx-auto py-1 pl-1.5 pr-3 lg:mx-0">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Real-time rooms are live
            </Badge>
            <h1 className="display mt-6 text-[52px] sm:text-6xl lg:text-7xl">
              Good ideas start
              <br />
              with a <em>little scribble.</em>
            </h1>
            <p className="prose-muted mx-auto mt-6 max-w-md text-lg lg:mx-0">
              Your team’s thinking space. Sketch out the messy bits, connect the dots, and bring your next big thing to life — together.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button asChild size="xl" className="rounded-full shadow-glow">
                <Link href="/canvas/guest">
                  Start drawing — it’s free <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild size="xl" variant="ghost" className="rounded-full">
                <Link href="#how-it-works">
                  See how it works <ArrowRight />
                </Link>
              </Button>
            </div>
            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
              {["No signup to try", "Runs in your browser", "PNG & SVG export"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="size-4 text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative animate-rise-in [animation-delay:200ms]">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-lavender via-peach to-mint opacity-80 blur-2xl" />
            <BoardPreview className="rotate-[-1.5deg] transition-transform duration-500 hover:rotate-0" />
          </div>
        </div>
      </section>

      {/* Use-case strip */}
      <section className="border-y bg-muted/40">
        <div className="container flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6 text-sm text-muted-foreground">
          <span className="eyebrow">Made for the way you think</span>
          {[
            [Pencil, "Brainstorming"],
            [Layers, "Project planning"],
            [Share2, "Visual thinking"],
            [Users, "Team workshops"],
            [Keyboard, "Keyboard-first"],
          ].map(([Icon, label]) => {
            const I = Icon as typeof Pencil;
            return (
              <span key={label as string} className="inline-flex items-center gap-2">
                <I className="size-4" /> {label as string}
              </span>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="container py-24" id="features">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Less friction. More flow.</span>
            <h2 className="display mt-4 text-4xl sm:text-5xl">
              Everything you need.
              <br />
              <em>Nothing in your way.</em>
            </h2>
          </div>
          <Button asChild variant="link" className="px-0 text-foreground">
            <Link href="/features">
              Explore all features <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <FeatureGrid />
      </section>

      {/* How it works */}
      <section className="border-y bg-muted/40 py-24" id="how-it-works">
        <div className="container grid gap-14 lg:grid-cols-2">
          <div>
            <span className="eyebrow">From “what if” to “here it is”</span>
            <h2 className="display mt-4 text-4xl sm:text-5xl">
              Big ideas.
              <br />
              <em>Small learning curve.</em>
            </h2>
            <p className="prose-muted mt-6 max-w-md text-base">Less time figuring out the tool. More time figuring out the good stuff.</p>
            <Button asChild className="mt-8 rounded-full" size="lg">
              <Link href="/canvas/guest">
                Let’s make something <ArrowRight />
              </Link>
            </Button>
          </div>
          <ol className="divide-y rounded-2xl border bg-card shadow-soft">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-6 p-7">
                <span className="font-serif text-3xl italic text-primary">0{i + 1}</span>
                <div>
                  <h3 className="text-[17px] font-semibold tracking-tight">{s.title}</h3>
                  <p className="prose-muted mt-2 text-sm">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust / stats */}
      <section className="container py-24">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Wifi, title: "Resilient by default", text: "Reconnects automatically and keeps your in-progress work when the connection blips." },
            { icon: Lock, title: "Your boards, your account", text: "Named rooms are saved to your workspace and only shared with the people you invite." },
            { icon: Zap, title: "Fast on any machine", text: "A hand-tuned canvas engine — no heavy frameworks between you and the pixels." },
          ].map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-7 shadow-none transition-shadow hover:shadow-soft">
              <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon size={18} />
              </div>
              <h3 className="mt-5 font-semibold tracking-tight">{title}</h3>
              <p className="prose-muted mt-2 text-sm">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container grid gap-12 pb-24 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="eyebrow">A few things to know</span>
          <h2 className="display mt-4 text-4xl sm:text-5xl">
            Good questions.
            <br />
            <em>Simple answers.</em>
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <MarketingCTA />
    </MarketingShell>
  );
}
