"use client";

import { useEffect, useRef, useState } from "react";
import { onScroll } from "animejs";

interface Stat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
}

const stats: Stat[] = [
  { label: "Founded", value: 2023, suffix: "" },
  { label: "Models Created", value: 10, suffix: "+" },
  { label: "Training Examples", value: 4160, suffix: "" },
  { label: "Token Reduction", value: 57.6, suffix: "%", decimals: 1 },
  { label: "Years of Training Evaded", value: 2.66, suffix: "", decimals: 2 },
];

function AnimatedCounter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * stat.value;

      if (stat.decimals) {
        setCount(parseFloat(current.toFixed(stat.decimals)));
      } else {
        setCount(Math.floor(current));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [started, stat]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-accent tracking-tight">
        {stat.prefix}{count}{stat.suffix}
      </p>
      <p className="text-xs font-mono text-text-quaternary mt-2 uppercase tracking-wider">
        {stat.label}
      </p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-text-quaternary">By the Numbers</span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-text-primary tracking-tight mt-4">
            Built through constraints, not resources
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((stat) => (
            <AnimatedCounter key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
