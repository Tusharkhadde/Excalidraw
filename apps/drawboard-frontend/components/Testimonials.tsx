import { LazySection } from "@/components/ui/lazy-section";
import { GsapReveal } from "@/components/ui/gsap-reveal";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Senior Product Designer",
    company: "DesignCo",
    image: "https://i.pravatar.cc/150?u=alex",
    content: "This whiteboard tool completely transformed our remote brainstorming sessions. The latency is practically zero, and the interface stays out of your way.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Engineering Manager",
    company: "TechFlow",
    image: "https://i.pravatar.cc/150?u=sarah",
    content: "We moved away from heavier tools because this is just so fast. No login walls, no bloated features. Just instant, collaborative drawing when we need it.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Freelance Architect",
    company: "Studio MJ",
    image: "https://i.pravatar.cc/150?u=marcus",
    content: "I use this to quickly sketch out system architectures with clients over Zoom. It's incredibly intuitive and the clean aesthetic makes me look professional.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <LazySection>
      <section id="testimonials" className="relative py-24 md:py-32 bg-slate-50 overflow-hidden border-t border-slate-200">
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <GsapReveal direction="up" distance={20}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Loved by teams worldwide
              </h2>
            </GsapReveal>
            <GsapReveal direction="up" distance={20} delay={0.1}>
              <p className="text-lg text-slate-600">
                Don&apos;t just take our word for it. Here&apos;s what professionals have to say about their experience.
              </p>
            </GsapReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GsapReveal stagger="children" staggerAmount={0.3} direction="up" distance={40}>
              {testimonials.map((t, i) => (
                <div key={i} className="group relative">
                  {/* Consistent Glowing Border */}
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-[1.6rem] blur-[4px] opacity-0 group-hover:opacity-100 transition duration-500" />
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-[1.6rem] opacity-0 group-hover:opacity-20 transition duration-500" />
                  
                  <div className="relative h-full flex flex-col p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:-translate-y-0.5 transition-all duration-300">
                    
                    <div className="flex items-center gap-1 mb-6 text-amber-400">
                      {[...Array(t.rating)].map((_, idx) => (
                        <Star key={idx} className="w-5 h-5 fill-current" />
                      ))}
                    </div>

                    <Quote className="absolute top-8 right-8 w-10 h-10 text-slate-100 -z-10 group-hover:text-indigo-50 transition-colors" />

                    <p className="text-slate-700 leading-relaxed mb-8 flex-grow">
                      &ldquo;{t.content}&rdquo;
                    </p>

                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                        <p className="text-slate-500 text-xs">{t.role} @ {t.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </GsapReveal>
          </div>
        </div>
      </section>
    </LazySection>
  );
}
