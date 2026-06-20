"use client";

import Link from "next/link";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

const avatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-white pt-32 pb-16 md:pt-40 md:pb-24 border-b border-slate-100 dark:border-slate-900 transition-colors">
      {/* Background ambient glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.25),transparent)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[130px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 dark:border-indigo-500/20 dark:bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-600 dark:text-indigo-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
              <span>Open-source • Real-time • Self-hostable</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl xl:text-6xl text-slate-900 dark:text-white">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Draw</span> together.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Think</span> better.
            </h1>

            <p className="max-w-xl text-lg text-slate-500 dark:text-gray-400 leading-relaxed">
              Excelidraw is a real-time collaborative whiteboard that just works.
              Create a room, share a link, and start drawing with your team instantly.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="#demo"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110 active:scale-[0.98]"
              >
                Try a Live Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#open-source"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 dark:bg-white/5 dark:border-white/10 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-white/10 active:scale-[0.98]"
              >
                <Download className="h-4 w-4 text-slate-400" />
                Self-host Excelidraw
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex -space-x-3">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`User ${i + 1}`}
                    className="h-9 w-9 rounded-full border-2 border-white dark:border-[#0B0F19] object-cover"
                  />
                ))}
              </div>
              <p className="text-sm leading-tight text-slate-500 dark:text-gray-400">
                Join <span className="text-slate-900 dark:text-white font-semibold">thousands of teams</span>
                <br />
                collaborating in real time
              </p>
            </div>
          </div>

          {/* Right Column: Generated Whiteboard Image in Mockup */}
          <div className="w-full relative">
            <div className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-950/60 p-2 shadow-xl dark:shadow-indigo-500/10">
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
              <div className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-[#1E293B] overflow-hidden shadow-sm">
                {/* Header/Controls */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-100 dark:bg-[#0F172A] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#EF4444]" />
                    <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                    <div className="h-3 w-3 rounded-full bg-[#10B981]" />
                  </div>
                  <div className="h-5 w-44 rounded bg-slate-200/50 dark:bg-white/5 text-center text-[10px] text-slate-500 dark:text-gray-500 flex items-center justify-center font-medium">
                    excelidraw.com/room/project-planning
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Share
                    </div>
                  </div>
                </div>

                {/* Embedded Generated Whiteboard Image */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#F8FAFC]">
                  <img
                    src="/whiteboard_hero.png"
                    alt="Excelidraw collaborative whiteboard application view"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


