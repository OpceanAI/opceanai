"use client";

import { useEffect, useRef } from "react";

/**
 * The instrument that reads the ocean — a full-viewport chart recorder.
 *
 * One luminous trace crosses the screen like a tide-gauge / seismograph
 * strip: the paper scrolls left under a fixed write head, carrying tick
 * marks and timestamps with it. The signal is a composite of tidal
 * sum-of-sines, 1/f wander, and occasional decaying seismic wave packets,
 * so it reads as a live measurement, never as random scribble. Behind it,
 * bathymetric contour lines (marching squares over drifting fractal noise)
 * chart an invisible ocean, fading out toward the sky where the headline
 * lives.
 *
 * The pointer deflects the trace near the write head through a critically
 * damped spring, so the line rings briefly after the cursor leaves.
 * prefers-reduced-motion renders one fully-drawn static frame — the trace
 * is prefilled with signal history, never revealed by animation.
 */

const TAU = Math.PI * 2;

// Strip-chart geometry. The paper moves at SCROLL px/s; one sample every
// SAMPLE_PX of paper keeps the polyline dense enough to look continuous.
const SCROLL = 26;
const SAMPLE_PX = 2;
const HEAD_X = 0.62; // write head position as a fraction of width
// The copy sits top-left on wide screens and bottom-left on narrow ones,
// so the recorder band takes the opposite zone.
const TRACE_Y_WIDE = 0.815;
const TRACE_Y_NARROW = 0.33;

// Contour field: coarse lattice, few levels, index contour every 4th —
// the convention real bathymetric charts use.
const ISO_CELL = 30;
const ISO_LEVELS = [0.32, 0.41, 0.5, 0.59, 0.68, 0.77];
const ISO_INDEX = 2; // ISO_LEVELS[2] drawn slightly stronger
const ISO_EVERY = 5; // recompute contours every N frames

// Cream ink on indigo can afford low alphas; indigo ink on washi cannot —
// light surfaces wash faint lines out, so light mode carries darker hues
// AND stronger alphas of its own.
const DARK = {
  skyTop: "#0a111e",
  skyBot: "#0d1626",
  ink: "#f2ede4",
  dim: "#a8b8cc",
  faint: "#52709a",
  iso: "#7a9ebf",
  isoMinor: 0.18,
  isoIndex: 0.3,
  maskTop: 0.3,
  maskMid: 0.6,
  additive: true,
};
const LIGHT = {
  skyTop: "#f3eee5",
  skyBot: "#f0eae0",
  ink: "#16233a",
  dim: "#2e4666",
  faint: "#4a6488",
  iso: "#3e5878",
  isoMinor: 0.36,
  isoIndex: 0.55,
  maskTop: 0.55,
  maskMid: 0.85,
  additive: false,
};

// ---- deterministic value noise ------------------------------------------

const hash2 = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

const smooth = (t: number) => t * t * (3 - 2 * t);

const vnoise2 = (x: number, y: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
};

const fbm2 = (x: number, y: number) =>
  0.5 * vnoise2(x, y) + 0.3 * vnoise2(x * 2.13, y * 2.13) + 0.2 * vnoise2(x * 4.7, y * 4.7);

const vnoise1 = (x: number) => vnoise2(x, 7.31);

// ---- the signal -----------------------------------------------------------

type SeismicEvent = { t0: number; amp: number; w: number; decay: number };

/** Tide + wander + active wave packets, in normalized units (~±1). */
function signalAt(t: number, events: SeismicEvent[]) {
  // Incommensurate periods so the tide never visibly loops.
  let v =
    0.34 * Math.sin(t * 0.21) +
    0.2 * Math.sin(t * 0.337 + 1.7) +
    0.11 * Math.sin(t * 0.53 + 0.4) +
    0.3 * (vnoise1(t * 0.23) - 0.5) * 2 +
    0.05 * (vnoise1(t * 1.3) - 0.5) * 2;
  for (const e of events) {
    const dt = t - e.t0;
    if (dt <= 0) continue;
    // P-wave onset then ringing coda: fast attack, exponential decay.
    const env = e.amp * Math.min(dt * 6, 1) * Math.exp(-e.decay * dt);
    if (env > 0.004) v += env * Math.sin(e.w * dt);
  }
  return v;
}

