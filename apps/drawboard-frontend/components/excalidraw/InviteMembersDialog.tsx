"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy, Search, UserPlus, UserRoundPlus, X } from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";
import { HTTP_BACKEND } from "@/config";

interface UserResult {
  id: string;
  email: string;
  name: string;
  photo: string | null;
}

interface InvitedUser {
  id: string;
  name: string;
  email: string;
  photo: string | null;
}

interface InviteMembersDialogProps {
  roomId: string;
  isDark: boolean;
  onOpenChange?: (open: boolean) => void;
}

function UserAvatar({ user, size = 32 }: { user: { name: string; photo: string | null }; size?: number }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (user.photo) {
    return (
      <img
        src={user.photo}
        alt={user.name}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-medium dark:bg-blue-900/30 dark:text-blue-400"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}

export function InviteMembersDialog({ roomId, isDark, onOpenChange }: InviteMembersDialogProps) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [invited, setInvited] = useState<InvitedUser[]>([]);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const roomUrl = typeof window !== "undefined"
    ? `${window.location.origin}/canvas/${roomId}`
    : "";

  const search = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${HTTP_BACKEND}/users/search?q=${encodeURIComponent(q)}`, {
        headers: token ? { Authorization: token } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setResults((data.users ?? []).filter((u: UserResult) => !invited.some((i) => i.id === u.id)));
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [invited]);

  const inviteUser = (user: UserResult) => {
    setInvited((prev) => [...prev, { id: user.id, name: user.name, email: user.email, photo: user.photo }]);
    setResults((prev) => prev.filter((r) => r.id !== user.id));
    setQuery("");
  };

  const removeInvited = (userId: string) => {
    setInvited((prev) => prev.filter((i) => i.id !== userId));
  };

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl border transition-colors ${
            isDark
              ? "border-white/10 bg-gray-900/80 text-blue-400 shadow-none"
              : "border-[#eceaf4] bg-[#f6f5fb] text-[#4c5160] shadow-none"
          }`}
          title="Invite members"
        >
          <UserPlus className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <UserRoundPlus className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">Invite team members</DialogTitle>
            <DialogDescription className="text-left">
              Search by name or email to add collaborators to this room.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-3">
          <Label>Find users</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <input
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="Search by name or email..."
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 pl-9 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
            />
          </div>

          {loading && (
            <p className="text-center text-xs text-muted-foreground py-2">Searching...</p>
          )}

          {results.length > 0 && (
            <div className="max-h-44 space-y-1 overflow-y-auto rounded-lg border border-input">
              {results.map((user) => (
                <button
                  key={user.id}
                  onClick={() => inviteUser(user)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-accent"
                >
                  <UserAvatar user={user} size={28} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <UserPlus className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-2">No users found</p>
          )}
        </div>

        {invited.length > 0 && (
          <div className="space-y-2">
            <Label>Invited ({invited.length})</Label>
            <div className="space-y-1">
              {invited.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 rounded-lg border border-input px-3 py-2"
                >
                  <UserAvatar user={user} size={28} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => removeInvited(user.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <Button type="button" className="w-full">
              Send invites ({invited.length})
            </Button>
          </div>
        )}

        <hr className="my-1 border-t border-border" />

        <div className="space-y-2">
          <Label htmlFor={id}>Or share this magic link</Label>
          <div className="relative">
            <Input
              ref={inputRef}
              id={id}
              className="pe-9"
              type="text"
              defaultValue={roomUrl}
              readOnly
            />
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleCopy}
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed"
                    aria-label={copied ? "Copied" : "Copy to clipboard"}
                    disabled={copied}
                  >
                    <div
                      className={cn(
                        "transition-all",
                        copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
                      )}
                    >
                      <Check
                        className="stroke-emerald-500"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </div>
                    <div
                      className={cn(
                        "absolute transition-all",
                        copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
                      )}
                    >
                      <Copy size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-xs">Copy to clipboard</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
