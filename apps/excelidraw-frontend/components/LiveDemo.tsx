"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { LazySection } from "@/components/ui/lazy-section";
import { GsapReveal } from "@/components/ui/gsap-reveal";

const slides = [
  {
    title: "Database Architecture",
    theme: "light",
    bg: "bg-[#F8FAFC]",
    svg: (
      <svg viewBox="0 0 800 450" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <text x="400" y="45" textAnchor="middle" fontFamily="Caveat" fontSize="28" fontWeight="bold" fill="#1E293B">System Architecture</text>
        {/* DB 1 */}
        <g transform="translate(100, 100)">
          <rect width="130" height="80" rx="6" fill="none" stroke="#2563EB" strokeWidth="2.5" />
          <text x="65" y="35" textAnchor="middle" fontFamily="Caveat" fontSize="18" fill="#1E40AF" fontWeight="bold">Primary DB</text>
          <text x="65" y="55" textAnchor="middle" fontFamily="Caveat" fontSize="14" fill="#1E40AF">PostgreSQL</text>
        </g>
        {/* DB 2 */}
        <g transform="translate(100, 260)">
          <rect width="130" height="80" rx="6" fill="none" stroke="#2563EB" strokeWidth="2.5" />
          <text x="65" y="35" textAnchor="middle" fontFamily="Caveat" fontSize="18" fill="#1E40AF" fontWeight="bold">Replica DB</text>
          <text x="65" y="55" textAnchor="middle" fontFamily="Caveat" fontSize="14" fill="#1E40AF">Read Only</text>
        </g>
        {/* Sync Arrow */}
        <path d="M 165 180 L 165 260" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 160 210 L 165 220 L 170 210" fill="none" stroke="#94A3B8" strokeWidth="2" />
        
        {/* API Gateway */}
        <g transform="translate(330, 180)">
          <polygon points="70,0 140,40 70,80 0,40" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
          <text x="70" y="46" textAnchor="middle" fontFamily="Caveat" fontSize="18" fill="#5B21B6" fontWeight="bold">API Gateway</text>
        </g>

        {/* Worker */}
        <g transform="translate(560, 180)">
          <rect width="140" height="80" rx="6" fill="none" stroke="#10B981" strokeWidth="2.5" />
          <text x="70" y="35" textAnchor="middle" fontFamily="Caveat" fontSize="18" fill="#065F46" fontWeight="bold">Queue Worker</text>
          <text x="70" y="55" textAnchor="middle" fontFamily="Caveat" fontSize="14" fill="#065F46">Redis Sub</text>
        </g>

        {/* Connections */}
        <path d="M 230 140 C 290 140, 270 200, 330 200" fill="none" stroke="#2563EB" strokeWidth="2" />
        <path d="M 470 220 C 510 220, 520 220, 560 220" fill="none" stroke="#8B5CF6" strokeWidth="2" />
        
        {/* Sticky Note */}
        <g transform="translate(480, 60) rotate(5)">
          <rect width="110" height="90" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.2" />
          <text x="10" y="30" fontFamily="Caveat" fontSize="16" fill="#854D0E">Sync latency</text>
          <text x="10" y="50" fontFamily="Caveat" fontSize="16" fill="#854D0E">must be &lt; 50ms</text>
        </g>
      </svg>
    )
  },
  {
    title: "Product Roadmap",
    theme: "dark",
    bg: "bg-[#181922]",
    svg: (
      <svg viewBox="0 0 800 450" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Grid dots for dark canvas */}
        <defs>
          <pattern id="dark-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#334155" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dark-grid)" />
        
        <text x="400" y="45" textAnchor="middle" fontFamily="Caveat" fontSize="28" fontWeight="bold" fill="#F8FAFC">Product Roadmap</text>

        {/* Q1 Research */}
        <g transform="translate(50, 110)">
          <rect width="130" height="75" rx="6" fill="none" stroke="#10B981" strokeWidth="2.5" />
          <text x="65" y="35" textAnchor="middle" fontFamily="Caveat" fontSize="18" fill="#34D399" fontWeight="bold">Q1 Research</text>
          <text x="65" y="55" textAnchor="middle" fontFamily="Caveat" fontSize="12" fill="#A7F3D0">Competitor Audit</text>
        </g>

        {/* Connector */}
        <path d="M 180 147 L 230 147" fill="none" stroke="#34D399" strokeWidth="2" strokeDasharray="3 3" />

        {/* MVP Build */}
        <g transform="translate(230, 110)">
          <rect width="130" height="75" rx="6" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
          <text x="65" y="35" textAnchor="middle" fontFamily="Caveat" fontSize="18" fill="#60A5FA" fontWeight="bold">MVP Build</text>
          <text x="65" y="55" textAnchor="middle" fontFamily="Caveat" fontSize="12" fill="#BFDBFE">Core Features</text>
        </g>

        {/* Connector */}
        <path d="M 360 147 L 410 147" fill="none" stroke="#60A5FA" strokeWidth="2" />

        {/* Q2 Beta */}
        <g transform="translate(410, 110)">
          <rect width="130" height="75" rx="6" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
          <text x="65" y="35" textAnchor="middle" fontFamily="Caveat" fontSize="18" fill="#A78BFA" fontWeight="bold">Q2 Beta</text>
          <text x="65" y="55" textAnchor="middle" fontFamily="Caveat" fontSize="12" fill="#DDD6FE">Beta Testers</text>
        </g>

        {/* Connector */}
        <path d="M 540 147 L 590 147" fill="none" stroke="#A78BFA" strokeWidth="2" />

        {/* Q3 Launch */}
        <g transform="translate(590, 110)">
          <rect width="140" height="75" rx="6" fill="none" stroke="#EC4899" strokeWidth="2.5" />
          <text x="70" y="35" textAnchor="middle" fontFamily="Caveat" fontSize="18" fill="#F472B6" fontWeight="bold">Q3 Launch</text>
          <text x="70" y="55" textAnchor="middle" fontFamily="Caveat" fontSize="12" fill="#FBCFE8">Public Release</text>
        </g>

        {/* Sticky Note: Ideas */}
        <g transform="translate(200, 240) rotate(-3)">
          <rect width="150" height="120" fill="#312E81" stroke="#4F46E5" strokeWidth="1.5" />
          <text x="15" y="30" fontFamily="Caveat" fontSize="18" fill="#E0E7FF" fontWeight="bold">Ideas Shelf</text>
          <text x="15" y="55" fontFamily="Caveat" fontSize="14" fill="#C7D2FE">• Realtime sync</text>
          <text x="15" y="75" fontFamily="Caveat" fontSize="14" fill="#C7D2FE">• Templates support</text>
          <text x="15" y="95" fontFamily="Caveat" fontSize="14" fill="#C7D2FE">• Plugin extension</text>
        </g>

        {/* Sticky Note: Feedback */}
        <g transform="translate(440, 240) rotate(4)">
          <rect width="150" height="110" fill="#064E3B" stroke="#059669" strokeWidth="1.5" />
          <text x="15" y="30" fontFamily="Caveat" fontSize="18" fill="#D1FAE5" fontWeight="bold">Requirements</text>
          <text x="15" y="55" fontFamily="Caveat" fontSize="14" fill="#A7F3D0">• User interviews</text>
          <text x="15" y="75" fontFamily="Caveat" fontSize="14" fill="#A7F3D0">• Competitor analysis</text>
        </g>
      </svg>
    )
  },
  {
    title: "User Journey Wireframe",
    theme: "light",
    bg: "bg-[#F8FAFC]",
    svg: (
      <svg viewBox="0 0 800 450" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <text x="400" y="45" textAnchor="middle" fontFamily="Caveat" fontSize="28" fontWeight="bold" fill="#1E293B">User Flow Whiteboard</text>
        
        {/* Landing Page */}
        <g transform="translate(100, 150)">
          <rect width="130" height="80" rx="4" fill="none" stroke="#475569" strokeWidth="2.5" />
          <line x1="10" y1="20" x2="60" y2="20" stroke="#94A3B8" strokeWidth="2" />
          <rect x="10" y="35" width="110" height="35" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="65" y="56" textAnchor="middle" fontFamily="Caveat" fontSize="14" fill="#64748B">Landing Page</text>
        </g>

        {/* Arrow */}
        <path d="M 230 190 L 300 190" fill="none" stroke="#475569" strokeWidth="2" />
        <path d="M 290 185 L 300 190 L 290 195" fill="none" stroke="#475569" strokeWidth="2" />

        {/* Action Decision */}
        <g transform="translate(300, 150)">
          <polygon points="65,0 130,40 65,80 0,40" fill="none" stroke="#EA580C" strokeWidth="2.5" />
          <text x="65" y="46" textAnchor="middle" fontFamily="Caveat" fontSize="18" fill="#C2410C" fontWeight="bold">Signup?</text>
        </g>

        {/* Yes Path */}
        <path d="M 430 190 L 500 190" fill="none" stroke="#16A34A" strokeWidth="2" />
        <path d="M 490 185 L 500 190 L 490 195" fill="none" stroke="#16A34A" strokeWidth="2" />
        <text x="465" y="180" fontFamily="Caveat" fontSize="16" fill="#16A34A" fontWeight="bold">Yes</text>

        {/* No Path */}
        <path d="M 365 230 L 365 300 L 500 300" fill="none" stroke="#DC2626" strokeWidth="2" />
        <path d="M 490 295 L 500 300 L 490 305" fill="none" stroke="#DC2626" strokeWidth="2" />
        <text x="375" y="260" fontFamily="Caveat" fontSize="16" fill="#DC2626" fontWeight="bold">No</text>

        {/* Canvas Dashboard */}
        <g transform="translate(500, 150)">
          <rect width="130" height="80" rx="4" fill="none" stroke="#16A34A" strokeWidth="2.5" />
          <text x="65" y="45" textAnchor="middle" fontFamily="Caveat" fontSize="18" fill="#15803D" fontWeight="bold">Dashboard</text>
        </g>

        {/* Exit page */}
        <g transform="translate(500, 260)">
          <rect width="130" height="80" rx="4" fill="none" stroke="#DC2626" strokeWidth="2.5" />
          <text x="65" y="45" textAnchor="middle" fontFamily="Caveat" fontSize="18" fill="#B91C1C" fontWeight="bold">Exit Screen</text>
        </g>
      </svg>
    )
  }
];

