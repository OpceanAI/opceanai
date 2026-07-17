"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Doki session replay. Command lines type char-by-char (~18ms/char), output
 * blocks flush instantly after; a blinking ▌ caret rides the active line.
 * Runs once, triggered by IntersectionObserver. Server render and
 * prefers-reduced-motion show the fully-printed session.
 */
export type SessionLine = { kind: "cmd" | "out" | "dim"; text: string };

const TYPE_MS = 18;
const CMD_PAUSE_MS = 260;
const OUT_FLUSH_MS = 90;

export default function TerminalSession({ lines }: { lines: SessionLine[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  // -1 = fully printed (SSR / reduced motion / finished replay “rest” state
  // is expressed via `done`); progress counts fully revealed lines.
  const [started, setStarted] = useState(false);
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const [done, setDone] = useState(true); // SSR: fully printed

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        // Reset only at the moment the replay begins.
        setDone(false);
        setLine(0);
        setChars(0);
        setStarted(true);
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || done) return;
    if (line >= lines.length) {
      setDone(true);
      return;
    }

    const current = lines[line];
    let timer: ReturnType<typeof setTimeout>;

    if (current.kind === "cmd") {
      if (chars < current.text.length) {
        timer = setTimeout(() => setChars((c) => c + 1), TYPE_MS);
      } else {
        timer = setTimeout(() => {
          setLine((l) => l + 1);
          setChars(0);
        }, CMD_PAUSE_MS);
      }
    } else {
      // Output lines flush whole, in quick succession.
      timer = setTimeout(() => {
        setLine((l) => l + 1);
        setChars(0);
      }, OUT_FLUSH_MS);
    }
    return () => clearTimeout(timer);
  }, [started, done, line, chars, lines]);

  const visibleCount = done ? lines.length : line;

  const renderLine = (l: SessionLine, i: number, partial?: string) => (
    <p key={i} className="whitespace-pre">
      {l.kind === "cmd" ? (
        <>
          <span className="text-[var(--terminal-dim)]">$ </span>
          <span className="text-[var(--terminal-bright)]">
            {partial ?? l.text}
          </span>
          {partial !== undefined && (
            <span className="terminal-caret text-[var(--terminal-bright)]">▌</span>
          )}
        </>
      ) : (
        <span
          className={
            l.kind === "dim"
              ? "text-[var(--terminal-dim)]"
              : "text-[var(--terminal-text)]"
          }
        >
          {l.text}
        </span>
      )}
    </p>
  );

  const active = !done && line < lines.length ? lines[line] : null;

  return (
    <div ref={rootRef}>
      {lines.slice(0, visibleCount).map((l, i) => renderLine(l, i))}
      {active && active.kind === "cmd"
        ? renderLine(active, line, active.text.slice(0, chars))
        : active && (
            // Output pending: show the prompt-less waiting caret line spot.
            <p className="whitespace-pre">
              <span className="terminal-caret text-[var(--terminal-dim)]">▌</span>
            </p>
          )}
      {done && (
        <p>
          <span className="text-[var(--terminal-dim)]">$ </span>
          <span className="terminal-caret text-[var(--terminal-bright)]">▌</span>
        </p>
      )}
    </div>
  );
}
