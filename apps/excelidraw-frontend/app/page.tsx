"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@repo/ui/button";
import { LogOut, Plus, ExternalLink, Copy, Check, Pen, Users, Zap, ArrowRight, Shield, Sparkles } from "lucide-react";

interface Room {
  id: number;
  slug: string;
  adminId: string;
  createdAt: string;
}

export default function HomePage() {
  const router = useRouter();
  const { user, token, isLoading, signout } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState("");

  const [newSlug, setNewSlug] = useState("");
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [joinInput, setJoinInput] = useState("");
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    if (!isLoading && !token) {
      // stay on landing page
    }
  }, [isLoading, token]);

  useEffect(() => {
    if (!token) return;
    setRoomsLoading(true);
    setRoomsError("");
    api.get<Room[]>("/rooms")
      .then(setRooms)
      .catch((e) => setRoomsError(e instanceof ApiError ? e.message : "Failed to load rooms"))
      .finally(() => setRoomsLoading(false));
  }, [token]);

  async function handleCreateRoom() {
    if (!token) { router.push("/signin"); return; }
    const slug = newSlug.trim().toLowerCase().replace(/\s+/g, "-");
    if (slug.length < 3) { setCreateError("Slug must be at least 3 characters"); return; }
    if (!/^[a-z0-9-]+$/.test(slug)) { setCreateError("Only lowercase letters, numbers, and dashes"); return; }

    setIsCreating(true);
    setCreateError("");
    try {
      const room = await api.post<{ id: number; slug: string }>("/room", { slug });
      router.push(`/canvas/${room.id}`);
    } catch (e) {
      setCreateError(e instanceof ApiError ? e.message : "Failed to create room");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleJoinRoom() {
    if (!token) { router.push("/signin"); return; }
    const raw = joinInput.trim();
    if (!raw) { setJoinError("Enter a room ID or slug"); return; }

    setJoinError("");
    if (/^\d+$/.test(raw)) {
      router.push(`/canvas/${raw}`);
    } else {
      try {
        const room = await api.get<{ id: number }>(`/room/${raw}`);
        router.push(`/canvas/${room.id}`);
      } catch (e) {
        setJoinError(e instanceof ApiError ? e.message : "Room not found");
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-graphite-500 border-t-ash-50" />
          <span className="c1-footer-copy">© 2026 Excelidraw</span>
        </div>
      </div>
    );
  }

  // â”€â”€ Landing (not signed in) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (!token) {
    return (
      <div className="min-h-screen bg-void text-snow">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-graphite-600/50 bg-void/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 h-14">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <Pen className="h-5 w-5 text-ember-red" />
                <span className="text-base font-semibold tracking-tight">Excelidraw</span>
              </div>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/signin" className="ghost-link text-sm">Sign in</Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
              <Link href="/canvas/guest">
                <Button variant="secondary" size="sm" className="gap-1.5">
                  <Pen className="h-3.5 w-3.5" />
                  Try as Guest
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="c1-hero">
          <div className="c1-hero-orb c1-hero-orb-left" />
          <div className="c1-hero-orb c1-hero-orb-right" />
          <div className="c1-hero-grid" />
          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-56px)] max-w-[1200px] items-center px-4 py-24 text-center">
            <div className="c1-hero-inner">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-500 mb-8 animate-enter animate-enter-d1">
              <Sparkles className="h-3 w-3 text-sky-signal" />
              Real-time collaborative whiteboarding
              </div>
              <h1 className="c1-hero-title animate-enter animate-enter-d2">
                Draw Together,
                <br />
                <span>From Anywhere</span>
              </h1>
              <p className="c1-hero-copy animate-enter animate-enter-d3">
                Create beautiful diagrams, flowcharts, and sketches in real-time with your team. No setup required.
              </p>
              <div className="flex items-center justify-center gap-4 animate-enter animate-enter-d4">
                <Link href="/signup">
                  <Button variant="primary" size="lg" className="gap-2">
                    Start Drawing Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button variant="tertiary" size="lg">Sign In</Button>
                </Link>
                <Link href="/canvas/guest">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <Pen className="h-4 w-4" />
                    Try as Guest
                  </Button>
                </Link>
              </div>
              <div className="mt-12 flex items-center justify-center gap-8 text-xs text-slate-500 animate-enter animate-enter-d5">
                <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-mint-signal" /> End-to-end encrypted</span>
                <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-sky-signal" /> Real-time sync</span>
                <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-ember-red" /> Unlimited collaborators</span>
              </div>
              <div className="c1-hero-preview animate-enter animate-enter-d6">
                <div className="c1-preview-toolbar">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="c1-preview-canvas">
                  <div className="c1-preview-note c1-preview-note-a">Wireframe</div>
                  <div className="c1-preview-note c1-preview-note-b">Flow</div>
                  <div className="c1-preview-note c1-preview-note-c">Review</div>
                  <div className="c1-preview-line c1-preview-line-a" />
                  <div className="c1-preview-line c1-preview-line-b" />
                  <div className="c1-preview-line c1-preview-line-c" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <CoreFeaturesSection />

        {/* CTA */}
        <section className="c1-cta">
          <div className="mx-auto max-w-[1200px] px-4 text-center">
            <h2 className="c1-cta-title">
              Ready to start drawing?
            </h2>
            <p className="c1-cta-copy">
              Join thousands of teams who use Excelidraw to bring their ideas to life.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="gap-2 c1-cta-button">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/canvas/guest">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Pen className="h-4 w-4" />
                  Try as Guest
                </Button>
              </Link>
            </div>
            <p className="c1-cta-note">No credit card required. Free forever. Guest drawings are not saved.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="c1-footer">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4">
            <span className="c1-footer-copy">© 2026 Excelidraw</span>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/signin" className="c1-footer-link">Sign in</Link>
              <Link href="/signup" className="c1-footer-link">Sign up</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // â”€â”€ Dashboard (signed in) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="min-h-screen bg-void">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-graphite-600/50 bg-void/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-2">
            <Pen className="h-5 w-5 text-ember-red" />
            <span className="text-base font-semibold tracking-tight">Excelidraw</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-200">{user?.name ?? user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signout} className="gap-1.5 text-slate-300 hover:text-ember-red">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-heading font-semibold tracking-heading text-snow mb-2">Dashboard</h1>
          <p className="text-body text-slate-200">Manage your whiteboards and collaborate with your team.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Create room */}
          <section className="card-raycast p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-snow mb-1">
              <Plus className="h-4 w-4 text-sky-signal" /> Create a Room
            </h2>
            <p className="text-sm text-slate-300 mb-4">Pick a unique slug for your whiteboard room.</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="my-room-slug"
                className="input-raycast flex-1"
              />
              <Button variant="primary" onClick={handleCreateRoom} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create & Open"}
              </Button>
            </div>
            {createError && <p className="mt-2 text-xs text-ember-red">{createError}</p>}
          </section>

          {/* Join room */}
          <section className="card-raycast p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-snow mb-1">
              <ExternalLink className="h-4 w-4 text-mint-signal" /> Join a Room
            </h2>
            <p className="text-sm text-slate-300 mb-4">Enter a room ID or slug to join an existing whiteboard.</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                placeholder="room-id or room-slug"
                className="input-raycast flex-1"
              />
              <Button variant="primary" onClick={handleJoinRoom}>Join</Button>
            </div>
            {joinError && <p className="mt-2 text-xs text-ember-red">{joinError}</p>}
          </section>
        </div>

        {/* Recent rooms */}
        <section>
          <h2 className="text-base font-semibold text-snow mb-4">Your Rooms</h2>

          {roomsLoading && (
            <div className="flex items-center gap-3 py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-graphite-500 border-t-ash-50" />
              <span className="c1-footer-copy">© 2026 Excelidraw</span>
            </div>
          )}
          {roomsError && <p className="text-sm text-ember-red">{roomsError}</p>}

          {!roomsLoading && !roomsError && rooms.length === 0 && (
            <div className="card-raycast p-12 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-graphite-600 mb-4">
                <Pen className="h-6 w-6 text-slate-200" />
              </div>
              <p className="text-sm text-slate-200 font-medium mb-1">No rooms yet</p>
              <p className="text-xs text-slate-300">Create one above to get started.</p>
            </div>
          )}

          {rooms.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function CoreFeaturesSection() {
  return (
    <section className="c1-shell">
      <div className="c1-container">
        <div>
          <p className="c1-badge">Core Features</p>
          <h2 className="c1-title">Built for Speed &amp; Quality</h2>
          <p className="c1-subtitle">
            Everything you need to go
            <br />
            from idea to image
          </p>
        </div>

        <div className="c1-grid">
          <article className="c1-card c1-card-1">
            <div className="c1-prompt-box">
              A bright, high-resolution 3D illustration of a{" "}
              <span className="c1-blur-text">cheerful cartoon</span> of a{" "}
              <span className="c1-blur-text">girl character</span>{" "}
              <span className="c1-blur-text">centred against a</span> smooth blue background
            </div>
            <div className="c1-details-pill">
              <span className="c1-sparkle">âœ¦</span>
              <span>Add more details</span>
            </div>
            <svg className="c1-cursor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 2L20 11L11 13L9 22L4 2Z" />
            </svg>
            <h3>Smart Prompt Suggestions</h3>
          </article>

          <article className="c1-card c1-card-2">
            <div className="c1-api-visual">
              <Image
                className="c1-network-img"
                src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/network.svg"
                alt="API access network illustration"
                width={320}
                height={180}
              />
            </div>
            <h3>API Access</h3>
          </article>

          <article className="c1-card c1-card-3">
            <div className="c1-mesh" aria-hidden="true" />
            <Image
              className="c1-folder"
              src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/library%20icon.svg"
              alt="Project library folder illustration"
              width={170}
              height={130}
            />
            <div className="c1-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Search in library</span>
            </div>
            <h3>Project Library</h3>
          </article>
        </div>
      </div>
    </section>
  );
}

function RoomCard({ room }: { room: Room }) {
  const [copied, setCopied] = useState(false);

  const roomUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/canvas/${room.id}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="card-raycast p-4 transition-all duration-200 hover:border-graphite-500 group">
      <div className="flex items-start justify-between">
        <div>
          <Link href={`/canvas/${room.id}`} className="font-medium text-sm text-snow hover:text-sky-signal transition-colors">
            {room.slug}
          </Link>
          <p className="mt-0.5 text-xs text-slate-300">
            Created {new Date(room.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={copyLink}
          className="rounded-lg p-1.5 text-slate-300 hover:bg-graphite-600 hover:text-snow transition-all"
          title="Copy room link"
        >
          {copied ? <Check className="h-4 w-4 text-mint-signal" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <Link
        href={`/canvas/${room.id}`}
        className="mt-3 inline-flex items-center gap-1 text-xs text-sky-signal hover:text-sky-signal/80 transition-colors"
      >
        Open Canvas <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  );
}


