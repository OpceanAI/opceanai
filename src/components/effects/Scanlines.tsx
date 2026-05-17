"use client";

export default function Scanlines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)",
        mixBlendMode: "multiply",
      }}
    />
  );
}
