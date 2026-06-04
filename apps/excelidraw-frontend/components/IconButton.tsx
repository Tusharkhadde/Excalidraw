import type { ReactNode } from "react";

export function IconButton({ icon, onClick, activated }: { icon: ReactNode; onClick: () => void; activated: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-md p-2 transition-colors ${
                activated
                    ? "bg-blue-600 text-white"
                    : "bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
        >
            {icon}
        </button>
    );
}
