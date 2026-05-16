"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/glass/ThemeToggle";

const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "Docs", href: "#docs" },
  { label: "System", href: "#system" },
  { label: "About", href: "#about" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)]
        ${scrolled ? "py-3" : "py-5"}
      `}
    >
      <nav className="max-w-6xl mx-auto px-4">
        <div
          className={`
            flex items-center justify-between gap-3
            rounded-[var(--radius-pill)]
            px-5 py-2.5
            glass-elevated
            transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)]
          `}
        >
          <a href="#" className="font-display text-lg font-semibold tracking-tight text-text-primary">
            OpceanAI
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 text-text-tertiary hover:text-text-primary hover:bg-white/[0.04]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full text-text-tertiary hover:text-text-primary transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-2 rounded-2xl p-4 space-y-1 glass-elevated">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-text-tertiary hover:text-text-primary rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
