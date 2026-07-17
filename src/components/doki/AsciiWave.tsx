"use client";

import { useEffect, useRef } from "react";

/**
 * The SSH TUI's DNA on the web: a procedural ASCII wave band. Same family of
 * layered sine swells as ssh/wave.go, drawn from a pre-rendered glyph atlas
 * (luminance-ramp chars × a handful of indigo shades + washi foam) so each
 * frame is nothing but integer-coordinate drawImage calls. Plain rAF,
 * throttled to ~24fps, paused offscreen, DPR capped at 2. Reduced motion
 * gets one static frame. The band keeps the terminal's printed-indigo block
 * color in both themes, exactly like the terminal itself.
 */

// Luminance ramp, dark → bright, then the half-block family for surfaces.
const RAMP = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"];
const SURF = ["▄", "▀", "█", "▓", "▒", "░"];

// Printed-indigo shades (terminal block is theme-invariant) + washi foam.
const SHADES = [
  "#1b2c47", // deep
  "#223757",
  "#2a4468",
  "#33507c",
  "#52709a",
  "#7a9ebf", // asagi light
  "#f2ede4", // washi foam
];

const BG = "#0a121f";
const CELL_W = 9;
const CELL_H = 15;
// Sized so a full block's advance (~0.6em) fills the 9px cell — smaller and
// the sea shows vertical seams between columns.
const FONT_SIZE = 15;
const ROWS = 10;
const FRAME_MS = 1000 / 24;

// Deterministic hash noise in [0,1), same trick as wave.go.
function noise(x: number, y: number, seed: number): number {
  let h = (x * 374761393 + y * 668265263 + seed * 2246822519) >>> 0;
  h ^= h >>> 13;
  h = (h * 1274126177) >>> 0;
  h ^= h >>> 16;
  return h / 4294967296;
}

export default function AsciiWave({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const glyphs = [...RAMP, ...SURF];
    const mono =
      getComputedStyle(canvas).fontFamily || "ui-monospace, monospace";

    // --- offscreen glyph atlas: one cell per (glyph, shade) --------------
    const atlas = document.createElement("canvas");
    atlas.width = Math.round(glyphs.length * CELL_W * dpr);
    atlas.height = Math.round(SHADES.length * CELL_H * dpr);
    const actx = atlas.getContext("2d");
    if (!actx) return;
    actx.scale(dpr, dpr);
    actx.font = `${FONT_SIZE}px ${mono}`;
    actx.textBaseline = "middle";
    actx.textAlign = "center";
    for (let s = 0; s < SHADES.length; s++) {
      actx.fillStyle = SHADES[s];
      for (let g = 0; g < glyphs.length; g++) {
        actx.fillText(
          glyphs[g],
          g * CELL_W + CELL_W / 2,
          s * CELL_H + CELL_H / 2 + 0.5
        );
      }
    }

    let cols = 0;
    let raf = 0;
    let visible = false;
    let last = 0;
    let t = 0;

    const size = () => {
      const w = canvas.clientWidth;
      cols = Math.max(20, Math.floor(w / CELL_W));
      canvas.width = Math.round(cols * CELL_W * dpr);
      canvas.height = Math.round(ROWS * CELL_H * dpr);
      canvas.style.height = `${ROWS * CELL_H}px`;
    };

    // Sprite blit at integer device coords.
    const blit = (col: number, row: number, glyph: number, shade: number) => {
      const sw = Math.round(CELL_W * dpr);
      const sh = Math.round(CELL_H * dpr);
      ctx.drawImage(
        atlas,
        glyph * sw,
        shade * sh,
        sw,
        sh,
        col * sw,
        row * sh,
        sw,
        sh
      );
    };

    // --- the wave field: three parallax swell layers, back to front ------
    // Half-block glyph indices in the atlas.
    const G_UPPER = RAMP.length; // ▄ then ▀ etc — see SURF order
    const draw = () => {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const R = ROWS;
      const frame = Math.floor(t * 6);

      for (let x = 0; x < cols; x++) {
        // Sine-sum surfaces — the flavor of wave.go's far/mid/near swells.
        const far =
          R * 0.32 +
          0.6 * Math.sin(0.27 * x + 0.35 * t) +
          0.4 * Math.sin(0.126 * x - 0.22 * t + 1.7);
        const mid =
          R * 0.55 +
          0.9 * Math.sin(0.18 * x - 0.5 * t + 0.6) +
          0.55 * Math.sin(0.096 * x + 0.31 * t);
        const near =
          R * 0.8 +
          1.1 * Math.sin(0.156 * x + 0.6 * t + 2.1) +
          0.6 * Math.sin(0.072 * x - 0.4 * t);

        const fFar = Math.floor(far);
        const fMid = Math.floor(mid);
        const fNear = Math.floor(near);

        for (let y = 0; y < R; y++) {
          // Which layer owns this cell (front-most wins)?
          let layer = -1;
          let surf = 0;
          let surfRow = 0;
          if (y >= fNear) {
            layer = 2;
            surf = near;
            surfRow = fNear;
          } else if (y >= fMid) {
            layer = 1;
            surf = mid;
            surfRow = fMid;
          } else if (y >= fFar) {
            layer = 0;
            surf = far;
            surfRow = fFar;
          }

          if (layer < 0) continue; // empty sky — Ma

          if (y === surfRow) {
            // Crest line: a half-block riding the fractional surface —
            // the TUI's two-pixels-per-cell trick.
            const frac = surf - surfRow;
            const g = G_UPPER + (frac < 0.5 ? 2 : 0); // █ when high, ▄ when low
            const foamP = layer === 2 ? 0.965 : 0.992;
            const foam = noise(x, frame >> 2, 5 + layer) > foamP;
            const shade = layer === 2 ? 5 : layer === 1 ? 4 : 3;
            // Foam is soft washi shading (░), never a hard white block.
            blit(x, y, foam ? G_UPPER + 5 : g, foam ? 6 : shade);
            continue;
          }

          // Lit surface band: a solid fill directly under each crest gives
          // the sea a continuous body (the TUI calm band), one step darker
          // than its crest line.
          const below = y - surfRow;
          if (below <= 1 + layer) {
            const shade = layer === 2 ? 4 : layer === 1 ? 3 : 2;
            blit(x, y, G_UPPER + 2, shade); // █
            continue;
          }

          // Deep body: sparse printed tone that thickens with depth.
          // Deterministic jitter (no per-frame churn) keeps it flat, like
          // printed ink.
          const depth = (y - surf) / (R * 0.6);
          const jitter = (noise(x, y, 11 + layer) - 0.5) * 0.2;
          const v = Math.max(0, Math.min(1, 0.25 + depth * 0.9 + jitter));
          const g = Math.min(8, 1 + Math.floor(v * 7));
          blit(x, y, g, layer); // far 0-deep … near 2
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (now - last < FRAME_MS) return;
      last = now;
      t += 0.06;
      draw();
    };

    size();
    draw(); // first frame immediately (also the only frame under reduce)

    if (!reduce) {
      const io = new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting;
        },
        { threshold: 0.05 }
      );
      io.observe(canvas);
      raf = requestAnimationFrame(loop);

      const onResize = () => {
        size();
        draw();
      };
      window.addEventListener("resize", onResize);
      return () => {
        io.disconnect();
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
      };
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
      aria-hidden="true"
    />
  );
}
