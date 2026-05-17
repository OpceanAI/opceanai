"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
}: UseInViewOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const callback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      });
    },
    [triggerOnce]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(callback, { threshold, rootMargin });
    observer.observe(el);

    if (triggerOnce) {
      return () => observer.disconnect();
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, callback, triggerOnce]);

  return { ref, isInView };
}

export function useAnimatedList({
  staggerDelay = 80,
  from = "first",
}: {
  staggerDelay?: number;
  from?: "first" | "last" | "center";
} = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            const items = container.querySelectorAll("[data-animate]");
            items.forEach((item, i) => {
              let delay = 0;
              if (from === "first") {
                delay = i * staggerDelay;
              } else if (from === "last") {
                delay = (items.length - 1 - i) * staggerDelay;
              } else {
                const center = Math.floor(items.length / 2);
                delay = Math.abs(i - center) * staggerDelay;
              }
              (item as HTMLElement).style.animationDelay = `${delay}ms`;
              item.classList.add("animate-in");
            });
            setHasAnimated(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [staggerDelay, from, hasAnimated]);

  return { containerRef, hasAnimated };
}
