"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const charSet = " .'`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

function AsciiText({ text = "OpceanAI" }: { text?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const size = 512;
    canvas.width = size;
    canvas.height = size / 4;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 80px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [text]);

  const asciiTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const cellSize = 12;
    const cols = 80;
    const rows = 20;
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = cols;
    srcCanvas.height = rows;
    const srcCtx = srcCanvas.getContext("2d")!;
    srcCtx.fillStyle = "#000000";
    srcCtx.fillRect(0, 0, cols, rows);
    srcCtx.font = "bold 10px monospace";
    srcCtx.fillStyle = "#ffffff";
    srcCtx.textAlign = "center";
    srcCtx.textBaseline = "middle";
    srcCtx.fillText(text, cols / 2, rows / 2);

    const srcData = srcCtx.getImageData(0, 0, cols, rows).data;

    ctx.font = `${cellSize - 2}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = (y * cols + x) * 4;
        const brightness = srcData[idx] / 255;
        const charIdx = Math.floor(brightness * (charSet.length - 1));
        const char = charSet[charIdx];

        const alpha = brightness;
        const r = Math.round(45 + (45 - 45) * alpha);
        const g = Math.round(212 * alpha);
        const b = Math.round(191 * alpha);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`;
        ctx.fillText(char, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [text]);

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
    if (meshRef.current) {
      const t = timeRef.current;
      const m = mouseRef.current;

      meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.1 + m.x * 0.15;
      meshRef.current.rotation.x = Math.cos(t * 0.2) * 0.05 + m.y * 0.08;

      const pos = meshRef.current.geometry.attributes.position;
      if (pos) {
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const wave = Math.sin(x * 2 + t * 1.5) * 0.03 + Math.cos(y * 3 + t) * 0.02;
          pos.setZ(i, wave);
        }
        pos.needsUpdate = true;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[6, 1.5, 60, 20]} />
      <meshBasicMaterial map={asciiTexture} transparent opacity={0.7} depthWrite={false} />
    </mesh>
  );
}

function FallingChars() {
  const count = 200;
  const chars = useMemo(() => {
    return Array.from({ length: count }, () => ({
      char: charSet[Math.floor(Math.random() * charSet.length)],
      x: (Math.random() - 0.5) * 20,
      y: Math.random() * 10 + 5,
      z: (Math.random() - 0.5) * 10,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.15 + 0.02,
      size: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const c = chars[i];
        child.position.y = ((c.y - timeRef.current * c.speed) % 15) - 2;
        child.position.x = c.x + Math.sin(timeRef.current * 0.5 + i) * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {chars.map((c, i) => (
        <TextSprite key={i} char={c.char} position={[c.x, c.y, c.z]} opacity={c.opacity} size={c.size} />
      ))}
    </group>
  );
}

function TextSprite({ char, position, opacity, size }: { char: string; position: [number, number, number]; opacity: number; size: number }) {
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext("2d")!;
    ctx.font = "bold 48px 'JetBrains Mono', monospace";
    ctx.fillStyle = `rgba(45, 212, 191, ${opacity})`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, 32, 32);
    return c;
  }, [char, opacity]);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.needsUpdate = true;
    return t;
  }, [canvas]);

  return (
    <sprite position={position}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function ParticleField() {
  const count = 1500;
  const meshRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const mix = Math.random();
      arr[i * 3] = 0.177 * mix;
      arr[i * 3 + 1] = 0.831 * mix + 0.1;
      arr[i * 3 + 2] = 0.749 * mix + 0.1;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (meshRef.current) {
      meshRef.current.rotation.y = timeRef.current * 0.02;
      const pos = meshRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        pos.setX(i, x + Math.sin(timeRef.current * 0.3 + y) * 0.002);
        pos.setY(i, y + Math.cos(timeRef.current * 0.2 + x) * 0.002);
        pos.setZ(i, z + Math.sin(timeRef.current * 0.1 + x + y) * 0.001);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

export default function AsciiHero() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <ParticleField />
        <AsciiText />
        <FallingChars />
      </Canvas>
    </div>
  );
}
