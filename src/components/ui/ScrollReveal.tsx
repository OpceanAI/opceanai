"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade" | "slide-left" | "slide-right" | "scale" | "rotate" | "blur" | "horizontal" | "diagonal";
  delay?: number;
  threshold?: number;
  stagger?: boolean;
  staggerDelay?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  animation = "fade",
  delay = 0,
  threshold = 0.1,
  stagger = false,
  staggerDelay = 100,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            ref.current?.classList.add("visible");
          }, delay);
        }
      },
      { threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const animationClass = {
    fade: "scroll-fade",
    "slide-left": "scroll-slide-left",
    "slide-right": "scroll-slide-right",
    scale: "scroll-scale",
    rotate: "scroll-rotate",
    blur: "scroll-blur-reveal",
    horizontal: "scroll-horizontal-reveal",
    diagonal: "scroll-diagonal-reveal",
  }[animation];

  if (stagger) {
    return (
      <div ref={ref} className={`scroll-opacity-cascade ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`${animationClass} ${className}`}>
      {children}
    </div>
  );
}