// ---------------------------------------------------------------------------

export default function OceanInstrument({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mono =
      getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono") ||
      "ui-monospace, monospace";

    let pal = DARK;
    let W = 0;
    let H = 0;
    let narrow = false;

    // Offscreen contour layer, refreshed every ISO_EVERY frames.
    const iso = document.createElement("canvas");
    const ictx = iso.getContext("2d");
    if (!ictx) return;

    // --- recorder state ---------------------------------------------------
    // The ring buffer holds normalized samples; head is the newest index.
    // Paper position is measured in samples so ticks and annotations stay
    // glued to the paper as it scrolls.
    let buf = new Float32Array(0);
    let cap = 0;
    let head = 0; // total samples ever written
    let simT = 0; // signal clock (s)
    let carry = 0; // sub-sample scroll accumulator (px)
    const events: SeismicEvent[] = [];
    let nextEventAt = 6 + Math.random() * 6;
    const marks: { sample: number; label: string }[] = [];

    // Pointer spring: amp follows a target deflection, critically damped-ish
    // so the trace rings a little after release.
    let px = -1e4;
    let py = -1e4;
    let springY = 0;
    let springV = 0;

    const samplesPerSec = SCROLL / SAMPLE_PX;

    const pushSample = () => {
      simT += 1 / samplesPerSec;
      // Spawn quakes on a loose poisson clock; label them on the paper.
      if (simT >= nextEventAt) {
        const amp = 0.3 + Math.random() * 0.45;
        // Keep the ringing below ~1.5 Hz: at 13 samples/s anything faster
        // renders as jagged aliasing, not a wave packet.
        events.push({
          t0: simT,
          amp,
          w: 5 + Math.random() * 5,
          decay: 0.5 + Math.random() * 0.45,
        });
        marks.push({
          sample: head,
          label: `M ${(1.4 + amp * 2.2).toFixed(1)}`,
        });
        nextEventAt = simT + 18 + Math.random() * 20;
      }
      for (let i = events.length - 1; i >= 0; i--) {
        if ((simT - events[i].t0) * events[i].decay > 6) events.splice(i, 1);
      }
      // The pointer deflection is recorded onto the paper, not painted over
      // it — the needle felt you, and the mark scrolls away with the chart.
      buf[head % cap] = signalAt(simT, events) + springY;
      head++;
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      W = w;
      H = h;
      narrow = W < H * 0.8;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      iso.width = Math.round(W * dpr);
      iso.height = Math.round(H * dpr);
      cap = Math.ceil(W / SAMPLE_PX) + 8;
      buf = new Float32Array(cap);
      head = 0;
      simT = 0;
      marks.length = 0;
      events.length = 0;
      nextEventAt = 6 + Math.random() * 6;
      // Prefill a full width of history so the chart is complete on first
      // paint — the content is visible by default, never revealed.
      for (let i = 0; i < cap; i++) pushSample();
    };

    const readTheme = () => {
      pal = document.documentElement.classList.contains("dark") ? DARK : LIGHT;
    };
    readTheme();
    resize();

    // --- contour layer ------------------------------------------------------
    const drawIso = (t: number) => {
      ictx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ictx.clearRect(0, 0, W, H);
      const cell = narrow ? ISO_CELL * 1.4 : ISO_CELL;
      const gw = Math.ceil(W / cell) + 1;
      const gh = Math.ceil(H / cell) + 1;
      const f = new Float32Array(gw * gh);
      const dx = t * 0.011;
      const dy = t * 0.004;
      for (let j = 0; j < gh; j++) {
        for (let i = 0; i < gw; i++) {
          f[j * gw + i] = fbm2(i * 0.14 + dx, j * 0.19 + dy);
        }
      }
      ictx.lineCap = "round";
      for (let li = 0; li < ISO_LEVELS.length; li++) {
        const lv = ISO_LEVELS[li];
        const index = li === ISO_INDEX;
        ictx.strokeStyle = pal.iso;
        ictx.globalAlpha = index ? pal.isoIndex : pal.isoMinor;
        ictx.lineWidth = index ? 1.2 : 0.9;
        ictx.beginPath();
        for (let j = 0; j < gh - 1; j++) {
          for (let i = 0; i < gw - 1; i++) {
            const a = f[j * gw + i];
            const b = f[j * gw + i + 1];
            const c = f[(j + 1) * gw + i + 1];
            const d = f[(j + 1) * gw + i];
            let cs = 0;
            if (a > lv) cs |= 8;
            if (b > lv) cs |= 4;
            if (c > lv) cs |= 2;
            if (d > lv) cs |= 1;
            if (cs === 0 || cs === 15) continue;
            const x0 = i * cell;
            const y0 = j * cell;
            // Interpolated edge crossings: top, right, bottom, left.
            const tx = x0 + ((lv - a) / (b - a)) * cell;
            const ry = y0 + ((lv - b) / (c - b)) * cell;
            const bx = x0 + ((lv - d) / (c - d)) * cell;
            const ly = y0 + ((lv - a) / (d - a)) * cell;
            const seg = (xa: number, ya: number, xb: number, yb: number) => {
              ictx.moveTo(xa, ya);
              ictx.lineTo(xb, yb);
            };
            switch (cs) {
              case 1: case 14: seg(x0, ly, bx, y0 + cell); break;
              case 2: case 13: seg(bx, y0 + cell, x0 + cell, ry); break;
              case 3: case 12: seg(x0, ly, x0 + cell, ry); break;
              case 4: case 11: seg(tx, y0, x0 + cell, ry); break;
              case 5:          seg(x0, ly, tx, y0); seg(bx, y0 + cell, x0 + cell, ry); break;
              case 6: case 9:  seg(tx, y0, bx, y0 + cell); break;
              case 7: case 8:  seg(x0, ly, tx, y0); break;
              case 10:         seg(tx, y0, x0 + cell, ry); seg(x0, ly, bx, y0 + cell); break;
            }
          }
        }
        ictx.stroke();
      }
      ictx.globalAlpha = 1;
      // Fade the chart out toward the sky so the headline sits on calm paper.
      ictx.globalCompositeOperation = "destination-in";
      const g = ictx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, `rgba(0,0,0,${pal.maskTop})`);
      g.addColorStop(0.42, `rgba(0,0,0,${pal.maskMid})`);
      g.addColorStop(0.75, "rgba(0,0,0,1)");
      ictx.fillStyle = g;
      ictx.fillRect(0, 0, W, H);
      ictx.globalCompositeOperation = "source-over";

      // Soundings: bare depth numbers scattered at the point of measurement —
      // no boxes, no leader lines, exactly as nautical charts set them.
      if (!narrow) {
        const spots: [number, number][] = [
          [0.16, 0.55],
          [0.38, 0.67],
          [0.63, 0.52],
          [0.87, 0.63],
        ];
        ictx.font = `10px ${mono}`;
        ictx.textAlign = "center";
        ictx.textBaseline = "middle";
        ictx.fillStyle = pal.iso;
        ictx.globalAlpha = 0.5;
        for (const [fx, fy] of spots) {
          const depth =
            600 + Math.round(fbm2(fx * 9.7, fy * 7.3) * 2600 / 10) * 10;
          ictx.fillText(String(depth), fx * W, fy * H);
        }
        ictx.globalAlpha = 1;
      }
    };

    // --- main frame -------------------------------------------------------
    let frame = 0;
    let raf = 0;
    let running = false;
    let last = performance.now();

    const fmtClock = (s: number) => {
      const m = Math.floor(s / 60);
      const ss = Math.floor(s % 60);
      return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    };

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      // Advance the paper.
      carry += SCROLL * dt;
      while (carry >= SAMPLE_PX) {
        carry -= SAMPLE_PX;
        pushSample();
      }

      // Pointer spring toward a deflection set by cursor proximity to the
      // trace band near the write head.
      const headX = W * HEAD_X;
      const traceY = H * (narrow ? TRACE_Y_NARROW : TRACE_Y_WIDE);
      const amp = Math.min(H * (narrow ? 0.05 : 0.07), 76);
      let target = 0;
      if (fine && px > -1e3) {
        const dxp = (px - headX) / (W * 0.22);
        const dyp = (py - traceY) / (H * 0.28);
        const prox = Math.exp(-(dxp * dxp + dyp * dyp));
        target = Math.max(-0.5, Math.min(0.5, (traceY - py) / (H * 0.3))) * prox;
      }
      const k = 42;
      const cdamp = 8.5;
      springV += (k * (target - springY) - cdamp * springV) * dt;
      springY += springV * dt;

      if (frame % ISO_EVERY === 0) drawIso(now / 1000);
      frame++;

      // Sky.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, pal.skyTop);
      sky.addColorStop(1, pal.skyBot);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(iso, 0, 0, W, H);

      // Paper furniture: baseline, scrolling ticks, static frame labels.
      const sampleToX = (s: number) => headX - (head - 1 - s) * SAMPLE_PX - carry;
      ctx.strokeStyle = pal.faint;
      ctx.globalAlpha = 0.58;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, traceY + 0.5);
      ctx.lineTo(W, traceY + 0.5);
      ctx.stroke();

      ctx.font = `10px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const minor = Math.round(samplesPerSec * 2);
      const major = minor * 5;
      const first = Math.max(0, head - cap);
      for (let s = Math.ceil(first / minor) * minor; s < head; s += minor) {
        const x = sampleToX(s);
        if (x < -40 || x > W + 40) continue;
        const isMajor = s % major === 0;
        ctx.globalAlpha = isMajor ? 0.5 : 0.3;
        ctx.strokeStyle = pal.faint;
        ctx.beginPath();
        ctx.moveTo(x, traceY);
        ctx.lineTo(x, traceY + (isMajor ? 12 : 6));
        ctx.stroke();
        if (isMajor && !narrow) {
          ctx.fillStyle = pal.faint;
          ctx.globalAlpha = 0.5;
          ctx.fillText(fmtClock(s / samplesPerSec), x, traceY + 16);
        }
      }

      // Event marks scroll with the paper.
      ctx.textBaseline = "bottom";
      for (let i = marks.length - 1; i >= 0; i--) {
        const m = marks[i];
        if (m.sample < head - cap) { marks.splice(i, 1); continue; }
        const x = sampleToX(m.sample);
        if (x < -60) continue;
        ctx.strokeStyle = pal.dim;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(x, traceY - amp * 1.18);
        ctx.lineTo(x, traceY - amp * 1.02);
        ctx.stroke();
        if (!narrow) {
          ctx.fillStyle = pal.dim;
          ctx.globalAlpha = 0.55;
          ctx.fillText(m.label, x, traceY - amp * 1.24);
        }
      }

      // The trace. Deflection bump is applied spatially around the head so
      // pointer energy stays local and scrolls away naturally.
      const n = Math.min(cap - 4, Math.floor(W / SAMPLE_PX) + 2);
      const sigma2 = 2 * Math.pow(W * 0.07, 2);
      const yAt = (i: number) => {
        const s = head - 1 - i;
        const x = headX - i * SAMPLE_PX - carry;
        const bump = springY * Math.exp(-Math.pow(x - headX, 2) / sigma2);
        return { x, y: traceY - (buf[((s % cap) + cap) % cap] + bump) * amp };
      };

      const strokeTrace = (width: number, alpha: number, color: string) => {
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        for (let i = n; i >= 0; i--) {
          const p = yAt(i);
          if (i === n) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      };

      // Matte woodblock ink, not neon: the halo stays under ~8%.
      if (pal.additive) {
        ctx.globalCompositeOperation = "lighter";
        strokeTrace(6, 0.07, pal.ink);
        strokeTrace(2.6, 0.13, pal.ink);
        ctx.globalCompositeOperation = "source-over";
      } else {
        strokeTrace(4, 0.24, pal.ink);
      }

      // Core pass with beam physics: a slow pen deposits more ink than a
      // fast one, so flat stretches burn brighter and thicker than spikes.
      const BATCH = 24;
      ctx.strokeStyle = pal.ink;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (let b = n; b > 0; b -= BATCH) {
        const to = Math.max(0, b - BATCH);
        let travel = 0;
        let prev = yAt(b);
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        for (let i = b - 1; i >= to; i--) {
          const p = yAt(i);
          travel += Math.abs(p.y - prev.y);
          ctx.lineTo(p.x, p.y);
          prev = p;
        }
        const speed = travel / (BATCH * SAMPLE_PX);
        const slow = 1 / (1 + speed * 2.2);
        ctx.lineWidth = 1.25 + 0.85 * slow;
        ctx.globalAlpha = 0.65 + 0.35 * slow;
        ctx.stroke();
      }

      // Helicorder minute marks: tiny upticks embedded in the trace itself —
      // the timebase lives in the line, not in a grid.
      const minuteN = Math.round(samplesPerSec * 15);
      ctx.strokeStyle = pal.ink;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (
        let s = Math.ceil((head - cap) / minuteN) * minuteN;
        s < head;
        s += minuteN
      ) {
        const x = sampleToX(s);
        if (x < 0 || x > W) continue;
        const y = traceY - buf[((s % cap) + cap) % cap] * amp;
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Calibration pulse on the left margin — the recorder declares its
      // scale before the signal begins (ECG strip convention).
      if (!narrow) {
        const cm = 40;
        ctx.strokeStyle = pal.ink;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(cm, traceY + 0.5);
        ctx.lineTo(cm + 8, traceY + 0.5);
        ctx.lineTo(cm + 8, traceY - 14.5);
        ctx.lineTo(cm + 22, traceY - 14.5);
        ctx.lineTo(cm + 22, traceY + 0.5);
        ctx.lineTo(cm + 30, traceY + 0.5);
        ctx.stroke();
        ctx.fillStyle = pal.faint;
        ctx.globalAlpha = 0.45;
        ctx.font = `9px ${mono}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("CAL 10 mm", cm, traceY + 8);
      }

      // Write head: bright bead, hairline cursor, live readout.
      const hp = yAt(0);
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = pal.faint;
      ctx.beginPath();
      ctx.moveTo(headX + 0.5, traceY - amp * 1.3);
      ctx.lineTo(headX + 0.5, traceY + amp * 0.7);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = pal.ink;
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, 2.2, 0, TAU);
      ctx.fill();
      if (pal.additive) {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        ctx.arc(hp.x, hp.y, 8, 0, TAU);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }
      const val = (traceY - hp.y) / amp;
      ctx.font = `10px ${mono}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = pal.dim;
      ctx.globalAlpha = 0.88;
      ctx.fillText(`${val >= 0 ? "+" : "−"}${Math.abs(val * 2.4).toFixed(2)} m`, headX + 10, hp.y - 14);

      // Chart-plate colophon: station ID and datum line along the bottom
      // margin, the way a printed sheet declares itself.
      ctx.globalAlpha = 0.58;
      ctx.fillStyle = pal.faint;
      ctx.textBaseline = "alphabetic";
      ctx.font = `10px ${mono}`;
      const margin = narrow ? 20 : 40;
      ctx.textAlign = "left";
      // x offset clears the floating theme button in the corner.
      ctx.fillText(
        narrow ? "STA OPC-01 · CH Z" : "STA OPC-01 · CH Z · 36°12′N 142°54′E",
        margin + 44,
        H - 22
      );
      if (!narrow) {
        ctx.textAlign = "right";
        ctx.fillText("DEPTHS IN METRES · DATUM LAT · 25 MM/S", W - margin, H - 22);
      }
      ctx.globalAlpha = 1;

      if (!reduce && running) raf = requestAnimationFrame(draw);
    };

    // Run only while the hero is on screen and the tab is visible — an
    // animating canvas below the fold is pure battery drain.
    let onScreen = true;
    let tabVisible = !document.hidden;
    const syncLoop = () => {
      const should = onScreen && tabVisible && !reduce;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(draw);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    };
    const onLeave = () => {
      px = -1e4;
      py = -1e4;
    };

    const ro = new ResizeObserver(() => {
      resize();
      drawIso(performance.now() / 1000);
      if (reduce) draw(performance.now());
    });
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      readTheme();
      drawIso(performance.now() / 1000);
      if (reduce) draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    if (fine && !reduce) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
    }

    const io = new IntersectionObserver((entries) => {
      onScreen = entries[0]?.isIntersecting ?? true;
      syncLoop();
    });
    io.observe(canvas);
    const onVisibility = () => {
      tabVisible = !document.hidden;
      syncLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    drawIso(performance.now() / 1000);
    if (reduce) draw(performance.now());
    else syncLoop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
