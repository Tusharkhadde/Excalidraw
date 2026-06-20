import { Star, ExternalLink } from "lucide-react";
import { LazySection } from "@/components/ui/lazy-section";
import { GsapReveal } from "@/components/ui/gsap-reveal";

const contributors = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80",
];

export default function OpenSource() {
  return (
    <LazySection>
      <section id="open-source" className="bg-slate-50 dark:bg-slate-950 py-24 md:py-32 border-b border-slate-100 dark:border-slate-900 transition-colors">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <GsapReveal direction="up" distance={30} triggerHook="top 85%">
          <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] border border-white/5 shadow-2xl p-8 md:p-14">
            {/* Grid background effect */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <div className="absolute -bottom-1/2 -right-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
              {/* Left Details */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 shadow-lg text-white">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-extrabold text-white">
                    Open source by <span className="text-red-500">❤️</span>
                  </h3>
                  <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                    Excelidraw is 100% open source and built for the community.
                    Star us on GitHub and help us build the best whiteboard for everyone.
                  </p>
                  
                  {/* Contributors overlap list */}
                  <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                    <div className="flex -space-x-2.5">
                      {contributors.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`Contributor ${i + 1}`}
                          className="h-7 w-7 rounded-full border-2 border-[#0F172A] object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      and 300+ contributors
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Stats & CTA */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-6 lg:border-l lg:border-white/10 lg:pl-10 shrink-0 w-full lg:w-auto">
                <div className="text-center sm:text-left lg:text-center space-y-1">
                  <div className="flex items-center justify-center lg:justify-center gap-1.5 text-3xl font-extrabold text-white">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <span>5.3k+</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    GitHub Stars
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto lg:w-44">
                  <a
                    href="https://github.com/excalidraw/excalidraw"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 shadow-md transition-all active:scale-[0.98] w-full"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Star on GitHub
                  </a>
                  <a
                    href="https://github.com/excalidraw/excalidraw"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all active:scale-[0.98] w-full"
                  >
                    View on GitHub
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          </GsapReveal>
        </div>
      </section>
    </LazySection>
  );
}

