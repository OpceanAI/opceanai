"use client";

import { useEffect, useRef } from "react";

/**
 * Hero headline with a variable-weight proximity field: each character's
 * Sentient `wght` axis leans toward the pointer with a distance falloff and
 * lerps back to rest when it leaves. Desktop pointer-fine only; disabled
 * under prefers-reduced-motion. The h1 carries the plain text as aria-label,
 * the per-character spans are aria-hidden.
 */
const REST = 520;
const PEAK = 700;
const RADIUS = 150;
const LERP = 0.16;

type Segment = { text: string; em?: boolean };

const segments: Segment[] = [
  { text: "Intelligent systems, built like " },
  { text: "instruments", em: true },
  { text: "." },
];

const plainText = segments.map((s) => s.text).join("");

export default function ProximityHeadline({ className }: { className?: string }) {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = Array.from(root.querySelectorAll<HTMLElement>("[data-ch]"));
    if (chars.length === 0) return;

    // Page-space character centers; cheap to compare against pageX/pageY.
    let centers: Array<{ x: number; y: number }> = [];
    const weights = new Array<number>(chars.length).fill(REST);

    const measure = () => {
      centers = chars.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 + window.scrollX,
          y: r.top + r.height / 2 + window.scrollY,
        };
      });
    };
    measure();

    let px = -1e5;
    let py = -1e5;
    let rafId = 0;
    let running = false;

    const tick = () => {
      let settled = true;
      for (let i = 0; i < chars.length; i++) {
        const dx = centers[i].x - px;
        const dy = centers[i].y - py;
        const d = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - d / RADIUS);
        const target = REST + (PEAK - REST) * (t * t);
        const next = weights[i] + (target - weights[i]) * LERP;
        if (Math.abs(next - weights[i]) > 0.1 || Math.abs(next - target) > 0.5) {
          settled = false;
        }
        if (Math.abs(next - weights[i]) > 0.1) {
          weights[i] = next;
          chars[i].style.fontVariationSettings = `'wght' ${next.toFixed(1)}`;
        }
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
      px = e.pageX;
      py = e.pageY;
      wake();
    };

    const onLeave = () => {
      px = -1e5;
      py = -1e5;
      wake();
    };

    const onResize = () => {
      measure();
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Words stay whole (no mid-word wraps); only characters are spans.
  const renderChars = (text: string, keyPrefix: string) =>
    text.split(/(\s+)/).map((part, wi) =>
      /^\s+$/.test(part) ? (
        <span key={`${keyPrefix}-w${wi}`}> </span>
      ) : part === "" ? null : (
        <span key={`${keyPrefix}-w${wi}`} className="inline-block whitespace-nowrap">
          {part.split("").map((ch, i) => (
            <span key={i} data-ch className="inline-block">
              {ch}
            </span>
          ))}
        </span>
      )
    );

  return (
    <h1 ref={rootRef} aria-label={plainText} className={className}>
      <span aria-hidden="true">
        {renderChars(segments[0].text, "s0")}
        {/* The em word and the closing period are one unbreakable chunk so
            the period can never wrap onto its own line. */}
        <span className="inline-block whitespace-nowrap">
          <em className="italic" style={{ color: "var(--color-seal)" }}>
            {segments[1].text.split("").map((ch, i) => (
              <span key={i} data-ch className="inline-block">
                {ch}
              </span>
            ))}
          </em>
          <span data-ch className="inline-block">
            {segments[2].text}
          </span>
        </span>
      </span>
    </h1>
  );
}
