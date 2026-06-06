"use client";

import { useState } from "react";
import { Share2, Check, Copy, X, Pen } from "lucide-react";

export function ShareRoom({ roomId }: { roomId: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/canvas/${roomId}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 top-4 z-40 rounded-buttons bg-graphite-700/80 p-2.5 text-slate-300 backdrop-blur-sm border border-graphite-500/50 transition-all duration-200 hover:bg-graphite-600 hover:text-snow hover:border-graphite-400"
        title="Share room"
      >
        <Share2 className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-modals border border-graphite-500 bg-graphite-700 p-6 shadow-xl-dark">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Pen className="h-4 w-4 text-sky-signal" />
                <h3 className="text-base font-semibold text-snow">Share Room</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-300 hover:text-snow transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-200 mb-4">
              Share this link so others can join your whiteboard.
            </p>
            <div className="flex items-center gap-2 rounded-buttons border border-graphite-500 bg-deep-charcoal p-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-sm text-snow outline-none px-1"
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                onClick={copyLink}
                className="rounded-buttons p-1.5 text-slate-300 hover:bg-graphite-600 hover:text-snow transition-all"
              >
                {copied ? <Check className="h-4 w-4 text-mint-signal" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            {copied && <p className="mt-2 text-xs text-mint-signal">Link copied!</p>}
          </div>
        </div>
      )}
    </>
  );
}
