import type { ReactNode } from "react";

export function IconButton({ icon, onClick, activated }: { icon: ReactNode; onClick: () => void; activated: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-buttons p-2 transition-all duration-200 ${
        activated
          ? "bg-ash-50 text-[#2F3031] shadow-keyboard-key"
          : "bg-transparent text-slate-300 hover:bg-graphite-600 hover:text-snow"
      }`}
    >
      {icon}
    </button>
  );
}
