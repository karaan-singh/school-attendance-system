'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// =========================================================================
// 1. STYLIZED CLAY OAK / DECIDUOUS TREE (MATCHING IMAGE 2)
// Features: Spreading buttress roots, organic sculpted trunk with boughs,
// and a lush dome canopy layered with individual stylized clay leaves.
// =========================================================================

interface StylizedTreeProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  leafTint?: string;
  species?: 'oak' | 'palm' | 'birch' | 'autumn';
  swaySpeed?: number;
}

export function StylizedClayOakTree({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  leafTint,
  swaySpeed = 1,
}: StylizedTreeProps) {
  const foliageRef = useRef<THREE.Group>(null);

  // Colors inspired by Image 2
  const trunkColor = '#8d623d';      // Warm sculpted wood clay
  const baseFoliageColor = leafTint || '#448b2c';

  // Individual stylized clay leaves distributed across the canopy dome
  const leafScales = useMemo(() => {
    const list: Array<{
      pos: [number, number, number];
      rot: [number, number, number];
      scale: number;
      color: string;
    }> = [];

    const leafPalette = leafTint
      ? [leafTint, leafTint, '#86efac']
      : ['#6cb834', '#85d43e', '#9fe04b', '#579e28', '#b5ea5b'];

    // 3 rings of overlapping clay leaves on the canopy dome
    const layers = [
      { y: 3.2, r: 2.15, count: 14, pitch: 0.35, size: 0.65 },
      { y: 4.1, r: 1.85, count: 12, pitch: 0.55, size: 0.62 },
      { y: 4.8, r: 1.35, count: 9,  pitch: 0.8,  size: 0.58 },
      { y: 5.3, r: 0.65, count: 5,  pitch: 1.1,  size: 0.52 },
    ];

    layers.forEach((layer, lIdx) => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2 + (lIdx * 0.4);
        const x = Math.sin(angle) * layer.r;
        const z = Math.cos(angle) * layer.r;
        const color = leafPalette[(i + lIdx) % leafPalette.length];

        list.push({
          pos: [x, layer.y, z],
          rot: [layer.pitch, angle, 0],
          scale: layer.size * (0.9 + (i % 3) * 0.1),
          color,
        });
      }
    });

    return list;
  }, [leafTint]);

  // Gentle wind sway
  useFrame(({ clock }) => {
    if (!foliageRef.current) return;
    const t = clock.getElapsedTime() * swaySpeed;
    foliageRef.current.rotation.z = Math.sin(t * 1.5 + position[0]) * 0.035;
    foliageRef.current.rotation.x = Math.cos(t * 1.2 + position[2]) * 0.025;
  });

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* 1. Ground Island / Loam Mound with scattered fallen leaf petals */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.18, 24]} />
        <meshStandardMaterial color="#4d7c38" roughness={0.9} />
      </mesh>

      {/* Scattered fallen clay leaves on the grass base */}
      {[-0.8, 0.6, 1.1, -1.2, 0.2].map((x, i) => (
        <mesh
          key={i}
          position={[x, 0.18, (i % 2 === 0 ? 0.9 : -0.8)]}
          rotation={[-Math.PI / 2 + 0.1, 0, i * 1.2]}
        >
          <circleGeometry args={[0.16, 8]} />
          <meshStandardMaterial color="#85d43e" roughness={0.8} />
        </mesh>
      ))}

      {/* 2. Spreading Buttress Roots (matching Image 2) */}
      <group position={[0, 0, 0]}>
        {/* Central Root Base */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 1.15, 0.9, 16]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} />
        </mesh>

        {/* Root Claw 1 (Front-Right) */}
        <mesh position={[0.7, 0.18, 0.5]} rotation={[0.2, 0.6, -0.4]} castShadow>
          <cylinderGeometry args={[0.15, 0.38, 1.1, 8]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} />
        </mesh>
        {/* Root Claw 2 (Front-Left) */}
        <mesh position={[-0.75, 0.18, 0.4]} rotation={[0.2, -0.6, 0.4]} castShadow>
          <cylinderGeometry args={[0.16, 0.4, 1.15, 8]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} />
        </mesh>
        {/* Root Claw 3 (Back-Left) */}
        <mesh position={[-0.55, 0.18, -0.7]} rotation={[-0.3, -0.8, 0.35]} castShadow>
          <cylinderGeometry args={[0.14, 0.36, 1.05, 8]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} />
        </mesh>
        {/* Root Claw 4 (Back-Right) */}
        <mesh position={[0.65, 0.18, -0.6]} rotation={[-0.3, 0.8, -0.35]} castShadow>
          <cylinderGeometry args={[0.15, 0.38, 1.1, 8]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} />
        </mesh>
      </group>

      {/* 3. Sculpted Clay Tree Trunk & Branching Boughs */}
      <group position={[0, 0, 0]}>
        {/* Main Trunk Body */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.55, 1.5, 16]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} />
        </mesh>

        {/* Branch 1 (Splits to Left) */}
        <mesh position={[-0.45, 2.45, 0.1]} rotation={[0.1, 0, 0.45]} castShadow>
          <cylinderGeometry args={[0.25, 0.36, 1.2, 10]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} />
        </mesh>
        {/* Branch 2 (Splits to Right) */}
        <mesh position={[0.5, 2.5, -0.1]} rotation={[-0.1, 0, -0.42]} castShadow>
          <cylinderGeometry args={[0.26, 0.38, 1.25, 10]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} />
        </mesh>
        {/* Branch 3 (Center-Back) */}
        <mesh position={[0, 2.65, -0.35]} rotation={[-0.38, 0, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.35, 1.1, 10]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} />
        </mesh>
      </group>

      {/* 4. Realistic Billowing Foliage Clouds (Matching Tree Reference Image 2) */}
      <group ref={foliageRef} position={[0, 0, 0]}>
        {/* Billowing Foliage Clouds */}
        {[
          { pos: [0, 4.0, 0], scale: [1.4, 1.2, 1.35], color: baseFoliageColor },
          { pos: [-1.1, 3.2, 0.45], scale: [1.1, 0.95, 1.05], color: '#388e3c' },
          { pos: [1.15, 3.3, -0.3], scale: [1.15, 0.98, 1.1], color: '#43a047' },
          { pos: [0.25, 3.0, 1.1], scale: [1.0, 0.88, 1.0], color: '#4caf50' },
          { pos: [-0.35, 3.7, -1.05], scale: [1.1, 0.95, 1.05], color: '#2e7d32' },
          { pos: [0.35, 4.65, 0.15], scale: [0.9, 0.78, 0.9], color: '#66bb6a' },
        ].map((lobe, i) => (
          <mesh
            key={`cloud-${i}`}
            position={lobe.pos as any}
            scale={lobe.scale as any}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[1.1, 1]} />
            <meshStandardMaterial color={lobe.color} roughness={0.72} />
          </mesh>
        ))}

        {/* Sunlit Leaf Tufts & Crests on Top Edges (Image 2) */}
        {[
          { pos: [0, 4.9, 0], scale: 0.7 },
          { pos: [-0.95, 3.75, 0.5], scale: 0.55 },
          { pos: [1.05, 3.85, -0.25], scale: 0.58 },
          { pos: [0.2, 3.55, 1.35], scale: 0.5 },
          { pos: [-0.3, 4.3, -1.2], scale: 0.52 },
          { pos: [0.4, 5.15, 0.2], scale: 0.45 },
        ].map((tuft, idx) => (
          <mesh
            key={`tuft-${idx}`}
            position={tuft.pos as any}
            scale={[tuft.scale, tuft.scale * 0.75, tuft.scale]}
            castShadow
          >
            <dodecahedronGeometry args={[0.75, 1]} />
            <meshStandardMaterial color="#a3e635" roughness={0.65} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// =========================================================================
// 2. STYLIZED CLAY PALM TREE (MATCHING IMAGE 1)
// Features: Segmented ringed trunk, spreading root buttress, notched
// layered drooping palm fronds, and companion mini-fern bush at base.
// =========================================================================

export function StylizedClayPalmTree({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  swaySpeed = 1,
}: StylizedTreeProps) {
  const crownRef = useRef<THREE.Group>(null);

  const palmTrunkColor = '#784d28';   // Warm cocoa brown clay

  // Number of drooping palm fronds
  const frondCount = 7;

  // Gentle tropical breeze swaying the fronds
  useFrame(({ clock }) => {
    if (!crownRef.current) return;
    const t = clock.getElapsedTime() * swaySpeed;
    crownRef.current.rotation.z = Math.sin(t * 1.6 + position[0]) * 0.04;
    crownRef.current.rotation.x = Math.cos(t * 1.3 + position[2]) * 0.03;
  });

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* 1. Base Green Island Clay Mound */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.9, 2.1, 0.22, 24]} />
        <meshStandardMaterial color="#558838" roughness={0.88} />
      </mesh>

      {/* Pebbles on island base */}
      <mesh position={[0.7, 0.22, 0.6]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#c29b68" roughness={0.85} />
      </mesh>
      <mesh position={[-0.5, 0.2, 0.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#c29b68" roughness={0.85} />
      </mesh>

      {/* 2. Flaring Buttress Trunk Base (Image 1) */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.95, 0.9, 14]} />
        <meshStandardMaterial color={palmTrunkColor} roughness={0.82} />
      </mesh>

      {/* 3. Segmented Ringed Palm Trunk (Image 1) */}
      <group position={[0, 0.9, 0]}>
        {/* 6 stacked clay segments with rings, with gentle organic curvature */}
        {[
          { y: 0.35, r: 0.38, rotZ: 0.03 },
          { y: 0.85, r: 0.36, rotZ: 0.05 },
          { y: 1.35, r: 0.34, rotZ: 0.07 },
          { y: 1.85, r: 0.33, rotZ: 0.05 },
          { y: 2.35, r: 0.32, rotZ: 0.02 },
          { y: 2.85, r: 0.31, rotZ: -0.02 },
        ].map((seg, idx) => (
          <group key={idx} position={[Math.sin(idx * 0.1) * 0.12, seg.y, 0]} rotation={[0, 0, seg.rotZ]}>
            {/* Main segment cylinder */}
            <mesh castShadow>
              <cylinderGeometry args={[seg.r * 0.95, seg.r * 1.05, 0.45, 14]} />
              <meshStandardMaterial color={palmTrunkColor} roughness={0.82} />
            </mesh>
            {/* Bulging clay ring ridge */}
            <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[seg.r * 1.06, 0.075, 10, 20]} />
              <meshStandardMaterial color="#673f1f" roughness={0.82} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 4. Companion Mini-Fern Bush at Base (exact match to Image 1) */}
      <group position={[0.75, 0.22, -0.45]} rotation={[0, 0.6, 0]}>
        {/* Little stem */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.5, 8]} />
          <meshStandardMaterial color={palmTrunkColor} roughness={0.85} />
        </mesh>
        {/* Small fan palm fronds */}
        {Array.from({ length: 5 }).map((_, fi) => {
          const a = (fi / 5) * Math.PI * 2;
          return (
            <group key={fi} position={[0, 0.5, 0]} rotation={[0.4, a, -0.3]}>
              <mesh position={[0, 0.2, 0.2]} scale={[0.35, 0.55, 0.06]}>
                <sphereGeometry args={[0.5, 10, 8]} />
                <meshStandardMaterial color="#4da328" roughness={0.7} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Grass tufts around trunk foot */}
      {[-0.6, 0.4, -0.2].map((x, i) => (
        <group key={i} position={[x, 0.22, (i % 2 === 0 ? 0.7 : -0.6)]}>
          <mesh rotation={[0.2, i * 1.5, 0]}>
            <coneGeometry args={[0.14, 0.35, 4]} />
            <meshStandardMaterial color="#3c6e24" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 5. Crown of Layered Notched Palm Fronds (Image 1) */}
      <group ref={crownRef} position={[0.1, 4.0, 0]}>
        {/* Center brown heart crown */}
        <mesh position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial color="#5a381d" roughness={0.85} />
        </mesh>

        {Array.from({ length: frondCount }).map((_, i) => {
          const angle = (i / frondCount) * Math.PI * 2;
          const isTopTier = i % 2 === 0;
          const droop = isTopTier ? 0.45 : 0.65;
          const frondLen = isTopTier ? 2.4 : 2.1;
          const frondColor = isTopTier ? '#7dc736' : '#5ca828';

          return (
            <group key={i} rotation={[0, angle, 0]}>
              {/* Arching Frond Stem */}
              <group position={[0, 0, 0]} rotation={[droop, 0, 0]}>
                {/* 3 layered blade segments along the arch to give notched silhouette */}
                {/* Inner blade */}
                <mesh position={[0, frondLen * 0.3, 0.15]} rotation={[0.2, 0, 0]} castShadow>
                  <boxGeometry args={[0.75, frondLen * 0.38, 0.05]} />
                  <meshStandardMaterial color={frondColor} roughness={0.65} />
                </mesh>
                {/* Mid blade (widest) */}
                <mesh position={[0, frondLen * 0.65, 0.05]} rotation={[0.45, 0, 0]} castShadow>
                  <boxGeometry args={[0.92, frondLen * 0.42, 0.05]} />
                  <meshStandardMaterial color={frondColor} roughness={0.65} />
                </mesh>
                {/* Tip blade (drooping) */}
                <mesh position={[0, frondLen * 0.95, -0.15]} rotation={[0.75, 0, 0]} castShadow>
                  <coneGeometry args={[0.45, frondLen * 0.38, 4]} />
                  <meshStandardMaterial color={isTopTier ? '#93db3f' : '#6cb834'} roughness={0.65} />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
    </group>
  );
}

// =========================================================================
// 3. ALPINE CONIFER PINE / MOUNTAIN FIR TREE (MATCHING ALPINE REFERENCES)
// Features: Slender organic tapering trunk with buttress roots,
// 4 stacked tiered pine needle skirts with sunlit lime tips,
// and soft organic wind sway.
// =========================================================================

export function AlpineConiferTree({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  swaySpeed = 1,
}: StylizedTreeProps) {
  const pineRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!pineRef.current) return;
    const t = clock.getElapsedTime() * swaySpeed;
    pineRef.current.rotation.z = Math.sin(t * 1.4 + position[0]) * 0.025;
    pineRef.current.rotation.x = Math.cos(t * 1.1 + position[2]) * 0.02;
  });

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Grass Base Island Mound */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[1.8, 2.1, 0.16, 16]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.9} />
      </mesh>
      {/* Buttress Roots */}
      {[0, 1.6, 3.2, 4.8].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.sin(angle) * 0.6, 0.18, Math.cos(angle) * 0.6]}
          rotation={[0.3, angle, 0]}
          castShadow
        >
          <coneGeometry args={[0.22, 0.7, 5]} />
          <meshStandardMaterial color="#3e2723" roughness={0.92} />
        </mesh>
      ))}

      {/* Main Pine Trunk */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.42, 4.4, 7]} />
        <meshStandardMaterial color="#2c1810" roughness={0.9} />
      </mesh>

      {/* 4 Tiered Conical Pine Needle Skirts with wind sway */}
      <group ref={pineRef}>
        {/* Tier 1 (Lowest, broadest) */}
        <mesh position={[0, 2.6, 0]} castShadow>
          <coneGeometry args={[2.4, 2.6, 7]} />
          <meshStandardMaterial color="#143d2b" roughness={0.82} />
        </mesh>
        {/* Tier 2 */}
        <mesh position={[0, 4.0, 0]} castShadow>
          <coneGeometry args={[2.0, 2.4, 7]} />
          <meshStandardMaterial color="#1c4d36" roughness={0.8} />
        </mesh>
        {/* Tier 3 */}
        <mesh position={[0, 5.3, 0]} castShadow>
          <coneGeometry args={[1.5, 2.2, 7]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.78} />
        </mesh>
        {/* Tier 4 (Spire apex with sunlit lime tip) */}
        <mesh position={[0, 6.5, 0]} castShadow>
          <coneGeometry args={[0.9, 2.0, 7]} />
          <meshStandardMaterial color="#40916c" roughness={0.75} />
        </mesh>
        <mesh position={[0, 7.3, 0]}>
          <coneGeometry args={[0.35, 0.8, 6]} />
          <meshStandardMaterial color="#74c69d" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 4. UNIVERSAL STYLIZED TREE
// =========================================================================

export default function StylizedClayTree(props: StylizedTreeProps) {
  if (props.species === 'palm') {
    return <StylizedClayPalmTree {...props} />;
  }
  if (props.species === 'autumn') {
    return <AlpineConiferTree {...props} />;
  }
  return <StylizedClayOakTree {...props} />;
}
