import { WebSocket, WebSocketServer } from "ws";
import { verifyJwt } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface ConnectedClient {
    ws: WebSocket;
    userId: string;
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

wss.on("connection", (ws, request) => {
    const url = request.url ?? "";
    const queryString = url.includes("?") ? url.split("?")[1] ?? "" : "";
    const token = new URLSearchParams(queryString).get("token") ?? "";

    const payload = verifyJwt(token);
    if (!payload) {
        ws.close(4001, "Unauthorized");
        return;
    }

    const client: ConnectedClient = { ws, userId: payload.userId, rooms: new Set() };
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

            try {
                await prismaClient.chat.create({
                    data: {
                        roomId: Number(roomId),
                        message: JSON.stringify({ shape }),
                        userId: client.userId,
                    },
                });
            } catch {
                // room may not exist or invalid id — persist is best-effort
            }

            broadcastToRoom(roomId, { type: "draw", roomId, shape, userId: client.userId }, ws);
            return;
        }

        if (type === "chat") {
            const roomId = String(parsed.roomId ?? "");
            const message = String(parsed.message ?? "");
            if (!roomId || !message) {
                ws.send(JSON.stringify({ type: "error", message: "Invalid chat payload" }));
                return;
            }

            try {
                await prismaClient.chat.create({
                    data: {
                        roomId: Number(roomId),
                        message,
                        userId: client.userId,
                    },
                });
            } catch {
                // best-effort persist
            }

            broadcastToRoom(roomId, { type: "chat", roomId, message, userId: client.userId }, ws);
            return;
        }

        ws.send(JSON.stringify({ type: "error", message: `Unknown message type: ${type}` }));
    });

    ws.on("close", () => removeClient(ws));
    ws.on("error", () => removeClient(ws));
});

console.log("WS backend listening on port 8080");
