"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { ASCIIEffect } from "./ASCIIEffect";
import * as THREE from "three";

function AsciiScene({ dark }: { dark: boolean }) {
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
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.1;
    }
    if (meshRef.current) {
      const targetRotY = mouseRef.current.x * 0.5;
      const targetRotX = mouseRef.current.y * 0.3;
      meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.05;
    }
  });

  const asciiColor = dark ? "#2dd4bf" : "#0d9488";
  const invert = dark ? 1.0 : 0.0;

  return (
    <>
      <ambientLight intensity={0.05} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, 3, -3]} intensity={0.5} />
      <directionalLight position={[0, -3, 5]} intensity={0.3} />

      <group ref={groupRef}>
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
          <meshStandardMaterial
            color={dark ? "#1a1a2e" : "#e0e0e0"}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        <mesh position={[3, 0.5, -2]}>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial
            color={dark ? "#16213e" : "#d0d0d0"}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>

        <mesh position={[-3, -0.5, -1]}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color={dark ? "#0f3460" : "#c0c0c0"}
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
      </group>

      <AsciiPostProcessing color={asciiColor} invert={invert} />
    </>
  );
}

function AsciiPostProcessing({ color, invert }: { color: string; invert: number }) {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));

    const asciiEffect = new ASCIIEffect({
      cellSize: 10,
      color: color,
      invert: invert === 1,
      fontSize: 60,
    });

    const effectPass = new EffectPass(camera, asciiEffect);
    composer.addPass(effectPass);

    composerRef.current = composer;

    return () => {
      composer.dispose();
    };
  }, [gl, scene, camera, color, invert]);

  useFrame((_, delta) => {
    if (composerRef.current) {
      composerRef.current.render(delta);
    }
  }, 1);

  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.setSize(size.width, size.height);
    }
  }, [size]);

  return null;
}

export default function AsciiHero() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      setDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute inset-0 -z-10 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: false }}
        style={{ background: "transparent" }}
      >
        <AsciiScene dark={dark} />
      </Canvas>
    </div>
  );
}
