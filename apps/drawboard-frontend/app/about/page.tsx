import type { Metadata } from "next";
import { Github, Heart, Pencil, Users } from "lucide-react";
import Link from "next/link";
import { MarketingCTA, MarketingShell, PageHero } from "@/components/Marketing";
import { BoardPreview } from "@/components/BoardPreview";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "About", description: "A simpler space to think, sketch, and create together." };

const values = [
  { icon: Pencil, title: "Simple by intention", text: "Useful tools, a quiet interface, and fewer things between you and your next idea.", tone: "bg-lavender text-primary" },
  { icon: Users, title: "Together is better", text: "A shared canvas makes it easier to explain, ask questions, and find a way forward.", tone: "bg-peach text-orange-700" },
  { icon: Heart, title: "Room for everyone", text: "You don't need to be a designer. If you can imagine it, you can start sketching it.", tone: "bg-mint text-emerald-700" },
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="A little about us"
        title={
          <>
            Great things start
            <br />
            <em>with a shared idea.</em>
          </>
        }
        description="We believe the best thinking happens when everyone has a little room to contribute. Drawboard is that room."
      />

      <section className="container grid items-center gap-14 pb-24 lg:grid-cols-2">
        <BoardPreview className="rotate-1" />
        <div>
          <span className="eyebrow">Why Drawboard exists</span>
          <h2 className="display mt-4 text-4xl">
            Make thinking visible.
            <br />
            <em>Make creating simple.</em>
          </h2>
          <p className="prose-muted mt-6">Some ideas are too big for a message and too early for a presentation. They need a space to be messy, to change, and to become something better.</p>
          <p className="prose-muted mt-4">
            That’s what we’re building: an approachable whiteboard where a quick sketch can turn into a shared understanding. No complicated setup. No perfect lines. Just you, your team, and a
            little possibility.
          </p>
          <Button asChild variant="outline" className="mt-8">
            <Link href="https://github.com" target="_blank" rel="noreferrer">
              <Github /> Star us on GitHub
            </Link>
          </Button>
        </div>
      </section>

      <section className="border-y bg-muted/40 py-24">
        <div className="container">
          <span className="eyebrow">What we care about</span>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text, tone }) => (
              <Card key={title} className="p-7 shadow-none transition-shadow hover:shadow-soft">
                <div className={`grid size-11 place-items-center rounded-xl ${tone}`}>
                  <Icon size={20} />
                </div>
                <h3 className="mt-6 text-[17px] font-semibold tracking-tight">{title}</h3>
                <p className="prose-muted mt-2 text-sm">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-16">
        <MarketingCTA />
      </div>
    </MarketingShell>
  );
}
