'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { StudentRecord } from '@/types';
import { Check, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { forestAudio } from '@/lib/audio';

interface StudentTreeProps {
  student: StudentRecord;
  position: [number, number, number];
  isSelected?: boolean;
  onSelect: (student: StudentRecord) => void;
  onQuickToggle?: (studentId: string) => void;
}

// =========================================================================
// REALISTIC STYLIZED OAK TREE (MATCHING TREE REFERENCE IMAGE 2)
// Features: Natural gnarled trunk with spreading buttress roots,
// multiple organic billowing foliage clouds/clusters with sunlit highlights,
// and state-driven living canopy blooms.
// =========================================================================

export default function StudentTree({
  student,
  position,
  isSelected = false,
  onSelect,
}: StudentTreeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const canopyRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const status = student.status;
  const isPresent = status === 'PRESENT';
  const isLate = status === 'LATE';
  const isAbsent = status === 'ABSENT';
  const isExcused = status === 'EXCUSED';

  // Hand-painted foliage color palette (Matching Tree Reference Image 2)
  const colors = useMemo(() => {
    if (isPresent) {
      return {
        shadow: '#14532d',     // Deep lush underside shadow
        base: '#16a34a',       // Rich emerald body
        mid: '#22c55e',        // Vibrant green
        highlight: '#84cc16',  // Sunlit lime edge
        crest: '#bef264',      // Crisp golden-lime leaf crest
        bark: '#6d4c41',       // Warm sculpted bark
        barkDark: '#4e342e',
        emissive: '#16a34a',
        bloomGlow: '#86efac',
      };
    }
    if (isLate) {
      return {
        shadow: '#78350f',
        base: '#b45309',
        mid: '#d97706',
        highlight: '#f59e0b',
        crest: '#fde047',
        bark: '#5d4037',
        barkDark: '#3e2723',
        emissive: '#d97706',
        bloomGlow: '#fde047',
      };
    }
    if (isExcused) {
      return {
        shadow: '#075985',
        base: '#0284c7',
        mid: '#0ea5e9',
        highlight: '#38bdf8',
        crest: '#bae6fd',
        bark: '#475569',
        barkDark: '#334155',
        emissive: '#0284c7',
        bloomGlow: '#7dd3fc',
      };
    }
    if (isAbsent) {
      return {
        shadow: '#0f172a',
        base: '#1e293b',
        mid: '#334155',
        highlight: '#475569',
        crest: '#64748b',
        bark: '#292524',
        barkDark: '#1c1917',
        emissive: '#000000',
        bloomGlow: '#334155',
      };
    }
    // Default ready state
    return {
      shadow: '#166534',
      base: '#15803d',
      mid: '#16a34a',
      highlight: '#65a30d',
      crest: '#84cc16',
      bark: '#6d4c41',
      barkDark: '#4e342e',
      emissive: '#000000',
      bloomGlow: '#86efac',
    };
  }, [isPresent, isLate, isExcused, isAbsent]);

  // Organic Billowing Foliage Clouds Configuration (Matching Reference Image 2)
  const foliageLobes = useMemo(() => [
    // [pos, scale, rotation]
    { pos: [0, 3.8, 0], scale: [1.35, 1.15, 1.3], rot: [0, 0, 0] },                 // Main Central Crown
    { pos: [-0.95, 2.9, 0.45], scale: [1.05, 0.9, 1.0], rot: [0.1, 0.4, 0.2] },      // Left Lower Lobe
    { pos: [1.05, 3.0, -0.3], scale: [1.1, 0.92, 1.05], rot: [-0.1, -0.5, -0.2] },   // Right Lower Lobe
    { pos: [0.25, 2.75, 0.95], scale: [0.95, 0.82, 0.95], rot: [0.3, 0.1, 0] },      // Front Forward Lobe
    { pos: [-0.3, 3.5, -0.95], scale: [1.02, 0.88, 1.0], rot: [-0.3, -0.2, 0] },     // Back Rear Lobe
    { pos: [0.35, 4.4, 0.15], scale: [0.85, 0.72, 0.85], rot: [0.1, 0.6, 0.1] },     // Top Sunlit Crown Lobe
  ], []);

  // Sunlit Leaf Tufts / Crests on the upper ridge of each lobe
  const sunlitTufts = useMemo(() => [
    { pos: [0, 4.65, 0], scale: 0.65, rot: [0, 0.2, 0] },
    { pos: [-0.85, 3.45, 0.5], scale: 0.52, rot: [0.2, 0.5, 0.2] },
    { pos: [0.95, 3.55, -0.25], scale: 0.55, rot: [-0.2, -0.4, -0.2] },
    { pos: [0.2, 3.3, 1.25], scale: 0.48, rot: [0.4, 0, 0] },
    { pos: [-0.25, 4.05, -1.15], scale: 0.5, rot: [-0.4, 0, 0] },
    { pos: [0.4, 4.85, 0.2], scale: 0.42, rot: [0.1, 0.8, 0] },
  ], []);

  // Natural wind rustle animation
  useFrame(({ clock }) => {
    if (!canopyRef.current) return;
    const t = clock.getElapsedTime();
    const wind = Math.sin(t * 1.6 + position[0] * 0.4) * 0.035;
    canopyRef.current.rotation.z = wind;
    canopyRef.current.rotation.x = Math.cos(t * 1.3 + position[2] * 0.4) * 0.025;

    if (isPresent) {
      canopyRef.current.scale.setScalar(1 + Math.sin(t * 2.2 + position[0]) * 0.025);
    } else if (hovered) {
      canopyRef.current.scale.setScalar(1.05);
    } else {
      canopyRef.current.scale.setScalar(1);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    forestAudio.playClick();
    onSelect(student);
  };

  return (
    <group
      ref={groupRef}
      position={position}
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
      {/* ===================================================================
          1. GRASS HILLOCK & STONE PEDESTAL (MATCHING REFERENCE IMAGE 2)
          =================================================================== */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[1.75, 2.05, 0.18, 20]} />
        <meshStandardMaterial color="#3f6212" roughness={0.92} />
      </mesh>
      {/* Moss rim overlay */}
      <mesh position={[0, 0.16, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.72, 0.06, 16]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.88} />
      </mesh>

      {/* Small River Stones around root base (Image 2) */}
      <mesh position={[0.9, 0.18, 0.8]} rotation={[0.2, 0.5, 0]} castShadow>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>
      <mesh position={[-1.0, 0.16, 0.7]} rotation={[-0.2, 0.8, 0]} castShadow>
        <dodecahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color="#475569" roughness={0.95} />
      </mesh>
      <mesh position={[-0.2, 0.14, -1.1]} rotation={[0.4, -0.3, 0]} castShadow>
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* ===================================================================
          2. SCULPTED GNARLED TRUNK & BUTTRESS ROOTS (IMAGE 2)
          =================================================================== */}
      <group position={[0, 0, 0]}>
        {/* Central Trunk Base Collar */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.38, 0.75, 0.9, 14]} />
          <meshStandardMaterial color={colors.bark} roughness={0.86} />
        </mesh>

        {/* 4 Buttress Root Claws gripping the earth */}
        <mesh position={[0.55, 0.18, 0.38]} rotation={[0.22, 0.55, -0.42]} castShadow>
          <cylinderGeometry args={[0.14, 0.32, 0.95, 8]} />
          <meshStandardMaterial color={colors.barkDark} roughness={0.88} />
        </mesh>
        <mesh position={[-0.58, 0.18, 0.35]} rotation={[0.22, -0.55, 0.42]} castShadow>
          <cylinderGeometry args={[0.14, 0.32, 0.95, 8]} />
          <meshStandardMaterial color={colors.barkDark} roughness={0.88} />
        </mesh>
        <mesh position={[-0.42, 0.18, -0.55]} rotation={[-0.3, -0.75, 0.38]} castShadow>
          <cylinderGeometry args={[0.13, 0.3, 0.9, 8]} />
          <meshStandardMaterial color={colors.barkDark} roughness={0.88} />
        </mesh>
        <mesh position={[0.48, 0.18, -0.52]} rotation={[-0.3, 0.75, -0.38]} castShadow>
          <cylinderGeometry args={[0.13, 0.3, 0.9, 8]} />
          <meshStandardMaterial color={colors.barkDark} roughness={0.88} />
        </mesh>

        {/* Middle Main Trunk with organic curve */}
        <mesh position={[0, 1.45, 0.02]} rotation={[0.04, 0, -0.03]} castShadow>
          <cylinderGeometry args={[0.32, 0.40, 1.25, 14]} />
          <meshStandardMaterial color={colors.bark} roughness={0.86} />
        </mesh>

        {/* Twisted Branches branching into the canopy */}
        {/* Left Bough */}
        <mesh position={[-0.45, 2.25, 0.15]} rotation={[0.15, 0.2, 0.55]} castShadow>
          <cylinderGeometry args={[0.18, 0.28, 1.15, 8]} />
          <meshStandardMaterial color={colors.bark} roughness={0.88} />
        </mesh>
        {/* Right Bough */}
        <mesh position={[0.48, 2.3, -0.12]} rotation={[-0.15, -0.2, -0.52]} castShadow>
          <cylinderGeometry args={[0.18, 0.28, 1.18, 8]} />
          <meshStandardMaterial color={colors.bark} roughness={0.88} />
        </mesh>
        {/* Forward Bough */}
        <mesh position={[0.1, 2.15, 0.42]} rotation={[0.48, 0, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.24, 0.95, 8]} />
          <meshStandardMaterial color={colors.bark} roughness={0.88} />
        </mesh>
        {/* Central Leader Bough */}
        <mesh position={[0, 2.65, -0.1]} rotation={[-0.1, 0, 0.08]} castShadow>
          <cylinderGeometry args={[0.2, 0.28, 1.1, 8]} />
          <meshStandardMaterial color={colors.bark} roughness={0.88} />
        </mesh>
      </group>

      {/* ===================================================================
          3. REALISTIC BILLOWING FOLIAGE CLOUDS (IMAGE 2)
          Multi-lobe organic leafy masses with depth gradient and sunlit tufts
          =================================================================== */}
      <group ref={canopyRef} position={[0, 0, 0]}>
        {/* Billowing Foliage Lobes */}
        {foliageLobes.map((lobe, i) => (
          <group
            key={`lobe-${i}`}
            position={lobe.pos as any}
            scale={lobe.scale as any}
            rotation={lobe.rot as any}
          >
            {/* Core Dense Foliage Mass */}
            <mesh castShadow receiveShadow>
              <dodecahedronGeometry args={[1.05, 1]} />
              <meshStandardMaterial
                color={i === 0 ? colors.base : i % 2 === 0 ? colors.mid : colors.highlight}
                roughness={0.75}
                emissive={colors.emissive}
                emissiveIntensity={isPresent ? 0.35 : isLate ? 0.25 : 0}
              />
            </mesh>

            {/* Sub-tuft for organic bumpiness */}
            <mesh position={[0.25, 0.2, 0.2]} scale={[0.6, 0.6, 0.6]} castShadow>
              <dodecahedronGeometry args={[0.9, 0]} />
              <meshStandardMaterial
                color={colors.highlight}
                roughness={0.7}
              />
            </mesh>
          </group>
        ))}

        {/* Sunlit Leaf Crests / Tufts (Warm golden-lime highlights on top) */}
        {sunlitTufts.map((tuft, idx) => (
          <mesh
            key={`tuft-${idx}`}
            position={tuft.pos as any}
            scale={[tuft.scale, tuft.scale * 0.75, tuft.scale]}
            rotation={tuft.rot as any}
            castShadow
          >
            <dodecahedronGeometry args={[0.7, 1]} />
            <meshStandardMaterial
              color={colors.crest}
              roughness={0.65}
              emissive={isPresent ? colors.highlight : '#000000'}
              emissiveIntensity={isPresent ? 0.3 : 0}
            />
          </mesh>
        ))}

        {/* Present Golden Canopy Bloom Halo & Sparkling Orbs */}
        {isPresent && (
          <group position={[0, 4.3, 0]}>
            <pointLight intensity={1.8} distance={6} color={colors.bloomGlow} />
            {/* Golden pollen / sparkle spores */}
            {[
              [-0.8, 0.3, 0.6],
              [0.7, 0.5, -0.5],
              [-0.4, 0.8, -0.7],
              [0.5, 0.9, 0.6],
            ].map((sp, idx) => (
              <mesh key={`sparkle-${idx}`} position={sp as any}>
                <sphereGeometry args={[0.07, 6, 6]} />
                <meshStandardMaterial
                  color="#fef08a"
                  emissive="#facc15"
                  emissiveIntensity={1.8}
                />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* ===================================================================
          4. SELECTION RING & HOVER INDICATOR
          =================================================================== */}
      {(isSelected || hovered) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[1.5, 1.85, 32]} />
          <meshBasicMaterial
            color={isSelected ? '#fbbf24' : '#86efac'}
            transparent
            opacity={0.88}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* ===================================================================
          5. 3D FLOATING NAMEPLATE & STATUS BADGE
          =================================================================== */}
      <Html
        position={[0, 5.3, 0]}
        center
        distanceFactor={16}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div
          className={`flex items-center gap-2 rounded-2xl border px-3 py-1.5 shadow-md backdrop-blur-md transition-all ${
            isSelected
              ? 'scale-110 border-amber-400 bg-amber-50/95 ring-2 ring-amber-400/50'
              : hovered
              ? 'scale-105 border-blue-400 bg-white/95'
              : 'border-white/80 bg-white/90'
          }`}
        >
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-xl text-xs font-bold text-white shadow-xs ${
              isPresent
                ? 'bg-emerald-500'
                : isLate
                ? 'bg-amber-500'
                : isExcused
                ? 'bg-sky-500'
                : isAbsent
                ? 'bg-slate-500'
                : 'bg-slate-300'
            }`}
          >
            {isPresent ? (
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            ) : isLate ? (
              <Clock className="h-3.5 w-3.5" />
            ) : isAbsent ? (
              <ShieldAlert className="h-3.5 w-3.5" />
            ) : (
              student.rollNumber
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-display text-xs font-bold text-slate-800 whitespace-nowrap">
              {student.fullName || (student as any).name || 'Student'}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 capitalize">
              Roll #{student.rollNumber} • {status ? status.toLowerCase() : 'ready'}
            </span>
          </div>

          {isPresent && (
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-spin" />
          )}
        </div>
      </Html>
    </group>
  );
}
