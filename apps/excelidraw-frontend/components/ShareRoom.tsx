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
        className="fixed right-4 top-4 z-40 rounded-xl bg-white p-2.5 text-gray-500 border border-gray-200 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
        title="Share room"
      >
        <Share2 className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Pen className="h-4 w-4 text-blue-600" />
                <h3 className="text-base font-semibold text-gray-900">Share Room</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Share this link so others can join your whiteboard.
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none px-1"
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                onClick={copyLink}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-all"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            {copied && <p className="mt-2 text-xs text-green-600">Link copied!</p>}
          </div>
        </div>
      )}
    </>
  );
}
