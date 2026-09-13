import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Brand({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Drawboard home"
      className={cn(
        "group inline-flex items-center gap-2.5 text-[21px] font-semibold tracking-[-0.035em]",
        light ? "text-white" : "text-foreground",
        className,
      )}
    >
      <span className="relative grid size-8 -rotate-6 place-items-center overflow-hidden rounded-[10px] shadow-glow ring-1 ring-black/5 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105">
        <Image src="/drawboard-mark.png" alt="" width={32} height={32} className="size-full object-cover" priority />
      </span>
      <span className="leading-none">
        drawboard<span className="text-primary">.</span>
      </span>
    </Link>
  );
}
