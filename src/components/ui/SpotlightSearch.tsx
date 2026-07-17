"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Search, Command, FileText, Github, BookOpen, Layers } from "@/components/icons/Icons";

const commands = [
  { id: "projects", label: "Explore Projects", shortcut: "P", icon: Layers },
  { id: "docs", label: "Read Documentation", shortcut: "D", icon: BookOpen },
  { id: "github", label: "View on GitHub", shortcut: "G", icon: Github },
  { id: "about", label: "About OpceanAI", shortcut: "A", icon: FileText },
  { id: "system", label: "System Status", shortcut: "S", icon: Layers },
];

export default function SpotlightSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          handleClose();
        } else {
          handleOpen();
        }
      }
      if (e.key === "Escape" && open) handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleOpen, handleClose]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[activeIndex]) {
        const item = filtered[activeIndex];
        const el = document.getElementById(item.id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, filtered, activeIndex, handleClose]);

  if (!open) return null;

  return (
    <div className="spotlight-overlay" onClick={handleClose}>
      <div className="spotlight-modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 pt-4 pb-3">
          <Search className="w-5 h-5 text-text-tertiary shrink-0" />
          <input
            ref={inputRef}
            className="spotlight-input px-0 pt-0 pb-0 border-0"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
          />
          <kbd className="text-xs font-mono text-text-quaternary bg-surface-2 border border-border-subtle rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="py-2">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`spotlight-item ${i === activeIndex ? "active" : ""}`}
              onClick={() => {
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
                handleClose();
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <item.icon className="spotlight-item-icon" />
              <span className="spotlight-item-text">{item.label}</span>
              <span className="spotlight-item-shortcut">
                <Command className="w-3 h-3 inline mr-0.5" />{item.shortcut}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-text-quaternary text-sm">
              No results found
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-border-default text-xs text-text-quaternary">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-surface-2 border border-border-subtle rounded px-1 py-0.5">↑↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-surface-2 border border-border-subtle rounded px-1 py-0.5">↵</kbd> Open</span>
          </div>
          <span>OpceanAI</span>
        </div>
      </div>
    </div>
  );
}
