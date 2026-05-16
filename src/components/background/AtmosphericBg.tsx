"use client";

export default function AtmosphericBg() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* Light mode orbs — warm painterly tones */}
      <div
        className="absolute rounded-full transition-opacity duration-500 opacity-40 dark:opacity-0"
        style={{
          width: "700px",
          height: "700px",
          top: "5%",
          left: "10%",
          background:
            "radial-gradient(circle, rgba(127, 169, 201, 0.20) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orb-drift-1 35s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full transition-opacity duration-500 opacity-40 dark:opacity-0"
        style={{
          width: "600px",
          height: "600px",
          top: "45%",
          right: "5%",
          background:
            "radial-gradient(circle, rgba(167, 240, 229, 0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orb-drift-2 40s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full transition-opacity duration-500 opacity-30 dark:opacity-0"
        style={{
          width: "500px",
          height: "500px",
          bottom: "5%",
          left: "35%",
          background:
            "radial-gradient(circle, rgba(169, 200, 142, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orb-drift-3 30s ease-in-out infinite",
        }}
      />

      {/* Dark mode orbs — deep night cyan/teal */}
      <div
        className="absolute rounded-full transition-opacity duration-500 opacity-0 dark:opacity-100"
        style={{
          width: "700px",
          height: "700px",
          top: "5%",
          left: "10%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 50%)",
          filter: "blur(60px)",
          animation: "orb-drift-1 35s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full transition-opacity duration-500 opacity-0 dark:opacity-100"
        style={{
          width: "600px",
          height: "600px",
          top: "45%",
          right: "5%",
          background:
            "radial-gradient(circle, rgba(79, 191, 210, 0.06) 0%, transparent 50%)",
          filter: "blur(60px)",
          animation: "orb-drift-2 40s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full transition-opacity duration-500 opacity-0 dark:opacity-100"
        style={{
          width: "500px",
          height: "500px",
          bottom: "5%",
          left: "35%",
          background:
            "radial-gradient(circle, rgba(148, 163, 184, 0.05) 0%, transparent 50%)",
          filter: "blur(50px)",
          animation: "orb-drift-3 30s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full transition-opacity duration-500 opacity-0 dark:opacity-100"
        style={{
          width: "450px",
          height: "450px",
          top: "20%",
          right: "25%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.04) 0%, transparent 50%)",
          filter: "blur(50px)",
          animation: "orb-drift-4 45s ease-in-out infinite",
        }}
      />

      {/* Watercolor blobs — painterly washes, both modes */}
      <div
        className="absolute rounded-full"
        style={{
          width: "900px",
          height: "900px",
          top: "-10%",
          right: "-15%",
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(95, 136, 178, 0.10) 0%, rgba(167, 240, 229, 0.06) 40%, transparent 70%)",
          filter: "blur(80px)",
          animation: "blob-drift-1 50s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "800px",
          height: "800px",
          bottom: "-15%",
          left: "-10%",
          background:
            "radial-gradient(ellipse at 60% 60%, rgba(127, 169, 201, 0.08) 0%, rgba(216, 210, 162, 0.05) 45%, transparent 70%)",
          filter: "blur(80px)",
          animation: "blob-drift-2 55s ease-in-out infinite",
        }}
      />

      <style jsx>{`
        @keyframes orb-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(40px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 35px) scale(0.95); }
          75% { transform: translate(-35px, -15px) scale(1.03); }
        }
        @keyframes orb-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-30px, 40px) scale(1.04); }
          50% { transform: translate(35px, -20px) scale(0.96); }
          75% { transform: translate(20px, 30px) scale(1.02); }
        }
        @keyframes orb-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -35px) scale(1.06); }
          66% { transform: translate(-35px, 20px) scale(0.94); }
        }
        @keyframes orb-drift-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 30px) scale(1.07); }
        }
        @keyframes blob-drift-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(60px, 40px) rotate(5deg) scale(1.03); }
          66% { transform: translate(-40px, -30px) rotate(-3deg) scale(0.97); }
        }
        @keyframes blob-drift-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(-50px, 30px) rotate(-4deg) scale(1.02); }
          66% { transform: translate(30px, -40px) rotate(3deg) scale(0.98); }
        }
      `}</style>
    </div>
  );
}
