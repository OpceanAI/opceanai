"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useScrollAnimations(options?: IntersectionObserverInit) {
  const [elements, setElements] = useState<Element[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback((el: Element | null) => {
    if (!el) return;
    setElements((prev) => [...prev, el]);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px", ...options }
    );

    return () => observerRef.current?.disconnect();
  }, [options]);

  useEffect(() => {
    elements.forEach((el) => observerRef.current?.observe(el));
    return () => elements.forEach((el) => observerRef.current?.unobserve(el));
  }, [elements]);

  return observe;
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(scrollPercent);
      document.documentElement.style.setProperty("--scroll-progress", scrollPercent.toString());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const offset = (scrolled - rect.top) * speed;
      ref.current.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return ref;
}

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return position;
}
