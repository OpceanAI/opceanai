"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Command, Search, Menu, X } from "@/components/icons/Icons";
import ThemeToggle from "@/components/glass/ThemeToggle";
import SealCta from "@/components/ui/SealCta";
import KeyboardShortcutsModal, { useKeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";

const navItems = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Models", href: "#ecosystem" },
  { label: "Doki", href: "#system" },
  { label: "Research", href: "#about" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const openSearch = useCallback(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true }));
  }, []);

  const shortcuts = [
    { key: "Cmd+K", macKey: "Cmd+K", description: "Search", action: openSearch },
    { key: "Ctrl+K", macKey: "Cmd+K", description: "Search", action: openSearch },
    { key: "/", description: "Focus search", action: openSearch },
  ];

  const { showModal, setShowModal } = useKeyboardShortcuts(shortcuts);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollPos = window.scrollY + window.innerHeight / 3;
        let current = "";
        for (const item of navItems) {
          const el = document.getElementById(item.href.slice(1));
          if (el && el.offsetTop <= scrollPos) current = item.href.slice(1);
        }
        setActiveSection(current);
        setScrolled(window.scrollY > window.innerHeight * 0.8);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* Sliding current-section indicator — a real indicator, not a stray dot. */
  useEffect(() => {
    const el = activeSection ? linkRefs.current[activeSection] : null;
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    } else {
      setIndicator(null);
    }
  }, [activeSection]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav
          className={`nav-shell mx-auto flex h-14 max-w-5xl items-center justify-between pl-5 pr-3 ${
            scrolled ? "nav-scrolled" : ""
          }`}
        >
          <a href="#hero" className="font-display text-lg font-medium tracking-tight text-text-primary">
            OpceanAI
          </a>

          <div className="relative hidden items-center md:flex">
            {navItems.map((item) => {
              const id = item.href.slice(1);
              const active = activeSection === id;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  ref={(el) => { linkRefs.current[id] = el; }}
                  className="px-4 py-1.5 text-sm font-medium transition-colors"
                  style={{
                    color: active ? "var(--color-seal)" : "var(--color-text-tertiary)",
                  }}
                >
                  {item.label}
                </a>
              );
            })}
            {/* Fixed-width bar driven purely by transform — no layout writes. */}
            <span
              aria-hidden="true"
              className="absolute -bottom-[3px] left-0 h-[2px] w-6 rounded-full transition-transform duration-300"
              style={{
                background: "var(--color-seal)",
                transformOrigin: "left",
                transform: indicator
                  ? `translateX(${indicator.left + 16}px) scaleX(${
                      (indicator.width - 32) / 24
                    })`
                  : "translateX(0) scaleX(0)",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              className="hidden h-9 items-center gap-1.5 rounded-md px-3 text-sm text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary md:flex"
              onClick={openSearch}
              aria-label="Search"
            >
              <Command className="h-3.5 w-3.5" />
              <span>K</span>
            </button>
            <ThemeToggle />
            <SealCta
              href="mailto:contact@opceanai.com"
              className="hidden md:inline-flex"
              size={26}
              ariaLabel="Contact OpceanAI"
            />
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-2 md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "var(--spotlight-bg)" }}
            onClick={() => setOpen(false)}
          />
          <div className="nav-shell absolute inset-x-4 top-[76px]">
            <div className="space-y-1 px-3 py-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-4 py-3 text-base font-medium text-text-primary transition-colors hover:bg-surface-2"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => { setOpen(false); openSearch(); }}
                className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-text-secondary transition-colors hover:bg-surface-2"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <KeyboardShortcutsModal visible={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
