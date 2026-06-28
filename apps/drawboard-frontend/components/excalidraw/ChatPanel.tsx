"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

interface ChatMessage {
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
}

interface ChatPanelProps {
  socket: WebSocket;
  roomId: string;
  isDark: boolean;
  currentUserId?: string;
}

export function ChatPanel({ socket, roomId, isDark, currentUserId }: ChatPanelProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handler = (event: MessageEvent) => {
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      if (data.type === "chat" && data.roomId === roomId) {
        setMessages((prev) => [
          ...prev,
          {
            userId: String(data.userId ?? ""),
            userName: String(data.userName ?? "Unknown"),
            message: String(data.message ?? ""),
            timestamp: Date.now(),
          },
        ]);
      }
    };

    socket.addEventListener("message", handler);
    return () => socket.removeEventListener("message", handler);
  }, [open, socket, roomId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    socket.send(JSON.stringify({ type: "chat", roomId, message: text }));
    setInput("");
  };

  const border = isDark ? "border-white/10" : "border-gray-200";
  const bg = isDark ? "bg-gray-900/95" : "bg-white";
  const text = isDark ? "text-gray-200" : "text-gray-800";
  const muted = isDark ? "text-gray-500" : "text-gray-400";

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${bg} ${isDark ? "text-blue-400" : "text-blue-600"} shadow-lg ${isDark ? "" : "shadow-gray-200/50"} transition-colors`}
        title="Open chat"
      >
        <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
      </button>
    );
  }

  return (
    <div
      className={`absolute bottom-14 right-0 z-30 flex h-[400px] w-80 flex-col rounded-2xl border ${border} ${bg} shadow-2xl backdrop-blur-sm transition-colors`}
    >
      <div className={`flex items-center justify-between border-b ${border} px-4 py-3`}>
        <span className={`text-sm font-semibold ${text}`}>Chat</span>
        <button
          onClick={() => setOpen(false)}
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${muted} hover:bg-gray-100 dark:hover:bg-gray-800`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {messages.map((msg, i) => {
          const isMe = msg.userId === currentUserId;
          return (
            <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <span className={`text-[11px] ${muted} px-1`}>{isMe ? "You" : msg.userName}</span>
              <div
                className={`mt-0.5 max-w-[80%] rounded-xl px-3 py-1.5 text-sm leading-snug ${
                  isMe
                    ? "bg-blue-500 text-white"
                    : isDark
                      ? "bg-gray-800 text-gray-200"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`flex items-center gap-2 border-t ${border} p-3`}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="Type a message..."
          className={`flex-1 rounded-lg border ${border} bg-transparent px-3 py-1.5 text-sm outline-none ${text} placeholder:text-gray-400`}
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
