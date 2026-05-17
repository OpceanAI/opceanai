"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, Command, Keyboard } from "lucide-react";
import ThemeToggle from "@/components/glass/ThemeToggle";
import KeyboardShortcutsModal, { useKeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";

const navItems = [
  { label: "Origin", href: "#origin" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "System", href: "#system" },
  { label: "About", href: "#about" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [lastScroll, setLastScroll] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const openSearch = useCallback(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true }));
  }, []);

  const navigateSection = useCallback((direction: "next" | "prev") => {
    const allSections = ["hero", "what-is", "origin", "discovery", "lab", "breakthrough", "ecosystem", "stats", "system", "about", "closing"];
    const currentIdx = allSections.findIndex((id) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3;
    });
    const targetIdx = direction === "next"
      ? Math.min(currentIdx + 1, allSections.length - 1)
      : Math.max(currentIdx - 1, 0);
    const el = document.getElementById(allSections[targetIdx]);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const shortcuts = [
    { key: "Cmd+K", macKey: "Cmd+K", description: "Search", action: openSearch },
    { key: "Ctrl+K", macKey: "Cmd+K", description: "Search", action: openSearch },
    { key: "J", description: "Next section", action: () => navigateSection("next") },
    { key: "K", description: "Previous section", action: () => navigateSection("prev") },
    { key: "/", description: "Focus search", action: openSearch },
  ];

  const { showModal, setShowModal } = useKeyboardShortcuts(shortcuts);

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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
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
            <a href="#hero" className="font-display text-lg font-semibold tracking-tight text-text-primary chromatic-hover">
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
                onClick={openSearch}
              >
                <Command className="w-3.5 h-3.5" />
                <span className="text-xs font-mono">K</span>
              </button>
              <button
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
                onClick={() => setShowModal(true)}
                aria-label="Keyboard shortcuts"
              >
                <Keyboard className="w-4 h-4" />
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
        </nav>
      </header>

      {/* Fullscreen Mobile Menu */}
      {open && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-[60] bg-canvas/95 backdrop-blur-xl md:hidden"
          style={{ animation: "fade-in 300ms ease-out" }}
        >
          <div className="flex flex-col h-full p-6 pt-20">
            <div className="flex-1 flex flex-col justify-center space-y-2">
              {navItems.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-2xl font-display font-light text-text-primary hover:text-accent transition-colors border-b border-border-subtle"
                  style={{
                    animation: `slide-up 300ms ease-out ${i * 80}ms both`,
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pb-8 space-y-4">
              <button
                onClick={() => { setOpen(false); openSearch(); }}
                className="w-full flex items-center justify-between py-3 text-text-tertiary hover:text-text-primary transition-colors"
              >
                <span className="text-sm">Search</span>
                <div className="flex items-center gap-1">
                  <kbd className="text-xs font-mono bg-surface-2 px-2 py-1 rounded border border-border-default">Cmd</kbd>
                  <span className="text-xs text-text-quaternary">+</span>
                  <kbd className="text-xs font-mono bg-surface-2 px-2 py-1 rounded border border-border-default">K</kbd>
                </div>
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-between py-3 text-text-tertiary hover:text-text-primary transition-colors"
              >
                <span className="text-sm">Keyboard Shortcuts</span>
                <kbd className="text-xs font-mono bg-surface-2 px-2 py-1 rounded border border-border-default">?</kbd>
              </button>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-text-tertiary">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}

      <KeyboardShortcutsModal visible={showModal} onClose={() => setShowModal(false)} />

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