export default function LiveDemo() {
  const [active, setActive] = useState(1);

  const prev = () => setActive((a) => (a === 0 ? slides.length - 1 : a - 1));
  const next = () => setActive((a) => (a === slides.length - 1 ? 0 : a + 1));

  const leftIndex = active === 0 ? slides.length - 1 : active - 1;
  const rightIndex = active === slides.length - 1 ? 0 : active + 1;

  return (
    <LazySection>
      <section id="demo" className="bg-slate-50 py-24 md:py-32 border-b border-slate-100 transition-colors">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <GsapReveal direction="up" distance={30} triggerHook="top 85%">
          <div className="mb-16 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-600 border border-indigo-100 uppercase tracking-wider">
              See it in action
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Live demo
            </h2>
          </div>

          {/* Carousel Layout */}
          <div className="relative flex items-center justify-center w-full">
            {/* Left Preview Slide (Tactile Peeking) */}
            <div className="hidden lg:block w-[180px] shrink-0 opacity-20 border border-slate-200 rounded-2xl overflow-hidden shadow-sm aspect-[16/10] transform scale-90 -translate-x-12 select-none pointer-events-none transition-all duration-500 bg-[#F8FAFC]">
              <div className="h-full w-full pointer-events-none p-1">
                {slides[leftIndex].svg}
              </div>
            </div>

            {/* Main Interactive Active Slide */}
            <div className="relative w-full max-w-4xl z-10 mx-auto transition-all duration-500 group">
              {/* Glowing Border effect on main demo container */}
              <div className="absolute -inset-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-[1.8rem] opacity-30 blur-[8px] group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute -inset-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-[1.8rem] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative overflow-hidden rounded-3xl border border-white bg-white shadow-xl">
                {/* Browser Top bar control */}
                <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 rounded-full bg-[#EF4444]/90" />
                    <div className="h-3.5 w-3.5 rounded-full bg-[#F59E0B]/90" />
                    <div className="h-3.5 w-3.5 rounded-full bg-[#10B981]/90" />
                  </div>
                  <div className="h-6 w-56 rounded-md bg-white border border-slate-200/50 text-center text-[11px] text-slate-500 flex items-center justify-center font-medium shadow-sm">
                    excelidraw.com/demo/{slides[active].title.toLowerCase().replace(/\s+/g, "-")}
                  </div>
                  <Link
                    href="/canvas/guest"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md hover:brightness-110 transition-all active:scale-[0.97]"
                  >
                    Try Demo
                    <Zap className="h-3 w-3 fill-white" />
                  </Link>
                </div>

                {/* Simulated Whiteboard Viewport */}
                <div className={cn("relative aspect-[16/10] w-full transition-colors duration-300", slides[active].bg)}>
                  <div className="absolute inset-0 p-4 flex items-center justify-center">
                    {slides[active].svg}
                  </div>
                </div>
              </div>

              {/* Slider Prev Chevrons */}
              <button
                onClick={prev}
                className="absolute left-[-24px] top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 shadow-lg hover:bg-slate-50 hover:text-indigo-600 hover:scale-105 transition-all active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Slider Next Chevrons */}
              <button
                onClick={next}
                className="absolute right-[-24px] top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 shadow-lg hover:bg-slate-50 hover:text-indigo-600 hover:scale-105 transition-all active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Right Preview Slide */}
            <div className="hidden lg:block w-[180px] shrink-0 opacity-20 border border-slate-200 rounded-2xl overflow-hidden shadow-sm aspect-[16/10] transform scale-90 translate-x-12 select-none pointer-events-none transition-all duration-500 bg-[#F8FAFC]">
              <div className="h-full w-full pointer-events-none p-1">
                {slides[rightIndex].svg}
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="mt-12 flex justify-center gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  i === active ? "w-8 bg-indigo-600 shadow-md shadow-indigo-600/30" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          </GsapReveal>
        </div>
      </section>
    </LazySection>
  );
}

