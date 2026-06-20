"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function LazySection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.style.animationPlayState = "";
          el.classList.remove("paused-section");
        } else {
          el.style.animationPlayState = "paused";
          el.classList.add("paused-section");
        }
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default LazySection;
