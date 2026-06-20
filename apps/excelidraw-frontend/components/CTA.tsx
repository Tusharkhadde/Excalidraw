import Link from "next/link";
import { ArrowRight, Server, Zap } from "lucide-react";
import { LazySection } from "@/components/ui/lazy-section";

export default function CTA() {
  return (
    <LazySection>
      <section className="relative bg-white dark:bg-slate-900 py-24 md:py-36 overflow-hidden transition-colors border-b border-slate-100 dark:border-slate-900">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        {/* Hand-drawn loop arrow (Left) */}
        <div className="absolute left-[8%] bottom-[15%] w-32 h-32 hidden lg:block text-indigo-400 dark:text-indigo-600/50 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
            <path d="M 20 80 C 15 50, 45 20, 60 50 C 70 70, 40 85, 30 65 C 20 45, 60 30, 85 45" />
            <path d="M 75 35 L 85 45 L 73 52" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Hand-drawn pencil with starbursts (Right) */}
        <div className="absolute right-[8%] bottom-[12%] w-36 h-36 hidden lg:block text-indigo-500 dark:text-indigo-400/40 pointer-events-none select-none">
          <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            {/* Spark lines */}
            <path d="M 15 80 L 5 85" strokeWidth="1.5" />
            <path d="M 18 95 L 8 105" strokeWidth="1.5" />
            <path d="M 30 106 L 25 116" strokeWidth="1.5" />
            <path d="M 12 70 C 10 75, 5 78, 2 82" strokeWidth="1.5" />
            
            {/* Pencil barrel */}
            <g transform="translate(30, 15) rotate(45)">
              <rect x="0" y="0" width="14" height="70" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
              <polygon points="0,70 7,85 14,70" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 5,80 L 7,85 L 9,80" fill="currentColor" />
            </g>
          </svg>
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Ready to bring your ideas to life?
            </h2>
            <p className="max-w-xl mx-auto text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              Start a room now and experience seamless real-time collaboration.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110 active:scale-[0.98]"
            >
              Start a Room
              <Zap className="h-4 w-4 fill-white text-white" />
            </Link>
            <Link
              href="#open-source"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-8 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-[0.98]"
            >
              <Server className="h-4 w-4 text-slate-400" />
              Explore Self-hosting
            </Link>
          </div>
        </div>
      </section>
    </LazySection>
  );
}

