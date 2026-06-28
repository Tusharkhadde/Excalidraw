import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasPage({ params }: { params: Promise<{ roomId: string }> }) {
    const roomId = (await params).roomId;
    const isGuest = roomId === "guest";
    return <RoomCanvas roomId={roomId} isGuest={isGuest} />;
}
