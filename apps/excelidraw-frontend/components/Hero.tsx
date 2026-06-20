"use client";

import Link from "next/link";
import { ArrowRight, Download, Sparkles } from "lucide-react";
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
    <section className="relative overflow-hidden bg-white text-slate-900 pt-32 pb-16 md:pt-40 md:pb-24 border-b border-slate-100 transition-colors">
      {/* Background ambient glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-500/5 blur-[130px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Left Column: Headline and CTAs */}
          <GsapReveal direction="up" distance={40} delay={0} className="space-y-8 text-left" triggerHook="top 90%">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-xs text-indigo-600 backdrop-blur-sm shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>Open-source • Real-time • Self-hostable</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl xl:text-6xl text-slate-900">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Draw</span> together.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Think</span> better.
            </h1>

            <p className="max-w-xl text-lg text-slate-500 leading-relaxed">
              Excelidraw is a real-time collaborative whiteboard that just works.
              Create a room, share a link, and start drawing with your team instantly.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button asChild variant="primary" size="xl" className="shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all">
                <Link href="#demo">
                  Try a Live Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="bg-white text-slate-900 border-slate-200 hover:bg-slate-50 shrink-0">
                <Link href="#open-source">
                  <Download className="h-4 w-4" />
                  Self-host Excelidraw
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex -space-x-3">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`User ${i + 1}`}
                    className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                ))}
              </div>
              <p className="text-sm leading-tight text-slate-500">
                Join <span className="text-slate-900 font-bold">thousands of teams</span>
                <br />
                collaborating in real time
              </p>
            </div>
          </GsapReveal>

          {/* Right Column: Generated Whiteboard Image in Mockup */}
          <GsapReveal direction="right" distance={30} delay={0.15} className="w-full relative" triggerHook="top 90%">
            <div className="relative rounded-[1.5rem] group">
              
              {/* Glowing Background Border Effect */}
              <div className="absolute -inset-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-[1.6rem] blur-[8px] opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute -inset-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-[1.6rem] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative rounded-[1.4rem] border border-white/50 bg-white/60 backdrop-blur-sm p-2 shadow-2xl z-10">
                <BorderBeam
                  size={80}
                  duration={4}
                  delay={0}
                  borderWidth={1.5}
                  colorFrom="rgba(99, 102, 241, 0.4)"
                  colorTo="transparent"
                  className="opacity-30"
                />

                {/* Browser Shell */}
                <div className="rounded-xl border border-slate-200/60 bg-slate-50 overflow-hidden shadow-sm relative z-20">
                  {/* Header/Controls */}
                  <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#EF4444]" />
                      <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                      <div className="h-3 w-3 rounded-full bg-[#10B981]" />
                    </div>
                    <div className="h-5 w-44 rounded bg-white shadow-sm text-center text-[10px] text-slate-500 flex items-center justify-center font-medium">
                      excelidraw.com/room/project-planning
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                        Share
                      </div>
                    </div>
                  </div>

                  {/* Embedded Generated Whiteboard Image */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-white">
                    <img
                      src="/whiteboard_hero.png"
                      alt="Excelidraw collaborative whiteboard application view"
                      className="w-full h-full object-cover"
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


