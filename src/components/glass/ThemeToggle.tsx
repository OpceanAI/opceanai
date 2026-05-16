"use client";

import { useEffect, useState, useRef } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("opceanai-theme");
    if (stored) {
      const isDark = stored === "dark";
      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggle = () => {
    const btn = btnRef.current;
    if (!btn) return;

    const next = !dark;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!document.startViewTransition || prefersReduced) {
      setDark(next);
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("opceanai-theme", next ? "dark" : "light");
      return;
    }

    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const expandClip = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    const shrinkClip = [
      `circle(${endRadius}px at ${x}px ${y}px)`,
      `circle(0px at ${x}px ${y}px)`,
    ];
    const fullClip = `circle(${endRadius + 100}px at ${x}px ${y}px)`;

    document.documentElement.setAttribute(
      "data-theme-transition",
      next ? "to-dark" : "to-light"
    );

    const transition = document.startViewTransition(() => {
      setDark(next);
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("opceanai-theme", next ? "dark" : "light");
    });

    transition.ready.then(() => {
      if (next) {
        document.documentElement.animate(
          { clipPath: shrinkClip },
          {
            duration: 600,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-old(root)",
          }
        );
        document.documentElement.animate(
          { clipPath: [fullClip, fullClip] },
          {
            duration: 600,
            easing: "linear",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      } else {
        document.documentElement.animate(
          { clipPath: expandClip },
          {
            duration: 600,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        document.documentElement.animate(
          { clipPath: [fullClip, fullClip] },
          {
            duration: 600,
            easing: "linear",
            pseudoElement: "::view-transition-old(root)",
          }
        );
      }
    });

    transition.finished.then(() => {
      document.documentElement.removeAttribute("data-theme-transition");
    });
  };

  if (!mounted) {
    return (
      <div className="w-16 h-8 rounded-full bg-white/10 dark:bg-[#475569]/30 border border-white/20 dark:border-[#475569]/40" />
    );
  }

  return (
    <button
      ref={btnRef}
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to light mode"}
      className="relative w-16 h-8 rounded-full bg-gradient-to-b from-white/20 to-white/5 dark:from-[#475569]/40 dark:to-[#334155]/20 border border-white/30 dark:border-[#475569]/50 overflow-hidden transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50"
    >
      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10">
        <Sun className="w-4 h-4 text-amber-500 drop-shadow-sm" />
      </div>

      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10">
        <Moon className="w-4 h-4 text-[#38BDF8]" />
      </div>

      <div
        className="absolute top-0.5 h-7 w-7 rounded-full transition-all duration-300 ease-[var(--ease-gentle)]"
        style={{
          left: dark ? "calc(100% - 1.75rem - 0.125rem)" : "0.125rem",
          background: dark
            ? "linear-gradient(135deg, rgba(148, 163, 184, 0.5), rgba(100, 116, 139, 0.3))"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: dark
            ? "0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
            : "0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        }}
      />
    </button>
  );
}
