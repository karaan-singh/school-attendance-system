import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SchoolClassData } from '@/types';
import ClassHut from './ClassHut';
import ForestParticles from './ForestParticles';
import SkyAtmosphere from './SkyAtmosphere';
import ExplorerModel from './ExplorerModel';
import {
  FlyingBirds,
  WildflowerField,
  SplitRailFences,
  VillageWell,
  DirectionalSignpost,
  ForestMushrooms,
} from './NatureElements';
import { StylizedClayOakTree, StylizedClayPalmTree } from './StylizedClayTree';
import {
  StratifiedMountainRange,
  MossyCragBoulder,
  CascadingWaterfall,
} from './MountainWaterfallScene';
import {
  PinkWaterLily,
  WetlandCattail,
  LushGrassClump,
  YellowGroundBlossom,
} from './StylizedBotanicals';

interface VillageSceneProps {
  classes: SchoolClassData[];
  onSelectClass: (c: SchoolClassData) => void;
  onOpenStoryboard?: () => void;
  skyMode?: 'day' | 'sunset' | 'night' | 'cinematic';
  cinematicProgress?: number;
}

export default function VillageScene({
  classes,
  onSelectClass,
  onOpenStoryboard,
  skyMode = 'day',
  cinematicProgress = 0,
}: VillageSceneProps) {
  const lakeWaterRef = useRef<THREE.Mesh>(null);
  const campfireLightRef = useRef<THREE.PointLight>(null);

  // Animated water shimmer and campfire flicker
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (lakeWaterRef.current) {
      lakeWaterRef.current.position.y = 0.08 + Math.sin(t * 1.5) * 0.025;
    }
    if (campfireLightRef.current) {
      campfireLightRef.current.intensity = 1.8 + Math.sin(t * 12) * 0.35 + Math.cos(t * 7) * 0.2;
    }
  });

  // Hut placements along the expansive village perimeter and glades (Sections A through I)
  const hutPositions: Array<[number, number, number]> = [
    [-11.5, 0, -4.5], // Hut A (West Meadow)
    [-7.5, 0, -11.0], // Hut B (Northwest Woods)
    [-1.5, 0, -13.5], // Hut C (North Trail)
    [5.5, 0, -13.0],  // Hut D (Northeast Clearing)
    [11.5, 0, -6.5],  // Hut E (East Ridge)
    [12.5, 0, 1.5],   // Hut F (Southeast Trail)
    [8.5, 0, 8.5],    // Hut G (South Glade)
    [-7.0, 0, 7.5],   // Hut H (Southwest Shore)
    [-13.5, 0, 2.5],  // Hut I (Far West Grove)
    [0, 0, -17.5],    // Hut J (Summit Path)
  ];

  const hutRotations: Array<[number, number, number]> = [
    [0, 0.82, 0],   // Hut A (West Meadow - angled towards village square)
    [0, 0.45, 0],   // Hut B (Northwest Woods - angled towards village square)
    [0, 0.05, 0],   // Hut C (North Trail)
    [0, -0.38, 0],  // Hut D (Northeast Clearing)
    [0, -0.82, 0],  // Hut E (East Ridge)
    [0, -1.25, 0],  // Hut F (Southeast Trail)
    [0, -2.4, 0],   // Hut G (South Glade)
    [0, 2.2, 0],    // Hut H (Southwest Shore)
    [0, 1.3, 0],    // Hut I (Far West Grove)
    [0, 0, 0],      // Hut J (Summit Path)
  ];

  return (
    <group>
      {/* Sky & Atmospheric Lighting */}
      <SkyAtmosphere mode={skyMode} cinematicProgress={cinematicProgress} />

      {/* Circling Mountain Birds */}
      <FlyingBirds count={7} height={34} radius={38} />

      {/* Massive Terrain Loam Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[190, 190, 64, 64]} />
        <meshStandardMaterial color="#2d4428" roughness={0.92} />
      </mesh>

      {/* Patches of Moss & Rich Dark Soil */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <circleGeometry args={[26, 32]} />
        <meshStandardMaterial color="#385232" roughness={0.9} />
      </mesh>

      {/* Wildflowers scattered organically across the meadow */}
      <WildflowerField count={95} spread={42} />

      {/* Horizon Stratified Mountain Range (Matching Image 1) */}
      <StratifiedMountainRange position={[0, 0, -115]} scale={1.4} />

      {/* Mountain Waterfall Cascading into Lake Sylva (Pointy Alpine Massif) */}
      <CascadingWaterfall position={[-34, -1, -44]} scale={1.45} rotation={[0, 0.45, 0]} />

      {/* Waterfall stream feeding into Lake Sylva */}
      <mesh rotation={[-Math.PI / 2, 0, -0.55]} position={[-25, 0.03, -18]} receiveShadow>
        <planeGeometry args={[3.8, 30]} />
        <meshStandardMaterial
          color="#0891b2"
          roughness={0.16}
          metalness={0.3}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Mossy Crag Boulders with Stepped Shelves (Matching Image 2) */}
      <MossyCragBoulder position={[-25, 0, 7]} scale={1.5} rotation={[0, 0.6, 0]} />
      <MossyCragBoulder position={[-10, 0, 11]} scale={1.2} rotation={[0, -0.4, 0]} />
      <MossyCragBoulder position={[24, 0, -2]} scale={1.3} rotation={[0, 1.8, 0]} />
      <MossyCragBoulder position={[-16, 0, -22]} scale={1.6} rotation={[0, -1.2, 0]} />

      {/* Rolling Forest Foothills (Middle distance) */}
      {[-38, -16, 20, 42].map((x, i) => (
        <mesh key={i} position={[x, 3.8, -48 - (i % 2) * 8]} castShadow receiveShadow>
          <sphereGeometry args={[15 + (i % 3) * 3, 16, 16]} />
          <meshStandardMaterial color="#1b3620" roughness={0.94} />
        </mesh>
      ))}

      {/* Enhanced Lake Sylva (Crystal deep teal with sandy shore, dock, lilies, reeds) */}
      <group position={[-17, 0, 4]}>
        {/* Lake Sand Bed & Pebbles */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
          <ringGeometry args={[8.2, 10.8, 36]} />
          <meshStandardMaterial color="#6b645c" roughness={0.95} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
          <ringGeometry args={[7.6, 8.8, 36]} />
          <meshStandardMaterial color="#8a8175" roughness={0.9} />
        </mesh>

        {/* Water Surface with Realistic Gradient & Soft Specular Shimmer */}
        <mesh ref={lakeWaterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
          <circleGeometry args={[8.0, 40]} />
          <meshStandardMaterial
            color="#0f5c6e"
            roughness={0.16}
            metalness={0.3}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Wooden Fishing Pier / Dock */}
        <group position={[6.5, 0.22, -1.2]} rotation={[0, -0.4, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.4, 0.2, 1.4]} />
            <meshStandardMaterial color="#5c4028" roughness={0.88} />
          </mesh>
          {/* Support Pilings */}
          <mesh position={[-1.7, -0.4, 0.5]} castShadow>
            <cylinderGeometry args={[0.08, 0.09, 1.2, 6]} />
            <meshStandardMaterial color="#3e2716" />
          </mesh>
          <mesh position={[1.7, -0.4, 0.5]} castShadow>
            <cylinderGeometry args={[0.08, 0.09, 1.2, 6]} />
            <meshStandardMaterial color="#3e2716" />
          </mesh>
          {/* Pier Lantern Post */}
          <mesh position={[-1.8, 0.55, 0.5]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 0.9, 6]} />
            <meshStandardMaterial color="#3e2716" />
          </mesh>
          <mesh position={[-1.8, 1.05, 0.5]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.3} />
          </mesh>
        </group>

        {/* Pink Water Lilies & Lotus pads (Matching Image 2) */}
        <PinkWaterLily position={[-2.2, 0.05, 1.6]} scale={1.2} />
        <PinkWaterLily position={[-1.4, 0.05, 2.4]} scale={0.95} />
        <PinkWaterLily position={[-3.8, 0.05, -1.9]} scale={1.1} />
        <PinkWaterLily position={[1.8, 0.05, 3.4]} scale={1.15} />

        {/* Shoreline Cattails with Velvety Russet Heads (Matching Image 2) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = 1.1 + (i / 8) * 2.4;
          const x = Math.cos(angle) * 8.2;
          const z = Math.sin(angle) * 8.2;
          return (
            <WetlandCattail
              key={`cattail-${i}`}
              position={[x, 0, z]}
              scale={1.15 + (i % 3) * 0.15}
              rotation={[0, i * 0.9, 0]}
            />
          );
        })}
      </group>

      {/* Lush Grass Clumps with Pebble Rings (Matching Image 1) along the village greens */}
      <LushGrassClump position={[-3.5, 0, 1.2]} scale={1.3} />
      <LushGrassClump position={[3.8, 0, 1.5]} scale={1.25} />
      <LushGrassClump position={[-1.5, 0, 5.5]} scale={1.2} />
      <LushGrassClump position={[1.8, 0, 5.2]} scale={1.15} />
      <LushGrassClump position={[-4.5, 0, -4.5]} scale={1.35} />
      <LushGrassClump position={[4.2, 0, -5]} scale={1.3} />

      {/* Sunny Yellow Ground Blossoms (Matching Image 2) */}
      <YellowGroundBlossom position={[-2.4, 0, 3.2]} scale={1.2} />
      <YellowGroundBlossom position={[2.6, 0, 3.0]} scale={1.15} />
      <YellowGroundBlossom position={[-5.2, 0, 4.2]} scale={1.25} />
      <YellowGroundBlossom position={[4.8, 0, 4.0]} scale={1.2} />

      {/* Village Center Stone Well */}
      <VillageWell position={[0, 0, -2]} />

      {/* Rustic Directional Wooden Signpost */}
      <DirectionalSignpost position={[2.6, 0, 2.2]} />

      {/* Wooden Split-Rail Fences lining the path */}
      <SplitRailFences />

      {/* Forest Floor Bioluminescent Mushrooms */}
      <ForestMushrooms count={18} radius={22} />

      {/* Natural Cobblestone Village Boulevard & Branches */}
      <group position={[0, 0.01, 0]}>
        {/* Central North-South Trail */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]} receiveShadow>
          <planeGeometry args={[3.2, 28]} />
          <meshStandardMaterial color="#475569" roughness={0.95} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0.5]} position={[4.8, 0.01, -1]} receiveShadow>
          <planeGeometry args={[2.4, 10]} />
          <meshStandardMaterial color="#475569" roughness={0.95} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, -0.5]} position={[-4.8, 0.01, -1]} receiveShadow>
          <planeGeometry args={[2.4, 10]} />
          <meshStandardMaterial color="#475569" roughness={0.95} />
        </mesh>
      </group>

      {/* Town Camping Site (Campfire, tripod kettle, canvas tents, log seats) */}
      <group position={[0, 0, 6.5]}>
        {/* Stone Ring */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <torusGeometry args={[1.0, 0.24, 8, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>

        {/* Charred Firewood Logs */}
        <mesh position={[0, 0.25, 0]} rotation={[0.4, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 1.5, 6]} />
          <meshStandardMaterial color="#2d1c0b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.25, 0]} rotation={[-0.4, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 1.5, 6]} />
          <meshStandardMaterial color="#2d1c0b" roughness={0.9} />
        </mesh>

        {/* Tripod with Cooking Kettle */}
        <group position={[0, 0, 0]}>
          <mesh position={[-0.4, 0.8, -0.4]} rotation={[0.2, 0, -0.2]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 1.7, 5]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.4, 0.8, -0.4]} rotation={[0.2, 0, 0.2]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 1.7, 5]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.8, 0.5]} rotation={[-0.3, 0, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 1.7, 5]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Kettle */}
          <mesh position={[0, 0.75, 0]} castShadow>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.7} />
          </mesh>
        </group>

        {/* Glowing Fire Embers & Flame Mesh */}
        <mesh position={[0, 0.58, 0]}>
          <coneGeometry args={[0.42, 0.9, 8]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#ea580c"
            emissiveIntensity={1.9}
            transparent
            opacity={0.92}
          />
        </mesh>
        <pointLight
          ref={campfireLightRef}
          position={[0, 1.3, 0]}
          intensity={2.2}
          distance={16}
          color="#f97316"
        />

        {/* Log Benches for sitting */}
        {[-2.3, 2.3].map((x, i) => (
          <mesh key={i} position={[x, 0.22, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.22, 2.2, 8]} />
            <meshStandardMaterial color="#5c4028" roughness={0.88} />
          </mesh>
        ))}

        {/* Natural Camping Tents in Earthy Canvas Tones */}
        {/* Tent 1: Khaki Canvas */}
        <group position={[-4.8, 0, 1.8]} rotation={[0, 0.55, 0]}>
          <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
            <coneGeometry args={[1.7, 2.1, 4]} />
            <meshStandardMaterial color="#94805c" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.7, 1.22]}>
            <planeGeometry args={[0.6, 1.2]} />
            <meshStandardMaterial color="#2d2218" />
          </mesh>
        </group>

        {/* Tent 2: Forest Olive Canvas */}
        <group position={[4.8, 0, 2.0]} rotation={[0, -0.55, 0]}>
          <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
            <coneGeometry args={[1.7, 2.1, 4]} />
            <meshStandardMaterial color="#4a5d45" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.7, 1.22]}>
            <planeGeometry args={[0.6, 1.2]} />
            <meshStandardMaterial color="#1b2818" />
          </mesh>
        </group>

        {/* Silas the Woodcutter 3D Character Model by Campfire */}
        <group
          position={[2.6, 0, 0.8]}
          rotation={[0, 2.8, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenStoryboard) onOpenStoryboard();
          }}
        >
          <ExplorerModel isWalking={false} scale={1.15} guide="WOODCUTTER" />
          <Html position={[0, 2.45, 0]} center distanceFactor={14}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenStoryboard) onOpenStoryboard();
              }}
              className="group cursor-pointer whitespace-nowrap rounded-2xl border border-red-300 bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-red-50 hover:border-red-400 active:scale-95 flex items-center gap-1.5"
            >
              <span className="text-sm">🪓</span>
              <span>Silas the Woodcutter</span>
              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700 uppercase">
                Guide
              </span>
            </button>
          </Html>
        </group>
      </group>

      {/* Render Dynamic Class Huts */}
      {classes.map((cls, idx) => {
        const pos = hutPositions[idx] || [0, 0, 0];
        const rot = hutRotations[idx] || [0, 0, 0];
        return (
          <ClassHut
            key={cls.id}
            classData={cls}
            position={pos}
            rotation={rot}
            onSelect={onSelectClass}
          />
        );
      })}

      {/* Surrounding Forest Trees (Stylized Clay Oaks matching Image 2 & Palms along Lake Shore matching Image 1) */}
      {/* 1. Tropical Palms along Lake Sylva Shoreline (Image 1) */}
      {[
        { pos: [-12.2, 0, -1.0], scale: 1.15, rotY: 0.3 },
        { pos: [-13.5, 0, 8.5], scale: 1.25, rotY: -0.8 },
        { pos: [-18.5, 0, -2.5], scale: 1.1, rotY: 1.2 },
        { pos: [-19.5, 0, 9.8], scale: 1.2, rotY: -1.6 },
        { pos: [-11.0, 0, 3.8], scale: 1.0, rotY: 0.5 },
      ].map((p, idx) => (
        <StylizedClayPalmTree
          key={`palm-${idx}`}
          position={p.pos as any}
          scale={p.scale}
          rotation={[0, p.rotY, 0]}
        />
      ))}

      {/* 2. Lush Stylized Clay Oak Trees surrounding the Village & Glades (Image 2) */}
      {Array.from({ length: 22 }).map((_, i) => {
        const angle = (i / 22) * Math.PI * 2;
        const dist = 21 + (i % 4) * 4.5;
        const x = Math.cos(angle) * dist;
        const z = Math.sin(angle) * dist - 6;

        // Skip positions directly over the lake center
        if (x < -13 && z > -2 && z < 10) return null;

        const leafTints = ['#448b2c', '#5ea828', '#388e3c', '#689f38', '#2e7d32'];
        const tint = leafTints[i % leafTints.length];
        const treeScale = 1.0 + (i % 3) * 0.22;

        return (
          <StylizedClayOakTree
            key={`oak-${i}`}
            position={[x, 0, z]}
            scale={treeScale}
            rotation={[0, i * 1.3, 0]}
            leafTint={tint}
          />
        );
      })}

      {/* Ambient Forest Fireflies */}
      <ForestParticles count={120} areaRadius={38} />
    </group>
  );
}
