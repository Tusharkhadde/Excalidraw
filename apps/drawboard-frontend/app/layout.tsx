import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Drawboard — Collaborative whiteboard for teams", template: "%s — Drawboard" },
  description: "Sketch, diagram, and think together in real time. A fast, minimal whiteboard with shared rooms, live cursors, and one-click export.",
  keywords: ["whiteboard", "collaboration", "diagram", "sketch", "real-time", "drawboard"],
  openGraph: {
    type: "website",
    siteName: "Drawboard",
    title: "Drawboard — Collaborative whiteboard for teams",
    description: "Sketch, diagram, and think together in real time.",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image", title: "Drawboard", description: "Sketch, diagram, and think together in real time." },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#111318" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={mono.variable}>
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
