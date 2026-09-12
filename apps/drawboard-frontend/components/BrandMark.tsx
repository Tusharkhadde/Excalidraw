import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  /** When true, skips the violet squircle and draws the white glyph only (for use on a primary background). */
  glyphOnly?: boolean;
}

/**
 * Drawboard mark: a rounded board frame with a freehand “d” scribble.
 * Unique to the product — not a Lucide pen nib.
 */
export function BrandMark({ className, glyphOnly = false }: BrandMarkProps) {
  if (glyphOnly) {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("size-full", className)}>
        <rect x="6.5" y="8.5" width="15" height="12" rx="2.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M15.2 21.2c-3.1 0-5.1-2.1-5.1-5.1 0-3.2 2.2-5.4 5.3-5.4 1.4 0 2.5.4 3.4 1.1V7.4c0-.5.3-.8.8-.8s.8.3.8.8v13c0 .4-.2.7-.5.9-.7.4-1.7.7-2.9.9-.6.1-1.2.1-1.8.1Z"
          fill="currentColor"
        />
        <path
          d="M19.6 7.2c.9-.6 2-.7 2.9-.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={cn("size-full", className)}>
      <rect width="64" height="64" rx="16" fill="currentColor" className="text-primary" />
      <rect x="15" y="18" width="26" height="22" rx="5" stroke="white" strokeWidth="3.2" />
      <path
        d="M30.4 42.2c-5.4 0-9-3.6-9-8.9 0-5.6 3.9-9.5 9.3-9.5 2.4 0 4.4.7 5.9 1.9V16.8c0-.9.6-1.5 1.5-1.5s1.5.6 1.5 1.5v22.8c0 .7-.3 1.2-.9 1.5-1.2.7-2.9 1.3-5 1.6-1 .2-2.1.2-3.3.2Z"
        fill="white"
      />
      <path
        d="M38.1 16.4c1.5-1 3.4-1.2 5-.4"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
