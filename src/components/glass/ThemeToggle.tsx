"use client";

import { useEffect, useState } from "react";

/** Bespoke andon (paper lantern) mark: lit warm fill in dark mode, outline-only in light mode. */
function AndonIcon({ lit }: { lit: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 3h8l1 3H7l1-3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill={lit ? "currentColor" : "none"}
        fillOpacity={lit ? 0.35 : 0}
      />
      <path
        d="M6.5 6h11l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5L6.5 6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill={lit ? "currentColor" : "none"}
        fillOpacity={lit ? 0.22 : 0}
      />
      <path d="M9 6v12.5M15 6v12.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M12 21v1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("opceanai-theme");
    const isDark = stored === "dark" || !stored;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);

    /* One warm flicker of the lantern on switch. */
    setFlicker(true);
    window.setTimeout(() => setFlicker(false), 650);

    const supportsViewTransition = "startViewTransition" in document;
    if (supportsViewTransition) {
      document.startViewTransition(() => {
        document.documentElement.classList.toggle("dark", next);
      });
    } else {
      document.documentElement.classList.toggle("dark", next);
    }

    localStorage.setItem("opceanai-theme", next ? "dark" : "light");
  };

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 flex items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
    >
      <span className={flicker ? "andon-flicker inline-flex" : "inline-flex"}>
        <AndonIcon lit={dark} />
      </span>
    </button>
  );
}
