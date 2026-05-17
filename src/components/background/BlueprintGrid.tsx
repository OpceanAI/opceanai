"use client";

import { useEffect, useRef } from "react";

interface BlueprintGridProps {
  variant?: "lines" | "dots" | "isometric" | "mouse-reactive" | "animated";
  opacity?: number;
  size?: number;
  className?: string;
}

export default function BlueprintGrid({
  variant = "lines",
  opacity = 0.03,
  size = 24,
  className = "",
}: BlueprintGridProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || variant !== "mouse-reactive") return;

    const handleMove = (e: MouseEvent) => {
      const rect = ref.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ref.current!.style.setProperty("--mouse-x", `${x}px`);
      ref.current!.style.setProperty("--mouse-y", `${y}px`);
    };

    ref.current.addEventListener("mousemove", handleMove, { passive: true });
    return () => ref.current?.removeEventListener("mousemove", handleMove);
  }, [variant]);

  const variantClass = {
    lines: "blueprint-grid",
    dots: "blueprint-grid-dot",
    isometric: "blueprint-grid-isometric",
    "mouse-reactive": "blueprint-grid-mouse",
    animated: "blueprint-grid-animated",
  }[variant];

  return (
    <div
      ref={ref}
      className={`${variantClass} ${className}`}
      style={{ opacity, backgroundSize: variant !== "dots" ? `${size}px ${size}px` : undefined }}
    />
  );
}
