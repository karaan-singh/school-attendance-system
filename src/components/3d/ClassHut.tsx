'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SchoolClassData } from '@/types';
import { Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { forestAudio } from '@/lib/audio';

interface ClassHutProps {
  classData: SchoolClassData;
  position: [number, number, number];
  rotation?: [number, number, number];
  onSelect: (classData: SchoolClassData) => void;
}

// Curated pastel clay palettes inspired by image.png
const CLAY_MUSHROOM_PALETTES = [
  {
    name: 'Strawberry Pink',
    cap: '#f79db3',       // The exact warm soft clay pink in image.png!
    capAccent: '#f06292',
    door: '#f8a6bc',      // Matches the pink clay door in image.png
    glow: '#f472b6',
  },
  {
    name: 'Cornflower Blue',
    cap: '#60a5fa',
    capAccent: '#3b82f6',
    door: '#93c5fd',
    glow: '#60a5fa',
  },
  {
    name: 'Mint Meadow',
    cap: '#4ade80',
    capAccent: '#22c55e',
    door: '#86efac',
    glow: '#4ade80',
  },
  {
    name: 'Sunset Peach',
    cap: '#fb923c',
    capAccent: '#ea580c',
    door: '#fdba74',
    glow: '#fb923c',
  },
  {
    name: 'Lilac Mist',
    cap: '#c084fc',
    capAccent: '#a855f7',
    door: '#d8b4fe',
    glow: '#c084fc',
  },
  {
    name: 'Buttercup Gold',
    cap: '#facc15',
    capAccent: '#ca8a04',
    door: '#fde047',
    glow: '#facc15',
  },
  {
    name: 'Seafoam Teal',
    cap: '#2dd4bf',
    capAccent: '#0d9488',
    door: '#5eead4',
    glow: '#2dd4bf',
  },
  {
    name: 'Ruby Rose',
    cap: '#fb7185',
    capAccent: '#e11d48',
    door: '#fda4af',
    glow: '#fb7185',
  },
];

// Precomputed surface dot data (azimuth, elevation, size) matching image.png
const DOT_CONFIGS = [
  { azim: 0, elev: 16, s: 0.44 },       // Front center right above the door
  { azim: -38, elev: 28, s: 0.46 },     // Front left
  { azim: 38, elev: 27, s: 0.45 },      // Front right
  { azim: 22, elev: 52, s: 0.52 },      // High top right (prominent in image.png)
  { azim: -30, elev: 54, s: 0.46 },     // High top left
  { azim: -75, elev: 18, s: 0.42 },     // Left flank
  { azim: 76, elev: 20, s: 0.42 },      // Right flank
  { azim: -130, elev: 32, s: 0.44 },    // Back left
  { azim: 180, elev: 36, s: 0.46 },     // Back center
  { azim: 135, elev: 28, s: 0.42 },     // Back right
  { azim: -6, elev: 76, s: 0.38 },      // Near apex
];

export default function ClassHut({
  classData,
  position,
  rotation = [0, 0, 0],
  onSelect,
}: ClassHutProps) {
  const groupRef = useRef<THREE.Group>(null);
  const chimneySmokeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Pick deterministic palette for each class
  const palette = useMemo(() => {
    const code = classData.code || classData.id || 'A';
    // If it's class G1-A, give it Strawberry Pink (matching image.png!)
    if (code.includes('1-A') || code.includes('G1-A')) {
      return CLAY_MUSHROOM_PALETTES[0];
    }
    if (code.includes('1-B') || code.includes('G1-B')) {
      return CLAY_MUSHROOM_PALETTES[1]; // Cornflower Blue
    }
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = code.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % CLAY_MUSHROOM_PALETTES.length;
    return CLAY_MUSHROOM_PALETTES[idx];
  }, [classData.code, classData.id]);

  // Compute 3D positions and normal rotations for white clay polka dots on the dome
  const calculatedDots = useMemo(() => {
    const R = 2.34;
    const Y0 = 0.12;
    const yScale = 0.92;
    const up = new THREE.Vector3(0, 1, 0);

    return DOT_CONFIGS.map((cfg) => {
      const az = (cfg.azim * Math.PI) / 180;
      const el = (cfg.elev * Math.PI) / 180;
      const x = R * Math.cos(el) * Math.sin(az);
      const y = Y0 + R * Math.sin(el) * yScale;
      const z = R * Math.cos(el) * Math.cos(az);

      const normal = new THREE.Vector3(x, (y - Y0) / yScale, z).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);
      const euler = new THREE.Euler().setFromQuaternion(quat);

      return {
        pos: [x, y, z] as [number, number, number],
        rot: [euler.x, euler.y, euler.z] as [number, number, number],
        size: cfg.s,
      };
    });
  }, []);

  // Subtle breathing/floating and smoke puff animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    if (hovered) {
      groupRef.current.position.y = position[1] + Math.sin(t * 3.5) * 0.12 + 0.15;
    } else {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.6 + position[0]) * 0.035;
    }

    if (chimneySmokeRef.current) {
      chimneySmokeRef.current.position.y = 1.35 + Math.sin(t * 2) * 0.08;
      chimneySmokeRef.current.scale.setScalar(0.9 + Math.sin(t * 2.5) * 0.15);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    forestAudio.playClick();
    onSelect(classData);
  };

  const isFinalized = classData.todaySessionStatus === 'FINALIZED';
  const isDraft = classData.todaySessionStatus === 'DRAFT';

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* 1. Base Green Clay Grass Mound */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[2.55, 2.75, 0.24, 32]} />
        <meshStandardMaterial color="#4d7c38" roughness={0.88} />
      </mesh>

      {/* Grass Tuft Ruffles around the hut base */}
      {Array.from({ length: 16 }).map((_, i) => {
        const ang = (i / 16) * Math.PI * 2;
        // Avoid placing right in front of the door path
        if (ang > 1.15 && ang < 2.0) return null;
        const r = 1.95 + (i % 3) * 0.12;
        const x = Math.sin(ang) * r;
        const z = Math.cos(ang) * r;
        return (
          <group key={i} position={[x, 0.24, z]} rotation={[0, ang, 0]}>
            <mesh rotation={[0.2, 0, 0]}>
              <coneGeometry args={[0.18, 0.38, 5]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#3f682d' : '#558b3e'} roughness={0.9} />
            </mesh>
            <mesh position={[0.08, 0, 0.04]} rotation={[0.25, 0.3, 0]}>
              <coneGeometry args={[0.13, 0.3, 5]} />
              <meshStandardMaterial color="#4a7c36" roughness={0.9} />
            </mesh>
          </group>
        );
      })}

      {/* 2. Stepping Stone Pathway in front of the door (3 rows of paired clay stones) */}
      <group position={[0, 0.02, 0]}>
        {/* Row 1 */}
        <mesh position={[-0.22, 0.18, 1.95]} rotation={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[0.34, 0.09, 0.3]} />
          <meshStandardMaterial color="#f6ede0" roughness={0.85} />
        </mesh>
        <mesh position={[0.22, 0.18, 1.95]} rotation={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[0.34, 0.09, 0.3]} />
          <meshStandardMaterial color="#f6ede0" roughness={0.85} />
        </mesh>

        {/* Row 2 */}
        <mesh position={[-0.23, 0.16, 2.35]} rotation={[0, -0.04, 0]} receiveShadow>
          <boxGeometry args={[0.36, 0.09, 0.32]} />
          <meshStandardMaterial color="#f6ede0" roughness={0.85} />
        </mesh>
        <mesh position={[0.23, 0.16, 2.35]} rotation={[0, 0.04, 0]} receiveShadow>
          <boxGeometry args={[0.36, 0.09, 0.32]} />
          <meshStandardMaterial color="#f6ede0" roughness={0.85} />
        </mesh>

        {/* Row 3 */}
        <mesh position={[-0.24, 0.14, 2.75]} rotation={[0, 0.03, 0]} receiveShadow>
          <boxGeometry args={[0.38, 0.08, 0.32]} />
          <meshStandardMaterial color="#f4e8d8" roughness={0.85} />
        </mesh>
        <mesh position={[0.24, 0.14, 2.75]} rotation={[0, -0.03, 0]} receiveShadow>
          <boxGeometry args={[0.38, 0.08, 0.32]} />
          <meshStandardMaterial color="#f4e8d8" roughness={0.85} />
        </mesh>
      </group>

      {/* 3. Little Companion Clay Flowers & Beads (like in image.png) */}
      {/* Right side baby pink flower */}
      <group position={[1.85, 0.24, 0.9]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.22, 10]} />
          <meshStandardMaterial color="#faf3e8" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color={palette.cap} roughness={0.75} />
        </mesh>
        {/* Flower petals */}
        {Array.from({ length: 4 }).map((_, pi) => (
          <mesh
            key={pi}
            position={[
              Math.cos((pi / 4) * Math.PI * 2) * 0.16,
              0.24,
              Math.sin((pi / 4) * Math.PI * 2) * 0.16,
            ]}
          >
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshStandardMaterial color={palette.door} roughness={0.75} />
          </mesh>
        ))}
      </group>

      {/* Left side tiny pastel beads on grass */}
      <mesh position={[-1.75, 0.26, 1.7]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color={palette.door} roughness={0.8} />
      </mesh>
      <mesh position={[-1.5, 0.24, 1.9]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color={palette.cap} roughness={0.8} />
      </mesh>

      {/* 4. Mushroom Stem Body (Warm Ivory Clay Wall) */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.82, 2.05, 32]} />
        <meshStandardMaterial color="#faf3e8" roughness={0.82} />
      </mesh>

      {/* 5. Arched Front Door & Doorknob */}
      <group position={[0, 0.95, 1.72]}>
        {/* Recessed Door Frame Trim */}
        <mesh position={[0, 0, -0.04]}>
          <boxGeometry args={[0.96, 1.34, 0.08]} />
          <meshStandardMaterial color="#ebdcc8" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.67, -0.04]}>
          <cylinderGeometry args={[0.48, 0.48, 0.08, 20, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#ebdcc8" roughness={0.85} />
        </mesh>

        {/* Main Pastel Clay Door Slab */}
        <mesh position={[0, 0, 0.02]} castShadow>
          <boxGeometry args={[0.82, 1.25, 0.1]} />
          <meshStandardMaterial
            color={palette.door}
            roughness={0.72}
            emissive={hovered ? palette.glow : '#000000'}
            emissiveIntensity={hovered ? 0.2 : 0}
          />
        </mesh>
        <mesh position={[0, 0.62, 0.02]} castShadow>
          <cylinderGeometry args={[0.41, 0.41, 0.1, 20, 1, false, 0, Math.PI]} />
          <meshStandardMaterial
            color={palette.door}
            roughness={0.72}
            emissive={hovered ? palette.glow : '#000000'}
            emissiveIntensity={hovered ? 0.2 : 0}
          />
        </mesh>

        {/* Small Dark Clay Doorknob */}
        <mesh position={[-0.26, -0.08, 0.09]} castShadow>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#262626" roughness={0.7} />
        </mesh>
      </group>

      {/* 6. Mushroom Cap (Roof) */}
      <group position={[0, 2.25, 0]}>
        {/* Main Puffy Bulbous Mushroom Dome */}
        <mesh position={[0, 0.12, 0]} scale={[1, 0.92, 1]} castShadow receiveShadow>
          <sphereGeometry args={[2.32, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshStandardMaterial
            color={palette.cap}
            roughness={0.68}
            emissive={hovered ? palette.capAccent : '#000000'}
            emissiveIntensity={hovered ? 0.22 : 0}
          />
        </mesh>

        {/* Rounded Soft Overhang Lip at bottom of Mushroom Cap */}
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[2.14, 0.26, 16, 32]} />
          <meshStandardMaterial
            color={palette.cap}
            roughness={0.68}
            emissive={hovered ? palette.capAccent : '#000000'}
            emissiveIntensity={hovered ? 0.22 : 0}
          />
        </mesh>

        {/* Soft Cream Clay Underside of Mushroom Cap */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.12, 32]} />
          <meshStandardMaterial color="#f5ede0" roughness={0.9} />
        </mesh>

        {/* Distinct White Clay Polka Dots Distributed across Dome */}
        {calculatedDots.map((dot, idx) => (
          <mesh
            key={idx}
            position={dot.pos}
            rotation={dot.rot}
            scale={[dot.size, 0.08, dot.size]}
            castShadow
          >
            {/* Smooth rounded clay disc / flattened sphere */}
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.55} />
          </mesh>
        ))}

        {/* 7. Whimsical Stacked Clay Chimney emerging from upper cap (visible on top-right) */}
        <group position={[0.9, 1.45, 0.2]} rotation={[0.08, 0, -0.16]}>
          {/* Inner core tube */}
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.28, 1.35, 20]} />
            <meshStandardMaterial color="#faf3e8" roughness={0.82} />
          </mesh>

          {/* Stacked clay bulge rings */}
          {[0.18, 0.44, 0.7, 0.96].map((y, ringIdx) => (
            <mesh key={ringIdx} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.26, 0.08, 12, 24]} />
              <meshStandardMaterial color="#faf3e8" roughness={0.82} />
            </mesh>
          ))}

          {/* Top flared lip collar */}
          <mesh position={[0, 1.32, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.29, 0.09, 12, 24]} />
            <meshStandardMaterial color="#faf3e8" roughness={0.8} />
          </mesh>

          {/* Chimney opening hole */}
          <mesh position={[0, 1.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.24, 16]} />
            <meshStandardMaterial color="#27272a" roughness={0.95} />
          </mesh>

          {/* Animated Puffy Clay Smoke */}
          <group ref={chimneySmokeRef} position={[0, 1.45, 0]}>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.14, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} transparent opacity={hovered ? 0.85 : 0.4} />
            </mesh>
            <mesh position={[0.08, 0.34, 0.04]}>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} transparent opacity={hovered ? 0.75 : 0.3} />
            </mesh>
            <mesh position={[-0.05, 0.58, -0.04]}>
              <sphereGeometry args={[0.26, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} transparent opacity={hovered ? 0.6 : 0.2} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Warm Fairy Light Glow on Hover */}
      {hovered && (
        <>
          <pointLight position={[0, 1.6, 2.2]} intensity={2.2} distance={6.5} color={palette.glow} />
          <pointLight position={[0, 3.8, 0]} intensity={1.5} distance={5} color="#fff" />
        </>
      )}

      {/* 8. 3D Carved Wooden Signboard / HTML Nameplate */}
      <Html
        position={[0, 5.0, 0]}
        center
        distanceFactor={18}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div
          className={`flex flex-col items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-center shadow-lg backdrop-blur-md transition-all ${
            hovered
              ? 'scale-110 border-pink-400 bg-white shadow-pink-500/20 ring-2 ring-pink-300/40'
              : 'border-slate-200 bg-white/95'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-xs"
              style={{ backgroundColor: palette.cap }}
            />
            <span className="font-display font-bold text-sm text-slate-900 whitespace-nowrap">
              {classData.name}
            </span>
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold border"
              style={{
                backgroundColor: `${palette.door}40`,
                borderColor: `${palette.cap}70`,
                color: palette.capAccent,
              }}
            >
              {classData.code}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-600">
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <Users className="h-3 w-3 text-blue-600" />
              {classData.studentCount || 0} Students
            </span>

            {/* Session Status Pill */}
            {isFinalized ? (
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="h-3 w-3" /> Done
              </span>
            ) : isDraft ? (
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Sparkles className="h-3 w-3 animate-pulse" /> In Progress
              </span>
            ) : (
              <span className="text-slate-400 font-medium">Ready</span>
            )}
          </div>

          {hovered && (
            <div
              className="mt-1 rounded-full px-3 py-0.5 text-[10px] font-bold text-white shadow-xs transition-all"
              style={{
                background: `linear-gradient(135deg, ${palette.cap}, ${palette.capAccent})`,
              }}
            >
              Enter Expedition →
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
