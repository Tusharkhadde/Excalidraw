"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  ArrowRight,
  Users,
  Zap,
  Palette,
  Share2,
  Layers,
  MousePointer2,
  Download,
  Lock,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Work together seamlessly with live cursors, instant sync, and multiplayer editing. See changes as they happen.",
    color: "blue",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description:
      "No downloads, no installs. Open your browser and start drawing in seconds. Zero friction.",
    color: "yellow",
  },
  {
    icon: Palette,
    title: "Smart Drawing Tools",
    description:
      "Rectangle, circle, pencil, text, arrows, diamonds, and more. Everything you need to express your ideas.",
    color: "purple",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Share your boards with a simple link. Collaborate with anyone, anywhere in the world.",
    color: "green",
  },
  {
    icon: Layers,
    title: "Organized Rooms",
    description:
      "Create separate rooms for different projects. Keep your work organized and focused.",
    color: "indigo",
  },
  {
    icon: MousePointer2,
    title: "Intuitive Canvas",
    description:
      "Pan, zoom, and navigate with ease. An infinite canvas that grows with your ideas.",
    color: "pink",
  },
  {
    icon: Download,
    title: "Export & Save",
    description:
      "Download your creations as PNG or SVG. Save and share your work with the team.",
    color: "orange",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your data is encrypted and secure. Guest mode available for quick sessions.",
    color: "red",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description:
       "Desktop, tablet, or mobile. Drawboard works on any device with a modern browser.",
    color: "teal",
  },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
  pink: { bg: "bg-pink-100", text: "text-pink-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
  red: { bg: "bg-red-100", text: "text-red-600" },
  teal: { bg: "bg-teal-100", text: "text-teal-600" },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero */}
        <section className="py-20">
          <div className="mx-auto max-w-[1200px] px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 shadow-sm mb-8">
              Features
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Everything you need
              <br />
              to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                create together
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-500 mb-10">
              Powerful features designed for teams who want to brainstorm, plan,
              and create together in real-time.
            </p>
            <Link
              href="/canvas/guest"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-all"
            >
              Try It Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const colors = colorMap[feature.color];
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100/50"
                  >
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg} ${colors.text} mb-4`}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-[1200px] px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Ready to start creating?
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              Join thousands of teams who use Drawboard every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/canvas/guest"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-all"
              >
                Start Drawing Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
