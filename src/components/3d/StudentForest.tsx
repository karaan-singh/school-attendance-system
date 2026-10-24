'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StudentRecord } from '@/types';
import StudentTree from './StudentTree';
import { StylizedClayOakTree, AlpineConiferTree } from './StylizedClayTree';
import {
  StratifiedMountainRange,
  MossyCragBoulder,
  CascadingWaterfall,
} from './MountainWaterfallScene';
import { BotanicalMeadowField, PinkWaterLily } from './StylizedBotanicals';
import { ForestMushrooms, FlyingBirds } from './NatureElements';
import ExplorerModel from './ExplorerModel';
import ForestParticles from './ForestParticles';
import SkyAtmosphere from './SkyAtmosphere';

// Dynamic animated river brook with multi-shaded realistic blue and white water layers (NO black lining)
function ConnectingRiverBrook() {
  const waterRef = useRef<THREE.Mesh>(null);
  const foamRibbonRef = useRef<THREE.Group>(null);
  const deepCurrentRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Dynamic physical cascading vertex waves on main water surface
    if (waterRef.current) {
      const pos = waterRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const x = pos.getX(i);
        const zWave =
          Math.sin(y * 1.1 - t * 4.8) * 0.05 +
          Math.cos(x * 2.2 + t * 3.4) * 0.03;
        pos.setZ(i, zWave);
      }
      pos.needsUpdate = true;
    }

    // Moving downstream foam ribbons & eddies
    if (foamRibbonRef.current) {
      foamRibbonRef.current.children.forEach((child, idx) => {
        const speed = 1.6 + (idx % 3) * 0.45;
        const offset = idx * 6.2;
        const travel = ((t * speed + offset) % 36);
        child.position.y = 18 - travel; // moves along Y which is Z in rotated plane
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Shallow Shoreline Water Margin (Feathers softly into meadow grass with pale sky-blue wash) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -16.25]} receiveShadow>
        <planeGeometry args={[5.8, 36]} />
        <meshStandardMaterial
          color="#bae6fd"
          emissive="#7dd3fc"
          emissiveIntensity={0.25}
          roughness={0.12}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* 2. Deep Subsurface Sapphire Channel Bed (Natural water depth, zero black lines) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -16.25]} receiveShadow>
        <planeGeometry args={[4.4, 36]} />
        <meshStandardMaterial
          color="#0369a1"
          emissive="#0284c7"
          emissiveIntensity={0.35}
          roughness={0.18}
          metalness={0.2}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* 3. Main Active Azure & Turquoise River Flow with Dynamic Vertex Waves */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.024, -16.25]}>
        <planeGeometry args={[3.8, 36, 16, 40]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#22d3ee"
          emissiveIntensity={0.45}
          roughness={0.06}
          metalness={0.32}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* 4. Central Fast-Moving Crystal Blue Core Current */}
      <mesh
        ref={deepCurrentRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.028, -16.25]}
      >
        <planeGeometry args={[2.4, 36]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={0.52}
          roughness={0.05}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 5. Dynamic Surging White-Water Foam Rapids & Froth Ribbons (Pure White, Shimmering Glow) */}
      <group ref={foamRibbonRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.032, -16.25]}>
        {[
          { x: -0.6, w: 1.1, h: 3.8, op: 0.88 },
          { x: 0.5, w: 1.0, h: 3.4, op: 0.85 },
          { x: -0.2, w: 1.25, h: 4.2, op: 0.92 },
          { x: 0.7, w: 0.9, h: 3.2, op: 0.82 },
          { x: -0.5, w: 1.15, h: 3.6, op: 0.86 },
          { x: 0.2, w: 1.3, h: 4.0, op: 0.9 },
        ].map((foam, fi) => (
          <mesh key={`river-foam-${fi}`} position={[foam.x, 0, 0]}>
            <planeGeometry args={[foam.w, foam.h]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.95}
              roughness={0.1}
              transparent
              opacity={foam.op}
            />
          </mesh>
        ))}
      </group>

      {/* 6. Smooth Riverbank Pebbles (Pebble grey & moss, gently embedding the river into grass) */}
      {[
        [-2.0, 0.04, -4.5, 0.22, '#94a3b8'],
        [2.1, 0.04, -7.0, 0.26, '#cbd5e1'],
        [-2.1, 0.04, -11.5, 0.28, '#94a3b8'],
        [2.2, 0.04, -14.0, 0.24, '#a1a1aa'],
        [-2.2, 0.04, -19.5, 0.3, '#cbd5e1'],
        [2.3, 0.04, -22.0, 0.25, '#94a3b8'],
        [-2.1, 0.04, -27.5, 0.28, '#cbd5e1'],
        [2.2, 0.04, -30.0, 0.26, '#94a3b8'],
      ].map((peb, pi) => (
        <mesh
          key={`river-peb-${pi}`}
          position={[peb[0] as number, peb[1] as number, peb[2] as number]}
          scale={[1, 0.55, 1]}
          castShadow
        >
          <dodecahedronGeometry args={[peb[3] as number, 0]} />
          <meshStandardMaterial color={peb[4] as string} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

interface StudentForestProps {
  students: StudentRecord[];
  selectedStudentId: string | null;
  onSelectStudent: (student: StudentRecord) => void;
  onQuickToggleStudent?: (studentId: string) => void;
  skyMode?: 'day' | 'sunset' | 'night' | 'cinematic';
  cinematicProgress?: number;
}

export default function StudentForest({
  students,
  selectedStudentId,
  onSelectStudent,
  onQuickToggleStudent,
  skyMode = 'day',
  cinematicProgress = 0,
}: StudentForestProps) {
  // Compute semi-circular or tiered layout for student trees
  const studentTreePositions = useMemo(() => {
    const total = Math.max(students.length, 1);
    const positions: Array<[number, number, number]> = [];

    if (total <= 12) {
      for (let i = 0; i < total; i++) {
        const angle = (i / total) * Math.PI * 1.5 - Math.PI * 0.75;
        const radius = 9.5;
        let x = Math.sin(angle) * radius;
        // Keep a clear center corridor for the waterfall & river vista
        if (Math.abs(x) < 2.2) {
          x = x >= 0 ? 2.6 : -2.6;
        }
        const z = -Math.cos(angle) * radius * 0.75 - 1;
        positions.push([x, 0, z]);
      }
    } else {
      const innerCount = Math.min(10, Math.floor(total * 0.45));
      const outerCount = total - innerCount;

      for (let i = 0; i < innerCount; i++) {
        const angle = (i / (innerCount - 1 || 1)) * Math.PI * 1.3 - Math.PI * 0.65;
        let x = Math.sin(angle) * 7.5;
        if (Math.abs(x) < 2.2) {
          x = x >= 0 ? 2.5 : -2.5;
        }
        const z = -Math.cos(angle) * 5.2;
        positions.push([x, 0, z]);
      }

      for (let i = 0; i < outerCount; i++) {
        const angle = (i / (outerCount - 1 || 1)) * Math.PI * 1.5 - Math.PI * 0.75;
        const x = Math.sin(angle) * 13.0;
        const z = -Math.cos(angle) * 9.0;
        positions.push([x, 0, z]);
      }
    }

    return positions;
  }, [students.length]);

  return (
    <group>
      {/* Sky Atmosphere & Mountain Horizons */}
      <SkyAtmosphere mode={skyMode} cinematicProgress={cinematicProgress} />

      {/* Multi-Layered Expansive Alpine Grassland Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[240, 240, 32, 32]} />
        <meshStandardMaterial color="#14532d" roughness={0.92} />
      </mesh>
      {/* Sunlit Inner Pasture Carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, -12]} receiveShadow>
        <planeGeometry args={[130, 140, 24, 24]} />
        <meshStandardMaterial color="#16a34a" roughness={0.88} />
      </mesh>

      {/* Undulating Rolling Grassland Mounds & Swales */}
      <group>
        {[
          { pos: [-18, 0.35, -14], scale: [14, 1.2, 14], color: '#15803d' },
          { pos: [19, 0.4, -13], scale: [15, 1.3, 15], color: '#15803d' },
          { pos: [-24, 0.7, -2], scale: [16, 1.8, 16], color: '#166534' },
          { pos: [25, 0.65, -1], scale: [16, 1.7, 16], color: '#166534' },
          { pos: [-16, 0.4, 9], scale: [13, 1.1, 13], color: '#22c55e' },
          { pos: [17, 0.45, 8], scale: [13, 1.2, 13], color: '#22c55e' },
          { pos: [-22, 1.0, -28], scale: [18, 2.2, 18], color: '#14532d' },
          { pos: [23, 0.95, -27], scale: [18, 2.1, 18], color: '#14532d' },
          { pos: [-9, 0.25, -25], scale: [10, 0.8, 10], color: '#15803d' },
          { pos: [10, 0.25, -24], scale: [10, 0.8, 10], color: '#15803d' },
        ].map((m, i) => (
          <mesh
            key={`grass-mound-${i}`}
            position={m.pos as any}
            scale={m.scale as any}
            receiveShadow
          >
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color={m.color} roughness={0.92} />
          </mesh>
        ))}
      </group>

      {/* Distant Horizon Alpine Mountain Range with Pointed Needle Horns */}
      <StratifiedMountainRange position={[0, -2, -95]} scale={1.85} />

      {/* Massive Mountain Waterfall with Pointy Horns, Carved Gorge & Footbridge */}
      <CascadingWaterfall position={[0, -0.8, -46]} scale={1.85} />

      {/* Dynamic Animated Stream / Brook connecting Waterfall Plunge Pool to Whispering Spring */}
      <ConnectingRiverBrook />

      {/* Mossy Crag Boulders with Shelves lining riverbanks and forest clearing */}
      <MossyCragBoulder position={[-5.6, 0, -32]} scale={1.6} rotation={[0, 0.4, 0]} />
      <MossyCragBoulder position={[5.8, 0, -31]} scale={1.55} rotation={[0, -0.6, 0]} />
      <MossyCragBoulder position={[-4.8, 0, -21]} scale={1.4} rotation={[0, 0.8, 0]} />
      <MossyCragBoulder position={[5.2, 0, -19]} scale={1.35} rotation={[0, -0.7, 0]} />
      <MossyCragBoulder position={[-8.5, 0, -12]} scale={1.4} rotation={[0, 1.2, 0]} />
      <MossyCragBoulder position={[9.0, 0, -11]} scale={1.35} rotation={[0, -1.1, 0]} />
      <MossyCragBoulder position={[-7.5, 0, -2]} scale={1.3} rotation={[0, 0.8, 0]} />
      <MossyCragBoulder position={[7.8, 0, -1]} scale={1.2} rotation={[0, -0.9, 0]} />
      <MossyCragBoulder position={[-2.8, 0, 3.8]} scale={1.15} rotation={[0, -0.25, 0]} />
      <MossyCragBoulder position={[3.1, 0, 3.6]} scale={1.1} rotation={[0, 0.35, 0]} />

      {/* Center Whispering Spring (Expanded Serene Forest Pool with Glowing Ripples & Lotuses) */}
      <group position={[0, 0.02, 1.5]}>
        {/* River Rock Border */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <ringGeometry args={[4.4, 5.4, 36]} />
          <meshStandardMaterial color="#64748b" roughness={0.88} />
        </mesh>

        {/* Shallow Shore Wash (Light sky blue, seamlessly transitions into grass and rocks, NO black line) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.022, 0]}>
          <circleGeometry args={[4.8, 40]} />
          <meshStandardMaterial
            color="#bae6fd"
            emissive="#7dd3fc"
            emissiveIntensity={0.25}
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* Shimmering Spring Azure Water */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <circleGeometry args={[4.4, 40]} />
          <meshStandardMaterial
            color="#0891b2"
            emissive="#06b6d4"
            emissiveIntensity={0.42}
            roughness={0.05}
            metalness={0.3}
            transparent
            opacity={0.92}
          />
        </mesh>
        <pointLight position={[0, 1.2, 0]} intensity={2.2} distance={12} color="#7dd3fc" />

        {/* Floating Pink Lotus Lilies in Whispering Spring */}
        <PinkWaterLily position={[1.8, 0.035, 0.6]} scale={1.25} />
        <PinkWaterLily position={[-1.9, 0.035, 1.4]} scale={1.2} />
        <PinkWaterLily position={[0.2, 0.035, 2.6]} scale={1.25} />
      </group>

      {/* Stylized Botanical Meadow: Grass clumps with pebble rings, Pink Water Lilies, Cattails, Hostas, Buttercups, Fiddleheads (Images 1, 2, 3) */}
      <BotanicalMeadowField type="forest" />

      {/* Guide Character (Matching Minecraft/Voxel Style from User Reference) */}
      <group position={[2.9, 0, 4.2]} rotation={[0, -0.6, 0]}>
        <ExplorerModel isWalking={false} scale={1.25} guide="WOODCUTTER" />
      </group>

      {/* Flying Birds circling the mountain and upper canopy */}
      <FlyingBirds count={7} height={44} radius={50} />

      {/* Bioluminescent Forest Floor Glow Mushrooms in the deep woods */}
      <ForestMushrooms count={24} radius={32} />

      {/* DENSE ANCIENT FOREST CANOPY (54+ TREES FLANKING THE GROVE & MOUNTAIN) */}
      <group>
        {/* --- WEST ANCIENT WOODS (OAKS & ALPINE FIRS) --- */}
        {/* Billowing Stylized Clay Oaks */}
        {[
          { pos: [-16, 0, -2], scale: 1.5, tint: '#388e3c' },
          { pos: [-22, 0, 4], scale: 1.6, tint: '#2e7d32' },
          { pos: [-18, 0, 11], scale: 1.45, tint: '#448b2c' },
          { pos: [-25, 0, -8], scale: 1.7, tint: '#388e3c' },
          { pos: [-20, 0, -18], scale: 1.65, tint: '#2e7d32' },
          { pos: [-28, 0, -15], scale: 1.8, tint: '#448b2c' },
          { pos: [-24, 0, -26], scale: 1.75, tint: '#388e3c' },
          { pos: [-32, 0, -4], scale: 1.9, tint: '#2e7d32' },
          { pos: [-35, 0, -22], scale: 2.0, tint: '#388e3c' },
          { pos: [-30, 0, 12], scale: 1.6, tint: '#448b2c' },
          { pos: [-38, 0, 2], scale: 1.85, tint: '#2e7d32' },
        ].map((tree, idx) => (
          <StylizedClayOakTree
            key={`west-oak-${idx}`}
            position={tree.pos as any}
            scale={tree.scale}
            rotation={[0, idx * 1.3, 0]}
            leafTint={tree.tint}
          />
        ))}

        {/* Slender Tall Alpine Conifer Pines & Firs */}
        {[
          { pos: [-14, 0, -10], scale: 1.4 },
          { pos: [-15, 0, -22], scale: 1.55 },
          { pos: [-18, 0, -32], scale: 1.65 },
          { pos: [-22, 0, -38], scale: 1.85 },
          { pos: [-27, 0, -32], scale: 1.7 },
          { pos: [-34, 0, -35], scale: 1.95 },
          { pos: [-38, 0, -14], scale: 1.75 },
          { pos: [-42, 0, -28], scale: 2.05 },
          { pos: [-15, 0, 18], scale: 1.35 },
        ].map((pine, idx) => (
          <AlpineConiferTree
            key={`west-pine-${idx}`}
            position={pine.pos as any}
            scale={pine.scale}
            rotation={[0, idx * 0.9, 0]}
          />
        ))}

        {/* --- EAST ANCIENT WOODS (OAKS & ALPINE FIRS) --- */}
        {/* Billowing Stylized Clay Oaks */}
        {[
          { pos: [16, 0, -2], scale: 1.5, tint: '#2e7d32' },
          { pos: [22, 0, 4], scale: 1.6, tint: '#388e3c' },
          { pos: [18, 0, 11], scale: 1.45, tint: '#448b2c' },
          { pos: [25, 0, -8], scale: 1.7, tint: '#2e7d32' },
          { pos: [20, 0, -18], scale: 1.65, tint: '#388e3c' },
          { pos: [28, 0, -15], scale: 1.8, tint: '#448b2c' },
          { pos: [24, 0, -26], scale: 1.75, tint: '#2e7d32' },
          { pos: [32, 0, -4], scale: 1.9, tint: '#388e3c' },
          { pos: [35, 0, -22], scale: 2.0, tint: '#448b2c' },
          { pos: [30, 0, 12], scale: 1.6, tint: '#2e7d32' },
          { pos: [38, 0, 2], scale: 1.85, tint: '#388e3c' },
        ].map((tree, idx) => (
          <StylizedClayOakTree
            key={`east-oak-${idx}`}
            position={tree.pos as any}
            scale={tree.scale}
            rotation={[0, idx * 1.5, 0]}
            leafTint={tree.tint}
          />
        ))}

        {/* Slender Tall Alpine Conifer Pines & Firs */}
        {[
          { pos: [14, 0, -10], scale: 1.4 },
          { pos: [15, 0, -22], scale: 1.55 },
          { pos: [18, 0, -32], scale: 1.65 },
          { pos: [22, 0, -38], scale: 1.85 },
          { pos: [27, 0, -32], scale: 1.7 },
          { pos: [34, 0, -35], scale: 1.95 },
          { pos: [38, 0, -14], scale: 1.75 },
          { pos: [42, 0, -28], scale: 2.05 },
          { pos: [15, 0, 18], scale: 1.35 },
        ].map((pine, idx) => (
          <AlpineConiferTree
            key={`east-pine-${idx}`}
            position={pine.pos as any}
            scale={pine.scale}
            rotation={[0, idx * 1.1, 0]}
          />
        ))}

        {/* --- MOUNTAIN VALLEY FLANKING PINES (FRAMING WATERFALL MASSIF) --- */}
        {[
          { pos: [-13, 0, -42], scale: 1.85 },
          { pos: [13, 0, -42], scale: 1.85 },
          { pos: [-19, 0, -48], scale: 2.15 },
          { pos: [19, 0, -48], scale: 2.15 },
          { pos: [-26, 0, -52], scale: 2.35 },
          { pos: [26, 0, -52], scale: 2.35 },
          { pos: [-33, 0, -48], scale: 2.05 },
          { pos: [33, 0, -48], scale: 2.05 },
          { pos: [-8, 0, 19], scale: 1.3 },
          { pos: [8, 0, 19], scale: 1.3 },
          { pos: [-2, 0, 23], scale: 1.25 },
          { pos: [2, 0, 23], scale: 1.25 },
          { pos: [-45, 0, -10], scale: 2.1 },
          { pos: [45, 0, -10], scale: 2.1 },
        ].map((pine, idx) => (
          <AlpineConiferTree
            key={`valley-pine-${idx}`}
            position={pine.pos as any}
            scale={pine.scale}
            rotation={[0, idx * 0.8, 0]}
          />
        ))}
      </group>

      {/* Render Realistic Student Trees */}
      {students.map((student, idx) => {
        const pos = studentTreePositions[idx] || [0, 0, 0];
        return (
          <StudentTree
            key={student.id}
            student={student}
            position={pos}
            isSelected={student.id === selectedStudentId}
            onSelect={onSelectStudent}
            onQuickToggle={onQuickToggleStudent}
          />
        );
      })}

      {/* Ambient Fireflies & Pollen Motes */}
      <ForestParticles count={180} areaRadius={35} />
    </group>
  );
}
