"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorFollower() {
  const followerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });
  const followerPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, .glass-panel, input, textarea, [role='button']")
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    let rafId: number;
    const animate = () => {
      const dx = posRef.current.x - followerPosRef.x;
      const dy = posRef.current.y - followerPosRef.y;
      followerPosRef.x += dx * 0.12;
      followerPosRef.y += dy * 0.12;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${followerPosRef.x}px, ${followerPosRef.y}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [visible]);

  return (
    <div
      ref={followerRef}
      className={`cursor-follower ${hovering ? "hovering" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 300ms, width 200ms, height 200ms, background 200ms, border-color 200ms",
      }}
    />
  );
}
