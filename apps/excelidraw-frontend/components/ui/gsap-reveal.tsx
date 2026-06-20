"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Direction = "up" | "down" | "left" | "right" | "none";
type StaggerTarget = "children" | "none";

interface GsapRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
  stagger?: StaggerTarget;
  staggerAmount?: number;
  from?: number;
  to?: number;
  triggerHook?: string;
  markers?: boolean;
}

export function GsapReveal({
  children,
  className,
  direction = "up",
  distance = 60,
  duration = 0.8,
  delay = 0,
  stagger = "none",
  staggerAmount = 0.1,
  triggerHook = "top 85%",
}: GsapRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = containerRef.current;
      if (!el) return;

      const fromVars: gsap.TweenVars = { opacity: 0 };
      const toVars: gsap.TweenVars = {
        opacity: 1,
        duration,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: triggerHook,
          toggleActions: "play none none reverse",
        },
      };

      if (direction === "up") fromVars.y = distance;
      else if (direction === "down") fromVars.y = -distance;
      else if (direction === "left") fromVars.x = distance;
      else if (direction === "right") fromVars.x = -distance;

      if (stagger === "children") {
        toVars.stagger = staggerAmount;
        gsap.fromTo(el.children, fromVars, toVars);
      } else {
        gsap.fromTo(el, fromVars, toVars);
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(containerRef.current, { opacity: 1, clearProps: "all" });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
