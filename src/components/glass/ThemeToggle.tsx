"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

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
    return <div className="w-9 h-9 rounded-lg bg-white/[0.04]" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="btn-icon"
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
