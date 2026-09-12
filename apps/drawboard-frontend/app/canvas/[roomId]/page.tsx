import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoomCanvas } from "@/components/RoomCanvas";

export const metadata: Metadata = { title: "Board", robots: { index: false } };

export default async function CanvasPage({ params }: { params: Promise<{ roomId: string }> }) {
  const roomId = (await params).roomId;
  const isGuest = roomId === "guest";
  if (!isGuest && !/^[1-9]\d*$/.test(roomId)) notFound();
  return <RoomCanvas roomId={roomId} isGuest={isGuest} />;
}
