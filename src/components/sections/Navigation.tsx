"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Command } from "lucide-react";
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
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [lastScroll, setLastScroll] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const current = window.scrollY;
        setScrolled(current > 20);
        setHidden(current > lastScroll && current > 100);
        setLastScroll(current);

        const sections = navItems.map((item) => ({
          id: item.href.slice(1),
          el: document.getElementById(item.href.slice(1)),
        }));

        const scrollPos = current + window.innerHeight / 3;
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section.el && section.el.offsetTop <= scrollPos) {
            setActiveSection(section.id);
            break;
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [lastScroll]);

  useEffect(() => {
    if (!navRef.current || !indicatorRef.current) return;
    const activeLink = navRef.current.querySelector(`[data-active="true"]`);
    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      const parentRect = activeLink.parentElement!.getBoundingClientRect();
      indicatorRef.current.style.left = `${rect.left - parentRect.left}px`;
      indicatorRef.current.style.width = `${rect.width}px`;
    }
  }, [activeSection]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${scrolled ? "py-2" : "py-4"}
        ${hidden ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      <nav className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between gap-3 rounded-[var(--radius-pill)] px-4 py-2 glass-elevated">
          <a href="#" className="font-display text-lg font-semibold tracking-tight text-text-primary chromatic-hover">
            OpceanAI
          </a>

          <div className="hidden md:flex items-center gap-0.5 relative" ref={navRef}>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                data-active={activeSection === item.href.slice(1)}
                className="px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200"
                style={{
                  color: activeSection === item.href.slice(1) ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
                }}
              >
                {item.label}
              </a>
            ))}
            <div ref={indicatorRef} className="nav-indicator" />
          </div>

          <div className="flex items-center gap-1">
            <button
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-text-tertiary hover:text-text-primary rounded-lg hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/[0.06]"
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            >
              <Command className="w-3.5 h-3.5" />
              <span className="text-xs font-mono">K</span>
            </button>
            <ThemeToggle />
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-2 rounded-2xl p-2 glass-elevated">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-text-tertiary hover:text-text-primary rounded-xl hover:bg-white/[0.04] transition-colors min-h-[44px] flex items-center"
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
