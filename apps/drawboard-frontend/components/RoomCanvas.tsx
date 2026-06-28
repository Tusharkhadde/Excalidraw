"use client";

import { WS_URL } from "@/config";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";
import { Wifi, WifiOff, Loader2, Pen, Lock } from "lucide-react";

type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

interface RoomCanvasProps {
  roomId: string;
  isGuest?: boolean;
}

export function RoomCanvas({ roomId, isGuest = false }: RoomCanvasProps) {
  const router = useRouter();
  const { token } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connState, setConnState] = useState<ConnectionState>("connecting");
  const [error, setError] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 5;

  const connect = useCallback(() => {
    const wsUrl = isGuest
      ? `${WS_URL}?guest=true`
      : `${WS_URL}?token=${encodeURIComponent(token || "")}`;

    if (!isGuest && !token) {
      setError("Missing login token. Please sign in again.");
      setConnState("error");
      return;
    }

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      retryCountRef.current = 0;
      setConnState("connected");
      setError("");
      ws.send(JSON.stringify({ type: "join_room", roomId }));
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "join_room_ack") {
        // confirmed joined
      }
    };

    ws.onerror = () => {
      setConnState("error");
      setError("WebSocket connection failed.");
    };

    ws.onclose = () => {
      setConnState("disconnected");
      setSocket(null);
      wsRef.current = null;

      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const delay = Math.min(1000 * 2 ** retryCountRef.current, 10000);
        setTimeout(connect, delay);
      }
    };
  }, [token, roomId, isGuest]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  if (!isGuest && !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gray-100 mb-4">
            <Pen className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-4">Not authenticated.</p>
          <button
            onClick={() => router.push("/signin")}
            className="text-sm text-blue-600 hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (error && !socket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-red-50 mb-4">
            <WifiOff className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={() => { retryCountRef.current = 0; connect(); }}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!socket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <span className="text-sm text-gray-500">
            {connState === "disconnected" ? "Reconnecting..." : "Connecting to server..."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isGuest && (
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center gap-2 border-b border-yellow-200 bg-yellow-50 px-4 py-2 text-xs font-medium text-yellow-700 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
          <span>Guest mode - drawings are not saved. <button onClick={() => window.location.href = "/signin"} className="underline hover:text-yellow-800">Sign in to save</button></span>
        </div>
      )}
      <ConnectionBadge state={connState} isGuest={isGuest} />
      <Canvas roomId={roomId} socket={socket} isGuest={isGuest} />
    </div>
  );
}

function ConnectionBadge({ state, isGuest }: { state: ConnectionState; isGuest: boolean }) {
  const config = {
    connecting: { color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", label: "Connecting" },
    connected: { color: "text-green-600", bg: "bg-green-50 border-green-200", label: isGuest ? "Connected (Guest)" : "Connected" },
    disconnected: { color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", label: "Reconnecting" },
    error: { color: "text-red-600", bg: "bg-red-50 border-red-200", label: "Error" },
  };

  const c = config[state];

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border ${c.bg} px-3 py-1.5 text-xs ${c.color} backdrop-blur-sm shadow-sm`}>
      <Wifi className="h-3 w-3" />
      {c.label}
      {isGuest && state === "connected" && (
        <Lock className="h-3 w-3 text-yellow-500" />
      )}
    </div>
  );
}
