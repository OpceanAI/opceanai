"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Per-digit odometer. Each digit is a vertical 0-9 strip rolled with
 * translateY; columns get different durations (rightmost fastest) and a
 * slight blur while in motion. The server (and reduced motion, and no-JS)
 * renders the plain final value; the odometer structure only exists after
 * mount, and each column keeps an invisible ghost of its final digit in
 * normal flow so baseline and width never shift.
 */
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function DigitColumn({
  digit,
  rolled,
  duration,
}: {
  digit: number;
  rolled: boolean;
  duration: number;
}) {
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    if (!rolled) return;
    setMoving(true);
    const t = setTimeout(() => setMoving(false), duration + 60);
    return () => clearTimeout(t);
  }, [rolled, duration]);

  return (
    <span className="relative inline-block">
      {/* Ghost keeps natural metrics + baseline; the strip overlays it. */}
      <span style={{ visibility: "hidden" }}>{digit}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden"
      >
        <span
          className="block will-change-transform"
          style={{
            transform: rolled ? `translateY(-${digit * 10}%)` : "translateY(0)",
            transition: `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            filter: moving && rolled ? "blur(1.5px)" : "none",
          }}
        >
          {DIGITS.map((d) => (
            <span key={d} className="block">
              {d}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

export default function Odometer({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [live, setLive] = useState(false); // odometer structure mounted
  const [rolled, setRolled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    setLive(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        // Let the zeroed strips paint once before rolling.
        requestAnimationFrame(() => requestAnimationFrame(() => setRolled(true)));
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const chars = value.split("");
  const digitCount = chars.filter((c) => /\d/.test(c)).length;

  return (
    <span
      ref={ref}
      className={className}
      aria-label={value}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {!live ? (
        value
      ) : (
        <span aria-hidden="true">
          {(() => {
            let seen = 0;
            return chars.map((ch, i) => {
              if (!/\d/.test(ch)) {
                return <span key={i}>{ch}</span>;
              }
              const colIndex = seen++;
              // Rightmost column fastest.
              const duration = 700 + (digitCount - 1 - colIndex) * 220;
              return (
                <DigitColumn
                  key={i}
                  digit={Number(ch)}
                  rolled={rolled}
                  duration={duration}
                />
              );
            });
          })()}
        </span>
      )}
    </span>
  );
}
