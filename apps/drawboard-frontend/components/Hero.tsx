"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { GsapReveal } from "@/components/ui/gsap-reveal";

const avatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-black/10 bg-white pb-16 pt-32 text-black transition-colors md:pb-24 md:pt-40">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_75%_0%,rgba(0,0,0,0.06),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Left Column: Headline and CTAs */}
          <GsapReveal direction="up" distance={40} delay={0} className="space-y-8 text-left" triggerHook="top 90%">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-neutral-50 px-4 py-1.5 text-xs text-neutral-600">
              <Sparkles className="h-3.5 w-3.5 fill-black text-black" />
              <span>Open-source • Real-time • Self-hostable</span>
            </div>

            <h1 className="text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-black sm:text-6xl xl:text-7xl">
              <span className="underline decoration-[3px] underline-offset-[10px]">Draw</span> together.
              <br />
              <span className="underline decoration-[3px] underline-offset-[10px]">Think</span> better.
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-neutral-500">
              Drawboard is a real-time collaborative whiteboard that just works.
              Create a room, share a link, and start drawing with your team instantly.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button asChild variant="primary" size="xl" className="rounded-lg bg-black text-white shadow-none transition-colors hover:bg-neutral-800">
                <Link href="#demo">
                  Try a Live Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="shrink-0 rounded-lg border-black/20 bg-white text-black hover:bg-neutral-100">
                <Link href="/canvas/guest">
                  Try It Free
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 border-t border-black/10 pt-4">
              <div className="flex -space-x-3">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`User ${i + 1}`}
                    className="h-9 w-9 rounded-full border-2 border-white object-cover grayscale"
                  />
                ))}
              </div>
              <p className="text-sm leading-tight text-neutral-500">
                Join <span className="font-semibold text-black">thousands of teams</span>
                <br />
                collaborating in real time
              </p>
            </div>
          </GsapReveal>

          {/* Right Column: Generated Whiteboard Image in Mockup */}
          <GsapReveal direction="right" distance={30} delay={0.15} className="w-full relative" triggerHook="top 90%">
            <div className="relative rounded-[1.5rem] group">
              
              {/* Glowing Background Border Effect */}
              <div className="absolute -inset-px rounded-[1.6rem] bg-black/10 blur-[8px]" />

              <div className="relative z-10 rounded-[1.4rem] border border-black/15 bg-white p-2 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)]">
                <BorderBeam
                  size={80}
                  duration={4}
                  delay={0}
                  borderWidth={1.5}
                  colorFrom="rgba(99, 102, 241, 0.4)"
                  colorTo="transparent"
                  className="opacity-30"
                />

                <div className="relative z-20 overflow-hidden rounded-xl border border-black/15 bg-neutral-100 shadow-sm">
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-white">
                    <img
                      src="/drawboard-hero-generated.png"
                      alt="Drawboard collaborative whiteboard workspace"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </GsapReveal>
        </div>
      </div>
    </section>
  );
}


