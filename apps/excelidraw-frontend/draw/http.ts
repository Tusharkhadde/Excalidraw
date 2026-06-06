import { HTTP_BACKEND } from "@/config";
import type { Shape } from "@repo/common/types";

export async function getExistingShapes(roomId: string): Promise<Shape[]> {
    try {
        const res = await fetch(`${HTTP_BACKEND}/chats/${roomId}`);
        if (!res.ok) return [];
        const data = await res.json();
        const messages: { message: string }[] = data.messages ?? [];

        const shapes: Shape[] = [];
        for (const msg of messages) {
            try {
                const parsed = JSON.parse(msg.message);
                if (parsed.shape) {
                    shapes.push(parsed.shape as Shape);
                }
            } catch {
                // skip malformed entries
            }
        }
        return shapes;
    } catch {
        return [];
    }
}
