import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Excelidraw — Collaborative Whiteboarding",
  description: "Create, collaborate, and share beautiful diagrams and sketches in real-time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-inter antialiased bg-void text-snow min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
