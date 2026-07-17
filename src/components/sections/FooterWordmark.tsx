"use client";

import { useEffect, useRef } from "react";

/**
 * The giant OPCEANAI wordmark, driven by scroll progress as the footer
 * enters view: letters start light and settle to their printed weight one
 * after another as you reach the bottom. A tiny rAF-throttled scroll
 * listener writes only font-variation-settings; layout never moves because
 * the letters keep their box (variable wght width shifts are sub-pixel at
 * this tracking). Static under prefers-reduced-motion and without JS.
 */
const WORD = "OPCEANAI";
const REST = 380;
const SETTLED = 500;

export default function FooterWordmark() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-wm]"));
    const n = letters.length;
    let rafId = 0;
    let ticking = false;

    const apply = () => {
      ticking = false;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the wordmark's top touches the viewport bottom, ~1 once it
      // sits fully on screen (which is the bottom of the page).
      const p = Math.min(1, Math.max(0, (vh - rect.top) / rect.height));
      for (let i = 0; i < n; i++) {
        // Each letter settles slightly after the one before it.
        const local = Math.min(1, Math.max(0, p * 1.35 - (i / n) * 0.35));
        const w = REST + (SETTLED - REST) * local;
        letters[i].style.fontVariationSettings = `'wght' ${w.toFixed(1)}`;
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="mt-14 select-none whitespace-nowrap text-center font-display text-[clamp(3.2rem,12.5vw,11.5rem)] font-medium leading-[0.84] tracking-[0.06em] text-text-primary"
      style={{ marginBottom: "-0.05em" }}
      aria-hidden="true"
    >
      {WORD.split("").map((ch, i) => (
        <span key={i} data-wm className="inline-block">
          {ch}
        </span>
      ))}
    </div>
  );
}
