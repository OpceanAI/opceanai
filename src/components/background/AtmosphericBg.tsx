"use client";

import { useMemo } from "react";

export default function AtmosphericBg() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* Star field — Linear-style */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            "--star-duration": `${star.duration}s`,
            "--star-delay": `${star.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Aurora effect — top */}
      <div className="aurora" />

      {/* Gradient mesh — subtle cyan depth */}
      <div
        className="absolute rounded-full"
        style={{
          width: "800px",
          height: "800px",
          top: "-10%",
          left: "-5%",
          background: "radial-gradient(circle, rgba(45, 212, 191, 0.03) 0%, transparent 60%)",
          filter: "blur(80px)",
          animation: "orb-drift-1 45s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "600px",
          height: "600px",
          top: "40%",
          right: "-10%",
          background: "radial-gradient(circle, rgba(45, 212, 191, 0.02) 0%, transparent 50%)",
          filter: "blur(60px)",
          animation: "orb-drift-2 50s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "500px",
          height: "500px",
          bottom: "-5%",
          left: "30%",
          background: "radial-gradient(circle, rgba(148, 163, 184, 0.02) 0%, transparent 50%)",
          filter: "blur(50px)",
          animation: "orb-drift-3 40s ease-in-out infinite",
        }}
      />

      {/* Ambient depth fog */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(8, 9, 10, 0) 0%, rgba(8, 9, 10, 0.4) 100%)",
        }}
      />

      <style jsx>{`
        @keyframes orb-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -20px) scale(1.03); }
          50% { transform: translate(-15px, 25px) scale(0.97); }
          75% { transform: translate(-25px, -10px) scale(1.02); }
        }
        @keyframes orb-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-20px, 30px) scale(1.02); }
          50% { transform: translate(25px, -15px) scale(0.98); }
          75% { transform: translate(15px, 20px) scale(1.01); }
        }
        @keyframes orb-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -25px) scale(1.04); }
          66% { transform: translate(-25px, 15px) scale(0.96); }
        }
      `}</style>
    </div>
  );
}
