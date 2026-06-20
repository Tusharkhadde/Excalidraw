import { LazySection } from "@/components/ui/lazy-section";
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
    bgClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  },
  {
    icon: Shapes,
    title: "Rich Shape Toolkit",
    description:
      "Rectangles, circles, diamonds, arrows, freehand pencil, text, images and more. Everything you need to visualize ideas.",
    bgClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",
  },
  {
    icon: Link2,
    title: "Room-based Sharing",
    description:
      "Create a room, get a unique link and invite anyone. No sign-up required for your collaborators.",
    bgClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  {
    icon: Sparkles,
    title: "Powerful Editing",
    description:
      "Select, drag, resize, rotate, undo/redo (50 levels), eraser, and more. Total control at your fingertips.",
    bgClass: "bg-amber-50 text-amber-500 dark:bg-amber-950/30 dark:text-amber-400",
  },
  {
    icon: ZoomIn,
    title: "Zoom & Pan",
    description:
      "Zoom in for details or zoom out for the big picture. Smooth pan with infinite canvas.",
    bgClass: "bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description:
      "Easy on the eyes. Switch to dark mode and keep your creativity flowing day or night.",
    bgClass: "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
  },
];

export default function Features() {
  return (
    <LazySection>
      <section id="features" className="bg-slate-50 dark:bg-slate-950 py-24 md:py-32 border-b border-slate-100 dark:border-slate-900 transition-colors">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 uppercase tracking-wider">
              Powerful features
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything you need on a modern whiteboard
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bgClass} shadow-inner transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </LazySection>
  );
}

