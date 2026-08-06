"use client";

import Link from "next/link";
import { ArrowRight, Check, MousePointer2, Share2 } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { GsapReveal } from "@/components/ui/gsap-reveal";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-[#080b10] pb-20 pt-32 text-white md:pb-28 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_75%_8%,rgba(45,212,191,0.14),transparent),linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
          <GsapReveal direction="up" distance={40} delay={0} className="space-y-8 text-left" triggerHook="top 90%">
            <div className="inline-flex items-center gap-2 border-l-2 border-teal-300 pl-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">
              <span>Collaborative canvas / 01</span>
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.96] tracking-[-0.07em] text-white sm:text-7xl xl:text-[92px]">
              The room where <span className="text-slate-500">thinking</span> gets visible.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-400">
              Drawboard is a shared canvas for early ideas, sharp conversations, and the diagrams that make a decision click. No setup ceremony. Just open a room and start.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button asChild variant="premium" size="xl" className="hero-primary rounded-xl px-6">
                <Link href="/signup">Open a new canvas <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="hero-secondary shrink-0 rounded-xl">
                <Link href="/canvas/guest">Enter guest canvas</Link>
              </Button>
            </div>
            <div className="grid max-w-lg grid-cols-2 gap-x-8 gap-y-3 border-t border-slate-800 pt-5 text-sm text-slate-400 sm:grid-cols-3">
              {['No install', 'Live cursors', 'Link-based rooms'].map((item) => <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-300" />{item}</span>)}
            </div>
          </GsapReveal>
          <GsapReveal direction="right" distance={30} delay={0.15} className="relative w-full" triggerHook="top 90%">
            <div className="relative rounded-[1.5rem]">
              <div className="absolute -inset-6 rounded-[2rem] bg-teal-300/10 blur-3xl" />
              <div className="relative z-10 rounded-[1.4rem] border border-slate-700 bg-slate-900/80 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur">
                <BorderBeam size={80} duration={4} delay={0} borderWidth={1.5} colorFrom="rgba(94,234,212,0.5)" colorTo="transparent" className="opacity-50" />
                <div className="relative z-20 overflow-hidden rounded-xl border border-slate-700 bg-[#111820] shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-700/80 bg-slate-900 px-4 py-3 text-xs text-slate-400">
                    <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-300" /> Product sprint / Tuesday</span>
                    <span className="flex items-center gap-1.5"><Share2 className="h-3 w-3" /> Invite</span>
                  </div>
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-white">
                    <img src="/drawboard-hero-generated.png" alt="Drawboard collaborative whiteboard workspace" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs text-slate-300 shadow-xl"><MousePointer2 className="h-3.5 w-3.5 text-teal-300" /> 4 people are editing</div>
                </div>
              </div>
            </div>
          </GsapReveal>
        </div>
      </div>
    </section>
  );
}
