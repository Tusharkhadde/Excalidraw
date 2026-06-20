"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Users, Globe, Shield, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero */}
        <section className="py-20">
          <div className="mx-auto max-w-[1200px] px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 shadow-sm mb-8">
              About Excelidraw
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              We believe drawing
              <br />
              should be{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                collaborative
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-500 mb-10">
              Excelidraw was built to make real-time collaboration simple and accessible.
              No downloads, no accounts required — just open and draw together.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-16">
              Our Values
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaboration First</h3>
                <p className="text-sm text-gray-500">
                  Built for teams who work together, with real-time sync and multiplayer editing.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Accessible</h3>
                <p className="text-sm text-gray-500">
                  Works in any browser, on any device. No downloads or installations needed.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Simple & Secure</h3>
                <p className="text-sm text-gray-500">
                  Clean interface, powerful features. Your data stays private and secure.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600 mb-4">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Made with Love</h3>
                <p className="text-sm text-gray-500">
                  Crafted with care for designers, developers, and creative teams everywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-[1200px] px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              Join thousands of teams who use Excelidraw every day.
            </p>
            <Link
              href="/canvas/guest"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-all"
            >
              Start Drawing Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
