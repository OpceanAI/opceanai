"use client";

import { useEffect, useState, useCallback } from "react";

interface Shortcut {
  key: string;
  macKey?: string;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const [showModal, setShowModal] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowModal((v) => !v);
        return;
      }

      if (e.key === "Escape") {
        setShowModal(false);
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

      for (const s of shortcuts) {
        const targetKey = isMac && s.macKey ? s.macKey : s.key;

        if (targetKey.includes("+")) {
          const parts = targetKey.split("+");
          const modifier = parts[0];
          const key = parts[1];

          const modPressed =
            (modifier === "Cmd" && e.metaKey) ||
            (modifier === "Ctrl" && e.ctrlKey);

          if (modPressed && e.key.toLowerCase() === key.toLowerCase()) {
            e.preventDefault();
            s.action();
            return;
          }
        } else if (e.key.toLowerCase() === targetKey.toLowerCase()) {
          const tag = (e.target as HTMLElement).tagName;
          if (tag === "INPUT" || tag === "TEXTAREA") return;
          e.preventDefault();
          s.action();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { showModal, setShowModal };
}

export default function KeyboardShortcutsModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible) return null;

  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  const shortcuts = [
    { keys: isMac ? ["Cmd", "K"] : ["Ctrl", "K"], desc: "Open search" },
    { keys: ["J"], desc: "Next section" },
    { keys: ["K"], desc: "Previous section" },
    { keys: ["/"], desc: "Focus search" },
    { keys: ["?"], desc: "Show shortcuts" },
    { keys: ["Esc"], desc: "Close overlays" },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "var(--spotlight-bg)" }}
      />
      <div
        className="relative glass-panel p-8 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-xl font-medium text-text-primary mb-6">
          Keyboard Shortcuts
        </h3>
        <div className="space-y-3">
          {shortcuts.map((s) => (
            <div
              key={s.desc}
              className="flex items-center justify-between py-2"
            >
              <span className="text-sm text-text-tertiary">{s.desc}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, i) => (
                  <span key={i}>
                    <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-mono text-text-secondary bg-surface-2 border border-border-default rounded-md">
                      {k}
                    </kbd>
                    {i < s.keys.length - 1 && (
                      <span className="text-text-quaternary mx-1">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-quaternary mt-6 text-center">
          Press ? to toggle this panel
        </p>
      </div>
    </div>
  );
}
