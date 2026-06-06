"use client";

import { WS_URL } from "@/config";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";
import { Wifi, WifiOff, Loader2, Pen } from "lucide-react";

type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { token } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connState, setConnState] = useState<ConnectionState>("connecting");
  const [error, setError] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 5;

  const connect = useCallback(() => {
    if (!token) {
      setError("Missing login token. Please sign in again.");
      setConnState("error");
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
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
  }, [token, roomId]);

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

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-graphite-600 mb-4">
            <Pen className="h-6 w-6 text-ember-red" />
          </div>
          <p className="text-sm text-slate-200 mb-4">Not authenticated.</p>
          <button
            onClick={() => router.push("/signin")}
            className="text-sm text-sky-signal hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (error && !socket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-ember-dark/50 mb-4">
            <WifiOff className="h-6 w-6 text-ember-red" />
          </div>
          <p className="text-sm text-ember-red mb-4">{error}</p>
          <button
            onClick={() => { retryCountRef.current = 0; connect(); }}
            className="px-4 py-2 rounded-buttons bg-ash-50 text-[#2F3031] text-sm font-medium hover:bg-[#d4d4d4] transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!socket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-slate-200" />
          <span className="text-sm text-slate-300">
            {connState === "disconnected" ? "Reconnecting..." : "Connecting to server..."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ConnectionBadge state={connState} />
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}

function ConnectionBadge({ state }: { state: ConnectionState }) {
  const config = {
    connecting: { color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", label: "Connecting" },
    connected: { color: "text-mint-signal", bg: "bg-mint-signal/10 border-mint-signal/30", label: "Connected" },
    disconnected: { color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", label: "Reconnecting" },
    error: { color: "text-ember-red", bg: "bg-ember-red/10 border-ember-red/30", label: "Error" },
  };

  const c = config[state];

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-buttonpill border ${c.bg} px-3 py-1.5 text-xs ${c.color} backdrop-blur-sm`}>
      <Wifi className="h-3 w-3" />
      {c.label}
    </div>
  );
}
