import { WebSocket, WebSocketServer } from "ws";
import { verifyJwt } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface ConnectedClient {
    ws: WebSocket;
    userId: string | null;
    isGuest: boolean;
    rooms: Set<string>;
}

const clients: ConnectedClient[] = [];

function findClientByWs(ws: WebSocket): ConnectedClient | undefined {
    return clients.find(c => c.ws === ws);
}

function removeClient(ws: WebSocket) {
    const idx = clients.findIndex(c => c.ws === ws);
    if (idx >= 0) clients.splice(idx, 1);
}

function broadcastToRoom(roomId: string, message: object, excludeWs?: WebSocket) {
    const data = JSON.stringify(message);
    for (const client of clients) {
        if (client.rooms.has(roomId) && client.ws !== excludeWs && client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(data);
        }
    }
}

function generateGuestId(): string {
    return `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

wss.on("connection", (ws, request) => {
    const url = request.url ?? "";
    const queryString = url.includes("?") ? url.split("?")[1] ?? "" : "";
    const params = new URLSearchParams(queryString);
    const token = params.get("token") ?? "";
    const isGuest = params.get("guest") === "true";

    let userId: string | null = null;
    let clientIsGuest = false;

    if (isGuest) {
        clientIsGuest = true;
        userId = generateGuestId();
    } else {
        const payload = verifyJwt(token);
        if (!payload) {
            ws.close(4001, "Unauthorized");
            return;
        }
        userId = payload.userId;
    }

    const client: ConnectedClient = { ws, userId, isGuest: clientIsGuest, rooms: new Set() };
    clients.push(client);

    ws.on("message", async (raw) => {
        let parsed: Record<string, unknown>;
        try {
            const text = typeof raw === "string" ? raw : raw.toString();
            parsed = JSON.parse(text);
        } catch {
            ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
            return;
        }

        const type = parsed.type;

        if (type === "join_room") {
            const roomId = String(parsed.roomId ?? parsed.room ?? "");
            if (!roomId) {
                ws.send(JSON.stringify({ type: "error", message: "roomId is required" }));
                return;
            }
            client.rooms.add(roomId);
            ws.send(JSON.stringify({ type: "join_room_ack", roomId }));
            return;
        }

        if (type === "leave_room") {
            const roomId = String(parsed.roomId ?? parsed.room ?? "");
            client.rooms.delete(roomId);
            return;
        }

        if (type === "draw") {
            const roomId = String(parsed.roomId ?? "");
            const shape = parsed.shape;
            if (!roomId || !shape || typeof shape !== "object") {
                ws.send(JSON.stringify({ type: "error", message: "Invalid draw payload" }));
                return;
            }

            if (!client.isGuest && client.userId) {
                try {
                    await prismaClient.chat.create({
                        data: {
                            roomId: Number(roomId),
                            message: JSON.stringify({ shape }),
                            userId: client.userId,
                        },
                    });
                } catch {
                }
            }

            broadcastToRoom(roomId, { type: "draw", roomId, shape, userId: client.userId }, ws);
            return;
        }

        if (type === "update") {
            const roomId = String(parsed.roomId ?? "");
            const shape = parsed.shape as Record<string, unknown> | null;
            const shapeId = typeof shape === "object" && shape ? String(shape.id ?? "") : "";
            if (!roomId || !shapeId) {
                ws.send(JSON.stringify({ type: "error", message: "Invalid update payload" }));
                return;
            }

            if (!client.isGuest && client.userId) {
                try {
                    await prismaClient.chat.deleteMany({
                        where: { roomId: Number(roomId), message: { contains: shapeId } },
                    });
                    await prismaClient.chat.create({
                        data: {
                            roomId: Number(roomId),
                            message: JSON.stringify({ shape }),
                            userId: client.userId,
                        },
                    });
                } catch {
                }
            }

            broadcastToRoom(roomId, { type: "update", roomId, shape, userId: client.userId });
            return;
        }

        if (type === "sync") {
            const roomId = String(parsed.roomId ?? "");
            const shapes = parsed.shapes;
            if (!roomId || !Array.isArray(shapes)) {
                ws.send(JSON.stringify({ type: "error", message: "Invalid sync payload" }));
                return;
            }
            if (!client.isGuest && client.userId) {
                try {
                    await prismaClient.chat.deleteMany({ where: { roomId: Number(roomId) } });
                    for (const shape of shapes) {
                        await prismaClient.chat.create({
                            data: { roomId: Number(roomId), message: JSON.stringify({ shape }), userId: client.userId },
                        });
                    }
                } catch {
                }
            }
            broadcastToRoom(roomId, { type: "sync", roomId, shapes, userId: client.userId });
            return;
        }

        if (type === "clear") {
            const roomId = String(parsed.roomId ?? "");
            if (!roomId) {
                ws.send(JSON.stringify({ type: "error", message: "roomId is required for clear" }));
                return;
            }
            if (!client.isGuest && client.userId) {
                try {
                    await prismaClient.chat.deleteMany({
                        where: { roomId: Number(roomId) },
                    });
                } catch {
                }
            }
            broadcastToRoom(roomId, { type: "clear", roomId });
            return;
        }

        if (type === "chat") {
            const roomId = String(parsed.roomId ?? "");
            const message = String(parsed.message ?? "");
            if (!roomId || !message) {
                ws.send(JSON.stringify({ type: "error", message: "Invalid chat payload" }));
                return;
            }

            let userName = "Guest";
            if (!client.isGuest && client.userId) {
                try {
                    const user = await prismaClient.user.findUnique({
                        where: { id: client.userId },
                        select: { name: true },
                    });
                    if (user) userName = user.name;
                    await prismaClient.chat.create({
                        data: {
                            roomId: Number(roomId),
                            message,
                            userId: client.userId,
                        },
                    });
                } catch {
                }
            }

            broadcastToRoom(roomId, { type: "chat", roomId, message, userId: client.userId, userName }, ws);
            return;
        }

        ws.send(JSON.stringify({ type: "error", message: `Unknown message type: ${type}` }));
    });

    ws.on("close", () => removeClient(ws));
    ws.on("error", () => removeClient(ws));
});

console.log("WS backend listening on port 8080");
