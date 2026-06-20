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
    bgClass: "bg-blue-50 text-blue-600",
  },
  {
    icon: Shapes,
    title: "Rich Shape Toolkit",
    description:
      "Rectangles, circles, diamonds, arrows, freehand pencil, text, images and more. Everything you need to visualize ideas.",
    bgClass: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Link2,
    title: "Room-based Sharing",
    description:
      "Create a room, get a unique link and invite anyone. No sign-up required for your collaborators.",
    bgClass: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Sparkles,
    title: "Powerful Editing",
    description:
      "Select, drag, resize, rotate, undo/redo (50 levels), eraser, and more. Total control at your fingertips.",
    bgClass: "bg-amber-50 text-amber-500",
  },
  {
    icon: ZoomIn,
    title: "Zoom & Pan",
    description:
      "Zoom in for details or zoom out for the big picture. Smooth pan with infinite canvas.",
    bgClass: "bg-sky-50 text-sky-600",
  },
  {
    icon: Moon,
    title: "Always Accessible",
    description:
      "Available whenever you need it. Access your drawings from any device without installing apps.",
    bgClass: "bg-violet-50 text-violet-600",
  },
];

export default function Features() {
  return (
    <LazySection>
      <section id="features" className="bg-slate-50 py-24 md:py-32 border-b border-slate-100 transition-colors">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-600 border border-indigo-100 uppercase tracking-wider">
              Powerful features
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
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
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-[4px] transition-opacity duration-500" />
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    
                    {/* Card Body */}
                    <div className="relative h-full rounded-[15px] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                      <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bgClass} shadow-inner transition-transform group-hover:scale-110`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-3 text-lg font-bold text-slate-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-500">
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

