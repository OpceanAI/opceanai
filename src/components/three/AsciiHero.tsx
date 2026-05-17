"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, ASCII } from "@react-three/postprocessing";
import * as THREE from "three";

function AsciiObjects({ mobile = false }: { mobile?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      const rotSpeed = mobile ? delta * 0.08 : delta * 0.15;
      groupRef.current.rotation.y += rotSpeed;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.1;
    }
    if (meshRef.current) {
      const targetRotY = mouseRef.current.x * 0.5;
      const targetRotX = mouseRef.current.y * 0.3;
      meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.05} />
      {mobile ? (
        <directionalLight position={[5, 5, 5]} intensity={2} />
      ) : (
        <>
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <directionalLight position={[-5, 3, -3]} intensity={0.5} />
          <directionalLight position={[0, -3, 5]} intensity={0.3} />
        </>
      )}

      <group ref={groupRef}>
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[1.2, 0.4, mobile ? 48 : 128, mobile ? 12 : 32]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
        </mesh>

        <mesh position={[3, 0.5, -2]}>
          <icosahedronGeometry args={[0.8, mobile ? 0 : 1]} />
          <meshStandardMaterial color="#16213e" metalness={0.5} roughness={0.5} />
        </mesh>

        <mesh position={[-3, -0.5, -1]}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#0f3460" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>
    </>
  );
}

function AsciiPostProcessing({ color, invert, mobile }: { color: string; invert: boolean; mobile: boolean }) {
  return (
    <EffectComposer>
      <ASCII
        cellSize={mobile ? 14 : 10}
        color={color}
        invert={invert}
        fontSize={mobile ? 40 : 60}
      />
    </EffectComposer>
  );
}

function GradientMesh() {
  return (
    <div className="hero-mesh">
      <div className="hero-mesh-orb" />
      <div className="hero-mesh-orb" />
      <div className="hero-mesh-orb" />
    </div>
  );
}

export default function AsciiHero() {
  const [dark, setDark] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const asciiColor = dark ? "#2dd4bf" : "#0d9488";
  const invert = dark;

  return (
    <div className="absolute inset-0 -z-10 opacity-35">
      {isMobile ? (
        <GradientMesh />
      ) : (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ alpha: true, antialias: false }}
          style={{ background: "transparent" }}
        >
          <AsciiObjects mobile={false} />
          <AsciiPostProcessing color={asciiColor} invert={invert} mobile={false} />
        </Canvas>
      )}
    </div>
  );
}
