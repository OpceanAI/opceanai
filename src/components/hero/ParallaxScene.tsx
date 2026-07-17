"use client";

import { useEffect, useRef } from "react";
import UkiyoeWave from "./UkiyoeWave";

/**
 * Wraps UkiyoeWave and drives a scroll-linked parallax: background moves
 * slowest, foreground fastest. All layers are visible by default -- only
 * `transform` changes with scroll, never opacity. Disabled entirely under
 * prefers-reduced-motion (the scene stays static).
 *
 * Primary path is pure CSS (see globals.css: `[data-layer]` + `view()`
 * timelines under `@supports (animation-timeline: view())`), which needs no
 * JS at all. This effect is a fallback for browsers that don't yet support
 * scroll-driven animations -- it no-ops entirely when the browser can run
 * the CSS path, so the two never fight over the same transform.
 */
const LAYER_SPEED: Record<string, number> = {
  sky: 0.02,
  distant: 0.05,
  far: 0.08,
  mid: 0.12,
  great: 0.16,
  spray: 0.22,
  fore: 0.24,
};

export default function ParallaxScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const supportsCssScrollParallax =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline: scroll()");
    if (supportsCssScrollParallax) return;

    const layers = Array.from(
      container.querySelectorAll<SVGGElement>("[data-layer]")
    );

    let rafId = 0;

    const applyParallax = () => {
      const rect = container.getBoundingClientRect();
      const progress = -rect.top;

      for (const layer of layers) {
        const speed = LAYER_SPEED[layer.dataset.layer ?? ""] ?? 0.05;
        const offset = progress * speed;
        layer.style.transform = `translateY(${offset}px)`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(applyParallax);
    };

    applyParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* Pointer drift — spray and the great wave lean a few px toward the
   * cursor with a spring lerp. One rAF, desktop pointer-fine only, off
   * under prefers-reduced-motion. The drift lives on inner [data-drift]
   * groups so it never fights the scroll parallax on [data-layer]. */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const groups = Array.from(
      container.querySelectorAll<SVGGElement>("[data-drift]")
    ).map((el) => ({
      el,
      factor: parseFloat(el.dataset.drift ?? "1"),
      x: 0,
      y: 0,
    }));
    if (groups.length === 0) return;

    const MAX = 7; // px at factor 1 — alive, not a cursor-follower
    let tx = 0;
    let ty = 0;
    let rafId = 0;
    let running = false;

    const tick = () => {
      let settled = true;
      for (const g of groups) {
        const gx = tx * g.factor;
        const gy = ty * g.factor;
        g.x += (gx - g.x) * 0.06;
        g.y += (gy - g.y) * 0.06;
        if (Math.abs(gx - g.x) > 0.05 || Math.abs(gy - g.y) > 0.05) {
          settled = false;
        }
        g.el.style.transform = `translate(${g.x.toFixed(2)}px, ${g.y.toFixed(2)}px)`;
      }
      if (settled) {
        running = false;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      tx = nx * MAX;
      ty = ny * MAX;
      wake();
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <UkiyoeWave className="w-full h-full" />
    </div>
  );
}
