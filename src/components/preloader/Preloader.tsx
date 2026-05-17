"use client";

import { useState, useEffect, useRef } from "react";
import { animate } from "animejs";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"typing" | "done" | "fade">("typing");
  const [text, setText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const fullText = "OpceanAI";

  useEffect(() => {
    const stored = sessionStorage.getItem("opceanai-preloader");
    if (stored) {
      setVisible(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("done"), 400);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing") return;
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blink);
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;

    setTimeout(() => {
      setPhase("fade");
      if (containerRef.current) {
        animate(containerRef.current, {
          opacity: 0,
          duration: 600,
          ease: "out(3)",
          complete: () => {
            setVisible(false);
            sessionStorage.setItem("opceanai-preloader", "true");
          },
        });
      }
    }, 800);
  }, [phase]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-canvas flex items-center justify-center"
    >
      <div className="text-center">
        <div className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-text-primary tracking-tight">
          {text}
          <span
            className="inline-block w-0.5 h-8 sm:h-10 bg-accent ml-1 align-middle"
            style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
          />
        </div>
        <p className="text-text-quaternary text-xs font-mono mt-4 tracking-widest uppercase">
          {phase === "typing" ? "initializing" : "ready"}
        </p>
      </div>
    </div>
  );
}
