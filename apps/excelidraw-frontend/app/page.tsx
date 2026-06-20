"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import LiveDemo from "@/components/LiveDemo";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import LandingFooter from "@/components/LandingFooter";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ExternalLink,
  Copy,
  Check,
  Pen,
} from "lucide-react";

interface Room {
  id: number;
  slug: string;
  adminId: string;
  createdAt: string;
}

function LandingHero() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <LiveDemo />
      <Testimonials />
      <CTA />
      <LandingFooter />
    </div>
  );
}

function Dashboard() {
  const router = useRouter();
  const { token, isLoading } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState("");

  const [newSlug, setNewSlug] = useState("");
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [joinInput, setJoinInput] = useState("");
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    if (!token) return;
    setRoomsLoading(true);
    setRoomsError("");
    api
      .get<Room[]>("/rooms")
      .then(setRooms)
      .catch((e) =>
        setRoomsError(e instanceof ApiError ? e.message : "Failed to load rooms")
      )
      .finally(() => setRoomsLoading(false));
  }, [token]);

  async function handleCreateRoom() {
    if (!token) {
      router.push("/signin");
      return;
    }
    const slug = newSlug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
    if (slug.length < 3) {
      setCreateError("Slug must be at least 3 characters");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setCreateError("Only lowercase letters, numbers, and dashes");
      return;
    }

    setIsCreating(true);
    setCreateError("");
    try {
      const room = await api.post<{ id: number; slug: string }>("/room", { slug });
      router.push(`/canvas/${room.id}`);
    } catch (e) {
      setCreateError(
        e instanceof ApiError ? e.message : "Failed to create room"
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleJoinRoom() {
    if (!token) {
      router.push("/signin");
      return;
    }
    const raw = joinInput.trim();
    if (!raw) {
      setJoinError("Enter a room ID or slug");
      return;
    }

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
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ff]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  // Landing (not signed in)
  if (!token) {
    return <LandingHero />;
  }

  // Dashboard (signed in)
  return (
    <div className="min-h-screen bg-[#f8f5ff]">
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-6 pt-28 pb-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-500">
            Manage your whiteboards and collaborate with your team.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-1">
              <Plus className="h-4 w-4 text-violet-600" /> Create a Room
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Pick a unique slug for your whiteboard room.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="my-room-slug"
                className="input-raycast flex-1"
              />
              <Button
                onClick={handleCreateRoom}
                disabled={isCreating}
                variant="primary"
              >
                {isCreating ? "Creating..." : "Create & Open"}
              </Button>
            </div>
            {createError && (
              <p className="mt-2 text-xs text-red-500">{createError}</p>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-1">
              <ExternalLink className="h-4 w-4 text-emerald-600" /> Join a Room
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Enter a room ID or slug to join an existing whiteboard.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                placeholder="room-id or room-slug"
                className="input-raycast flex-1"
              />
              <Button
                onClick={handleJoinRoom}
                variant="default"
                className="bg-gray-900 hover:bg-gray-800"
              >
                Join
              </Button>
            </div>
            {joinError && (
              <p className="mt-2 text-xs text-red-500">{joinError}</p>
            )}
          </section>
        </div>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Your Rooms
          </h2>

          {roomsLoading && (
            <div className="flex items-center gap-3 py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          )}
          {roomsError && (
            <p className="text-sm text-red-500">{roomsError}</p>
          )}

          {!roomsLoading && !roomsError && rooms.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-violet-100 mb-4">
                <Pen className="h-6 w-6 text-violet-500" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No rooms yet
              </p>
              <p className="text-sm text-gray-500">
                Create one above to get started.
              </p>
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

function RoomCard({ room }: { room: Room }) {
  const [copied, setCopied] = useState(false);

  const roomUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/canvas/${room.id}`;

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
    <div className="rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 group">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/canvas/${room.id}`}
            className="font-medium text-sm text-gray-900 hover:text-violet-600 transition-colors"
          >
            {room.slug}
          </Link>
          <p className="mt-0.5 text-xs text-gray-400">
            Created {new Date(room.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={copyLink}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition-all"
          title="Copy room link"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      <Link
        href={`/canvas/${room.id}`}
        className="mt-3 inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 transition-colors"
      >
        Open Canvas <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ff]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}
