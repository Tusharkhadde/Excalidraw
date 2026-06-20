import { LazySection } from "@/components/ui/lazy-section";

const steps = [
  {
    number: "1",
    title: "Create a room",
    description: "Start a new whiteboard room in one click.",
    badgeClass: "bg-indigo-500 text-white shadow-indigo-500/20",
    illustration: (
      <svg className="w-16 h-16 text-indigo-500" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Room door illustration */}
        <rect x="12" y="10" width="40" height="48" rx="4" className="stroke-indigo-400 dark:stroke-indigo-600" />
        <line x1="12" y1="46" x2="52" y2="46" />
        <path d="M22 46V22a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v24" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="2.5" />
        <circle cx="36" cy="34" r="2.5" className="fill-indigo-600 dark:fill-indigo-400" />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Share the link",
    description: "Copy the link and share it with your team.",
    badgeClass: "bg-emerald-500 text-white shadow-emerald-500/20",
    illustration: (
      <svg className="w-16 h-16 text-emerald-500" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Chain link illustration */}
        <path d="M26 38a9 9 0 0 1 0-13l8-8a9 9 0 0 1 13 13l-4 4" className="stroke-emerald-400 dark:stroke-emerald-600" />
        <path d="M38 26a9 9 0 0 1 0 13l-8 8a9 9 0 0 1-13-13l4-4" className="stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Draw together",
    description: "Everyone joins instantly and you create in real time.",
    badgeClass: "bg-blue-500 text-white shadow-blue-500/20",
    illustration: (
      <svg className="w-16 h-16 text-blue-500" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Team users illustration */}
        <circle cx="20" cy="24" r="6" className="stroke-blue-400 dark:stroke-blue-600" />
        <path d="M10 44c0-5 6-7 10-7s10 2 10 7" className="stroke-blue-400 dark:stroke-blue-600" />
        <circle cx="44" cy="24" r="6" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="2.5" />
        <path d="M34 44c0-5 6-7 10-7s10 2 10 7" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="2.5" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <LazySection>
      <section id="how-it-works" className="bg-white dark:bg-slate-900 py-24 md:py-32 border-b border-slate-100 dark:border-slate-900 transition-colors">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 uppercase tracking-wider">
              Simple as 1-2-3
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              How it works
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col md:flex-row items-center w-full">
                {/* Step Card */}
                <div className="flex flex-col items-center text-center p-8 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm w-full md:max-w-sm relative group hover:shadow-md transition-all duration-300">
                  {/* Step Number Badge */}
                  <div className={`absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm shadow-lg ${step.badgeClass}`}>
                    {step.number}
                  </div>

                  <div className="mb-6 h-20 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                    {step.illustration}
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px]">
                    {step.description}
                  </p>
                </div>

                {/* Connector Arrow (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center px-4 text-indigo-500/40 w-full">
                    <svg width="40" height="24" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 5" className="animate-pulse">
                      <path d="M4 12h32" />
                      <path d="M30 6l6 6-6 6" strokeDasharray="none" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </LazySection>
  );
}

