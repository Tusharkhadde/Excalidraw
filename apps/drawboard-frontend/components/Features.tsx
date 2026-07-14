import { LazySection } from "@/components/ui/lazy-section";
import { GsapReveal } from "@/components/ui/gsap-reveal";
import {
  Users,
  Shapes,
  Link2,
  Sparkles,
  ZoomIn,
  Moon,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Draw together with your team in real time. See everyone's cursor, actions and changes instantly.",
    bgClass: "bg-black text-white",
  },
  {
    icon: Shapes,
    title: "Rich Shape Toolkit",
    description:
      "Rectangles, circles, diamonds, arrows, freehand pencil, text, images and more. Everything you need to visualize ideas.",
    bgClass: "bg-neutral-100 text-black",
  },
  {
    icon: Link2,
    title: "Room-based Sharing",
    description:
      "Create a room, get a unique link and invite anyone. No sign-up required for your collaborators.",
    bgClass: "bg-neutral-100 text-black",
  },
  {
    icon: Sparkles,
    title: "Powerful Editing",
    description:
      "Select, drag, resize, rotate, undo/redo (50 levels), eraser, and more. Total control at your fingertips.",
    bgClass: "bg-neutral-100 text-black",
  },
  {
    icon: ZoomIn,
    title: "Zoom & Pan",
    description:
      "Zoom in for details or zoom out for the big picture. Smooth pan with infinite canvas.",
    bgClass: "bg-neutral-100 text-black",
  },
  {
    icon: Moon,
    title: "Always Accessible",
    description:
      "Available whenever you need it. Access your drawings from any device without installing apps.",
    bgClass: "bg-neutral-100 text-black",
  },
];

export default function Features() {
  return (
    <LazySection>
      <section id="features" className="border-b border-black/10 bg-neutral-50 py-24 transition-colors md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-black">
              Powerful features
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
              Everything you need on a modern whiteboard
            </h2>
          </div>

          <GsapReveal stagger="children" staggerAmount={0.12} direction="up" distance={40} triggerHook="top 85%">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="group relative">
                    {/* Glowing border effect */}
                    <div className="absolute -inset-px rounded-2xl bg-black opacity-0 blur-[4px] transition-opacity duration-500 group-hover:opacity-10" />
                    
                    {/* Card Body */}
                    <div className="relative h-full rounded-2xl border border-black/10 bg-white p-7 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-black/30">
                      <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bgClass} shadow-inner transition-transform group-hover:scale-110`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-black">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GsapReveal>
        </div>
      </section>
    </LazySection>
  );
}

