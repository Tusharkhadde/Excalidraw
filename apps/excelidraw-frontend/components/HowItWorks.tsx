import { LazySection } from "@/components/ui/lazy-section";
import { GsapReveal } from "@/components/ui/gsap-reveal";

const steps = [
  {
    number: "01",
    title: "Create a room",
    description: "Initialize a secure whiteboard environment with a single click. No sign-up required for your guests.",
    color: "from-indigo-500 to-purple-500",
    shadowColor: "shadow-indigo-500/25",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    number: "02",
    title: "Share the link",
    description: "Distribute your unique session link. Access is instantly granted to anyone with the URL.",
    color: "from-emerald-400 to-teal-500",
    shadowColor: "shadow-emerald-500/25",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
    ),
  },
  {
    number: "03",
    title: "Draw together",
    description: "Collaborate in real-time. See cursors move and shapes appear instantly as your team creates.",
    color: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/25",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <LazySection>
      <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden bg-white border-y border-slate-100">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <GsapReveal direction="up" distance={20}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 shadow-sm mb-6">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-sm font-semibold text-slate-900 tracking-wide uppercase">Simple Process</span>
              </div>
            </GsapReveal>
            
            <GsapReveal direction="up" distance={20} delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
                From idea to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">collaboration</span> in seconds
              </h2>
            </GsapReveal>
            
            <GsapReveal direction="up" distance={20} delay={0.2}>
              <p className="text-lg text-slate-600 leading-relaxed">
                We've stripped away the complexity. No downloads, no mandatory accounts, just instant access to a shared canvas.
              </p>
            </GsapReveal>
          </div>

          <div className="relative mt-20">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[5.5rem] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent z-0" />

            <GsapReveal stagger="children" staggerAmount={0.3} direction="up" distance={40} triggerHook="top 80%" className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 relative z-10">
              {steps.map((step, index) => (
                <div key={step.number} className="group relative mt-6 md:mt-0">
                  
                  {/* Animated Gradient Border (Lighting) */}
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-100 blur-[4px] transition-opacity duration-500" />
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card Content */}
                  <div className="relative flex flex-col items-center text-center p-8 h-full bg-white rounded-3xl shadow-xl transition-transform duration-500 group-hover:-translate-y-1">
                    
                    {/* Number Indicator */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg border-4 border-white z-20 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:bg-indigo-600">
                      {step.number}
                    </div>

                    {/* Icon Container */}
                    <div className={`mt-8 mb-8 relative w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg ${step.shadowColor} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out z-10`}>
                      {step.icon}
                      {/* Glow effect behind icon */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                    </div>

                    <h3 className="mb-4 text-xl font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </GsapReveal>
          </div>

          {/* Prominent Action Button */}
          <GsapReveal direction="up" distance={20} delay={0.4}>
            <div className="mt-24 flex justify-center">
              <a href="#hero" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-slate-900 rounded-full overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-900/20 ring-4 ring-slate-900/10">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 group-hover:text-white transition-colors">Start Drawing Free</span>
                <svg className="relative z-10 w-6 h-6 group-hover:text-white group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </GsapReveal>
        </div>
      </section>
    </LazySection>
  );
}

