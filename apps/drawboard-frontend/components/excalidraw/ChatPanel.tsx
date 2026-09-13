"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatMessage {
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
}

interface ChatPanelProps {
  socket: WebSocket | null;
  roomId: string;
  currentUserId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Room chat. Always listens so messages are never missed while the panel is closed. */
export function ChatPanel({ socket, roomId, currentUserId, open, onOpenChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unread, setUnread] = useState(0);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    if (!socket) return;
    const handler = (event: MessageEvent) => {
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      if (data.type !== "chat" || data.roomId !== roomId) return;
      const msg: ChatMessage = {
        userId: String(data.userId ?? ""),
        userName: String(data.userName ?? "Someone"),
        message: String(data.message ?? ""),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, msg]);
      if (!openRef.current && msg.userId !== currentUserId) setUnread((n) => n + 1);
    };
    socket.addEventListener("message", handler);
    return () => socket.removeEventListener("message", handler);
  }, [socket, roomId, currentUserId]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text || !socket) return;
    socket.send(JSON.stringify({ type: "chat", roomId, message: text }));
    setInput("");
  };

  return (
    <div className="pointer-events-auto relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onOpenChange(!open)}
            aria-label={open ? "Close chat" : "Open chat"}
            aria-expanded={open}
            className={cn(
              "relative grid size-11 place-items-center rounded-2xl transition-all active:scale-95",
              open ? "bg-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground hover:text-foreground",
            )}
          >
            <MessageCircle size={18} />
            {unread > 0 && !open && (
              <span className="absolute -right-1 -top-1 grid min-w-5 animate-check-pop place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          Chat <kbd className="ml-1 rounded bg-background/20 px-1 font-mono text-[10px]">C</kbd>
        </TooltipContent>
      </Tooltip>

      {open && (
        <div className="glass absolute bottom-14 right-0 flex h-[420px] w-[320px] animate-scale-in flex-col overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Room chat</p>
              <p className="text-[11px] text-muted-foreground">{socket ? "Messages stay in this session" : "Connect to chat"}</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => onOpenChange(false)} aria-label="Close chat">
              <X />
            </Button>
          </div>

          <div ref={listRef} className="nice-scroll flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="grid h-full place-items-center text-center">
                <div>
                  <MessageCircle className="mx-auto size-6 text-muted-foreground/50" />
                  <p className="mt-2 text-xs text-muted-foreground">Say hi to whoever’s on the board.</p>
                </div>
              </div>
            )}
            {messages.map((msg, i) => {
              const isMe = msg.userId === currentUserId;
              return (
                <div key={i} className={cn("flex items-end gap-2", isMe && "flex-row-reverse")}>
                  {!isMe && (
                    <Avatar className="size-6 border">
                      <AvatarFallback className="bg-primary/10 text-[9px] text-primary">{initials(msg.userName)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("max-w-[78%]", isMe ? "text-right" : "text-left")}>
                    {!isMe && <span className="mb-0.5 block px-1 text-[10px] text-muted-foreground">{msg.userName}</span>}
                    <div className={cn("inline-block rounded-2xl px-3 py-1.5 text-sm leading-snug", isMe ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted")}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form
            className="flex items-center gap-2 border-t p-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={socket ? "Message the room…" : "Offline"} disabled={!socket} className="h-9 border-transparent bg-muted/60 shadow-none" />
            <Button type="submit" size="icon-sm" disabled={!input.trim() || !socket} aria-label="Send">
              <Send />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
