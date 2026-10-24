'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// =========================================================================
// 1. LUSH GRASS CLUMP WITH PEBBLE RING (MATCHING IMAGE 1)
// Dense dome-shaped spiky grass mound surrounded by small river pebbles
// =========================================================================

interface PlantProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

export function LushGrassClump({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: PlantProps) {
  const clumpRef = useRef<THREE.Group>(null);

  // Subtle wind sway
  useFrame(({ clock }) => {
    if (!clumpRef.current) return;
    const t = clock.getElapsedTime();
    clumpRef.current.rotation.z = Math.sin(t * 1.8 + position[0]) * 0.04;
    clumpRef.current.rotation.x = Math.cos(t * 1.5 + position[2]) * 0.03;
  });

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Pebbles around base (Image 1) */}
      <mesh position={[-0.45, 0.06, 0.35]} rotation={[0.2, 0.4, 0]} castShadow>
        <dodecahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>
      <mesh position={[0.42, 0.05, 0.38]} rotation={[-0.1, 0.8, 0]} castShadow>
        <dodecahedronGeometry args={[0.11, 0]} />
        <meshStandardMaterial color="#475569" roughness={0.95} />
      </mesh>
      <mesh position={[0.05, 0.04, -0.42]} rotation={[0.4, -0.3, 0]} castShadow>
        <dodecahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>
      <mesh position={[-0.38, 0.04, -0.25]} rotation={[0, 0.2, 0]} castShadow>
        <dodecahedronGeometry args={[0.09, 0]} />
        <meshStandardMaterial color="#334155" roughness={0.95} />
      </mesh>

      {/* Main Grass Clump Mound with wind sway */}
      <group ref={clumpRef} position={[0, 0, 0]}>
        {/* Core mound */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.42, 8, 8]} />
          <meshStandardMaterial color="#4d7c0f" roughness={0.88} />
        </mesh>

        {/* Spiky Blade Cones radiating outward */}
        {[
          { pos: [0, 0.72, 0], rot: [0, 0, 0], scale: [0.22, 0.65, 0.22], color: '#a3e635' },
          { pos: [0.18, 0.55, 0.15], rot: [0.35, 0.5, 0.2], scale: [0.18, 0.55, 0.18], color: '#84cc16' },
          { pos: [-0.18, 0.52, 0.15], rot: [0.3, -0.6, -0.25], scale: [0.18, 0.52, 0.18], color: '#65a30d' },
          { pos: [0.22, 0.48, -0.16], rot: [-0.35, 0.8, 0.25], scale: [0.18, 0.5, 0.18], color: '#84cc16' },
          { pos: [-0.2, 0.5, -0.18], rot: [-0.4, -0.7, -0.3], scale: [0.17, 0.48, 0.17], color: '#65a30d' },
          { pos: [0.32, 0.35, 0.05], rot: [0.1, 0.2, 0.6], scale: [0.15, 0.42, 0.15], color: '#84cc16' },
          { pos: [-0.32, 0.35, -0.05], rot: [-0.1, -0.2, -0.6], scale: [0.15, 0.42, 0.15], color: '#4d7c0f' },
          { pos: [0, 0.35, 0.32], rot: [0.65, 0, 0], scale: [0.15, 0.42, 0.15], color: '#65a30d' },
          { pos: [0, 0.35, -0.32], rot: [-0.65, 0, 0], scale: [0.15, 0.42, 0.15], color: '#4d7c0f' },
        ].map((blade, idx) => (
          <mesh
            key={idx}
            position={blade.pos as any}
            rotation={blade.rot as any}
            scale={blade.scale as any}
            castShadow
          >
            <coneGeometry args={[1, 1, 5]} />
            <meshStandardMaterial color={blade.color} roughness={0.82} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// =========================================================================
// 2. TALL BLADE TUSSOCK / FOUNTAIN GRASS (MATCHING IMAGE 1)
// Slender upright fanning grass blades with pebble collar
// =========================================================================

export function TallBladeTussock({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: PlantProps) {
  const tussockRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!tussockRef.current) return;
    const t = clock.getElapsedTime();
    tussockRef.current.rotation.z = Math.sin(t * 2.1 + position[0] * 2) * 0.06;
  });

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Base Pebbles */}
      <mesh position={[-0.32, 0.05, 0.22]} castShadow>
        <dodecahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>
      <mesh position={[0.28, 0.04, -0.2]} castShadow>
        <dodecahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Tall Blades fanning outward */}
      <group ref={tussockRef}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const tilt = 0.28 + (i % 2) * 0.18;
          const h = 0.95 + (i % 3) * 0.25;
          const bladeColor = i % 2 === 0 ? '#4ade80' : '#22c55e';

          return (
            <mesh
              key={i}
              position={[Math.sin(angle) * 0.08, h / 2, Math.cos(angle) * 0.08]}
              rotation={[Math.cos(angle) * tilt, angle, Math.sin(angle) * tilt]}
              castShadow
            >
              <coneGeometry args={[0.07, h, 4]} />
              <meshStandardMaterial color={bladeColor} roughness={0.78} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// =========================================================================
// 3. BROAD-LEAF HOSTA SHRUB WITH WHITE BUD (MATCHING IMAGE 3)
// Radiating broad pointed jungle leaves with central white berry/flower cluster
// =========================================================================

export function BroadleafHosta({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: PlantProps) {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Radiating Broad Leaves */}
      {Array.from({ length: 7 }).map((_, i) => {
        const angle = (i / 7) * Math.PI * 2;
        const leafColor = i % 2 === 0 ? '#65a30d' : '#84cc16';

        return (
          <group key={i} rotation={[0, angle, 0]}>
            {/* Outward arching leaf */}
            <mesh
              position={[0.42, 0.18, 0]}
              rotation={[0, 0, -0.42]}
              castShadow
              receiveShadow
            >
              {/* Flattened diamond-shaped leaf */}
              <cylinderGeometry args={[0.18, 0.03, 0.65, 4]} />
              <meshStandardMaterial color={leafColor} roughness={0.75} />
            </mesh>
          </group>
        );
      })}

      {/* Central White Flower Bud Cluster (Image 3) */}
      <group position={[0, 0.22, 0]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.16, 5]} />
          <meshStandardMaterial color="#84cc16" />
        </mesh>
        {[-0.05, 0, 0.05].map((bx, i) => (
          <mesh key={i} position={[bx, 0.18, (i % 2) * 0.04 - 0.02]} castShadow>
            <sphereGeometry args={[0.045, 6, 6]} />
            <meshStandardMaterial color="#ffffff" emissive="#f8fafc" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// =========================================================================
// 4. HYPER-REALISTIC PINK LOTUS / SACRED WATER LILY (HIGH QUALITY)
// Features: Sculpted notched lily pad with leaf veins & water dew drops,
// 3-tiered multi-petal lotus bloom with golden stamen core, companion bud,
// and organic water float undulation.
// =========================================================================
// 4. HYPER-REALISTIC BOTANICAL PINK LOTUS (NELUMBO NUCIFERA / WATER LILY)
// Features: Multi-whorl cupped petals, central seed pod receptacle with stamen halo,
// notched peltate pad with undulating rim & radiating ribs, dew beads, and companion bud
// =========================================================================

export function PinkWaterLily({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: PlantProps) {
  const padRef = useRef<THREE.Group>(null);

  // Organic multi-axis floating bob & wave pitch undulation on water surface
  useFrame(({ clock }) => {
    if (!padRef.current) return;
    const t = clock.getElapsedTime();
    padRef.current.position.y = Math.sin(t * 2.0 + position[0] * 2.5 + position[2]) * 0.018;
    padRef.current.rotation.z = Math.sin(t * 1.6 + position[0]) * 0.024;
    padRef.current.rotation.x = Math.cos(t * 1.4 + position[2]) * 0.024;
  });

  const padEmerald = '#14532d';       // Deep aquatic pad emerald
  const padRim = '#166534';           // Curled outer rim tone
  const padVeinColor = '#4ade80';     // Bright radiating vascular ribs
  const sepalRose = '#be123c';        // Outer protective rose sepals
  const petalOuter = '#f43f5e';       // Rich vibrant outer petals
  const petalMid = '#fb7185';         // Soft blush cup petals
  const petalInner = '#ffe4e6';       // Delicate cream/pale inner petals
  const podGold = '#ca8a04';          // Central lotus seed receptacle
  const stamenGold = '#facc15';       // Golden anther filament tips

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      <group ref={padRef}>
        {/* ---------------- 1. SCULPTED PELTATE LILY PAD ---------------- */}
        <group position={[0, 0.02, 0]}>
          {/* Main Notched Pad Disk with Natural V-Cleft Cut */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.78, 36, 0.26, Math.PI * 1.89]} />
            <meshStandardMaterial
              color={padEmerald}
              roughness={0.45}
              metalness={0.12}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Undulating Curled Rim Lip (Raised Outer Margin) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
            <ringGeometry args={[0.72, 0.80, 36, 1, 0.26, Math.PI * 1.89]} />
            <meshStandardMaterial color={padRim} roughness={0.5} />
          </mesh>

          {/* Radiating Vascular Leaf Ribs (12 radiating veins from petiole origin) */}
          {[0.4, 0.8, 1.25, 1.7, 2.15, 2.6, 3.05, 3.5, 3.95, 4.4, 4.85, 5.3].map((angle, vi) => (
            <mesh
              key={`rib-${vi}`}
              rotation={[-Math.PI / 2, 0, angle]}
              position={[Math.sin(angle) * 0.36, 0.009, Math.cos(angle) * 0.36]}
            >
              <planeGeometry args={[0.022, 0.65]} />
              <meshStandardMaterial
                color={padVeinColor}
                transparent
                opacity={0.65}
                roughness={0.4}
              />
            </mesh>
          ))}

          {/* Translucent Water Dew Beads (hydrophobic lotus effect) */}
          {[
            [-0.24, 0.018, 0.22, 0.038],
            [0.32, 0.016, -0.16, 0.042],
            [-0.16, 0.015, -0.32, 0.032],
            [0.36, 0.017, 0.20, 0.045],
            [-0.05, 0.018, 0.28, 0.028],
            [0.18, 0.016, 0.34, 0.035],
          ].map((drop, di) => (
            <mesh key={`dew-${di}`} position={[drop[0], drop[1], drop[2]]}>
              <sphereGeometry args={[drop[3], 10, 10]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.05}
                metalness={0.5}
                transparent
                opacity={0.88}
              />
            </mesh>
          ))}

          {/* Submerged Leaf Petiole Stem Plunging into Water Bed */}
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.025, 0.03, 0.7, 6]} />
            <meshStandardMaterial color="#14532d" roughness={0.8} />
          </mesh>
        </group>

        {/* ---------------- 2. COMPANION JUVENILE PAD ---------------- */}
        <group position={[0.72, 0.018, -0.46]} rotation={[0, 0.8, 0]} scale={[0.55, 0.55, 0.55]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.65, 24, 0.32, Math.PI * 1.84]} />
            <meshStandardMaterial color="#15803d" roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
            <ringGeometry args={[0.58, 0.66, 24, 1, 0.32, Math.PI * 1.84]} />
            <meshStandardMaterial color="#166534" roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.02, 0.025, 0.6, 6]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        </group>

        {/* ---------------- 3. ELEVATED BOTANICAL LOTUS BLOOM ---------------- */}
        <group position={[0.05, 0.14, -0.05]} rotation={[0.08, 0.25, -0.05]}>
          {/* Flower Pedicel Stem (Elevates Bloom Gracefully above Water) */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.035, 0.04, 0.25, 8]} />
            <meshStandardMaterial color="#166534" roughness={0.7} />
          </mesh>

          {/* Whorl 1: Outer Calyx Spreading Sepals (4 sepals, flared outward) */}
          {Array.from({ length: 4 }).map((_, i) => {
            const angle = (i / 4) * Math.PI * 2 + 0.15;
            return (
              <group key={`w1-${i}`} rotation={[0, angle, 0]}>
                <mesh
                  position={[0.26, 0.02, 0]}
                  rotation={[0, 0, -0.78]}
                  scale={[0.18, 0.44, 0.06]}
                  castShadow
                >
                  <coneGeometry args={[0.42, 1.0, 7]} />
                  <meshStandardMaterial color={sepalRose} roughness={0.4} />
                </mesh>
              </group>
            );
          })}

          {/* Whorl 2: Outer Corolla Petals (8 broad cupped petals with pointed apex) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <group key={`w2-${i}`} rotation={[0, angle, 0]}>
                <mesh
                  position={[0.20, 0.08, 0]}
                  rotation={[0, 0, -0.52]}
                  scale={[0.16, 0.42, 0.05]}
                  castShadow
                >
                  <coneGeometry args={[0.46, 1.05, 7]} />
                  <meshStandardMaterial color={petalOuter} roughness={0.35} />
                </mesh>
              </group>
            );
          })}

          {/* Whorl 3: Middle Corolla Cup Petals (8 upright chalice petals) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2 + 0.39;
            return (
              <group key={`w3-${i}`} rotation={[0, angle, 0]}>
                <mesh
                  position={[0.13, 0.15, 0]}
                  rotation={[0, 0, -0.26]}
                  scale={[0.14, 0.38, 0.045]}
                  castShadow
                >
                  <coneGeometry args={[0.42, 1.0, 7]} />
                  <meshStandardMaterial color={petalMid} roughness={0.3} />
                </mesh>
              </group>
            );
          })}

          {/* Whorl 4: Inner Delicate Cream-Blush Petals (6 petals embracing center) */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2 + 0.52;
            return (
              <group key={`w4-${i}`} rotation={[0, angle, 0]}>
                <mesh
                  position={[0.07, 0.19, 0]}
                  rotation={[0, 0, -0.12]}
                  scale={[0.11, 0.32, 0.04]}
                >
                  <coneGeometry args={[0.38, 0.95, 6]} />
                  <meshStandardMaterial color={petalInner} roughness={0.25} />
                </mesh>
              </group>
            );
          })}

          {/* Central Lotus Seed Receptacle (Inverted Flat-Topped Conical Torus Pod) */}
          <group position={[0, 0.14, 0]}>
            <mesh>
              <cylinderGeometry args={[0.10, 0.05, 0.14, 12]} />
              <meshStandardMaterial
                color={podGold}
                emissive={podGold}
                emissiveIntensity={0.5}
                roughness={0.4}
              />
            </mesh>

            {/* Individual Seed Pores / Carpel Orifices on the Flat Top */}
            {[
              [0, 0.071, 0],
              [-0.04, 0.071, 0.03],
              [0.04, 0.071, 0.03],
              [-0.04, 0.071, -0.03],
              [0.04, 0.071, -0.03],
              [0, 0.071, 0.06],
              [0, 0.071, -0.06],
            ].map((sp, spi) => (
              <mesh key={`pore-${spi}`} position={sp as any}>
                <cylinderGeometry args={[0.012, 0.012, 0.005, 6]} />
                <meshStandardMaterial color="#713f12" roughness={0.9} />
              </mesh>
            ))}

            {/* Golden Halo of Anther Stamen Filaments Encircling the Seed Pod */}
            {Array.from({ length: 16 }).map((_, si) => {
              const sa = (si / 16) * Math.PI * 2;
              return (
                <group key={`stamen-${si}`} rotation={[0, sa, 0]}>
                  <mesh position={[0.11, 0.05, 0]}>
                    <cylinderGeometry args={[0.008, 0.008, 0.09, 4]} />
                    <meshStandardMaterial color="#fef08a" />
                  </mesh>
                  <mesh position={[0.11, 0.095, 0]}>
                    <sphereGeometry args={[0.016, 6, 6]} />
                    <meshStandardMaterial
                      color={stamenGold}
                      emissive={stamenGold}
                      emissiveIntensity={0.8}
                    />
                  </mesh>
                </group>
              );
            })}
          </group>

          {/* Delicate Warm Inner Glow */}
          <pointLight position={[0, 0.22, 0]} intensity={0.9} distance={1.8} color="#fef08a" />
        </group>

        {/* ---------------- 4. COMPANION LOTUS BUD ON CURVED STEM ---------------- */}
        <group position={[-0.45, 0.04, 0.35]} rotation={[0.18, 0.45, -0.18]}>
          {/* S-Curved Green Bud Stem */}
          <mesh position={[0, 0.14, 0]} rotation={[0.08, 0, 0.1]}>
            <cylinderGeometry args={[0.024, 0.032, 0.30, 8]} />
            <meshStandardMaterial color="#166534" roughness={0.7} />
          </mesh>
          {/* Pointed Rose/Pink Flower Bud (Spiraling Petals) */}
          <mesh position={[0.02, 0.32, 0.02]} castShadow>
            <coneGeometry args={[0.09, 0.26, 8]} />
            <meshStandardMaterial color={petalOuter} roughness={0.35} />
          </mesh>
          {/* Green Calyx Base Wrapper */}
          <mesh position={[0.02, 0.22, 0.02]}>
            <coneGeometry args={[0.07, 0.12, 6]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// =========================================================================
// 5. SUNNY YELLOW BUTTERCUP BLOSSOM (MATCHING IMAGE 2)
// Five-petaled bright yellow wildflower with round foliage clump
// =========================================================================

export function YellowGroundBlossom({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: PlantProps) {
  const flowerYellow = '#facc15';
  const leafGreen = '#2e7d32';

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Cluster of Round Ground Leaves */}
      {[-0.2, 0.15, -0.05].map((lx, i) => (
        <mesh
          key={`leaf-${i}`}
          position={[lx, 0.04, (i % 2) * 0.2 - 0.1]}
          rotation={[-Math.PI / 2 + 0.1, 0, i * 1.2]}
          receiveShadow
        >
          <circleGeometry args={[0.18, 8]} />
          <meshStandardMaterial color={leafGreen} roughness={0.8} />
        </mesh>
      ))}

      {/* Main Elevated Yellow Flower */}
      <group position={[0, 0.24, 0]}>
        {/* Stem */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.02, 0.025, 0.22, 4]} />
          <meshStandardMaterial color="#4d7c0f" roughness={0.9} />
        </mesh>

        {/* 5 Sunny Petals */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.sin(angle) * 0.09, 0.02, Math.cos(angle) * 0.09]}
              rotation={[Math.cos(angle) * 0.35, angle, -Math.sin(angle) * 0.35]}
              castShadow
            >
              <sphereGeometry args={[0.07, 6, 6]} />
              <meshStandardMaterial color={flowerYellow} roughness={0.6} />
            </mesh>
          );
        })}

        {/* Golden Orange Flower Center */}
        <mesh position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.045, 6, 6]} />
          <meshStandardMaterial color="#f97316" roughness={0.5} />
        </mesh>
      </group>

      {/* Companion Small Blossom */}
      <group position={[0.24, 0.14, 0.15]}>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.015, 0.02, 0.12, 4]} />
          <meshStandardMaterial color="#4d7c0f" />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <dodecahedronGeometry args={[0.07, 0]} />
          <meshStandardMaterial color={flowerYellow} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 6. WETLAND CATTAIL / BULRUSH (MATCHING IMAGE 2)
// Tall reed stalks with rich velvety russet brown heads
// =========================================================================

export function WetlandCattail({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: PlantProps) {
  const reedGreen = '#047857';
  const cattailBrown = '#78350f';

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Surrounding Slender Reed Leaves */}
      {[-0.2, 0, 0.2].map((rx, idx) => (
        <mesh
          key={`reed-${idx}`}
          position={[rx, 0.65, (idx % 2) * 0.1]}
          rotation={[0.1, idx * 0.8, (rx > 0 ? 0.12 : -0.12)]}
          castShadow
        >
          <coneGeometry args={[0.05, 1.3, 4]} />
          <meshStandardMaterial color={reedGreen} roughness={0.8} />
        </mesh>
      ))}

      {/* Primary Cattail Stalk & Head */}
      <group position={[0, 0, 0]}>
        {/* Stalk */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.035, 1.6, 5]} />
          <meshStandardMaterial color="#10b981" roughness={0.85} />
        </mesh>

        {/* Velvety Brown Sausage Head (Image 2) */}
        <mesh position={[0, 1.45, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.42, 8]} />
          <meshStandardMaterial color={cattailBrown} roughness={0.92} />
        </mesh>
        <mesh position={[0, 1.66, 0]}>
          <sphereGeometry args={[0.074, 8, 6]} />
          <meshStandardMaterial color={cattailBrown} roughness={0.92} />
        </mesh>
        <mesh position={[0, 1.24, 0]}>
          <sphereGeometry args={[0.074, 8, 6]} />
          <meshStandardMaterial color={cattailBrown} roughness={0.92} />
        </mesh>

        {/* Tip Spire */}
        <mesh position={[0, 1.76, 0]}>
          <cylinderGeometry args={[0.01, 0.02, 0.15, 4]} />
          <meshStandardMaterial color="#059669" />
        </mesh>
      </group>

      {/* Secondary Companion Stalk */}
      <group position={[0.16, 0, -0.12]}>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 1.3, 5]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.35, 8]} />
          <meshStandardMaterial color={cattailBrown} roughness={0.92} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 7. SPIRAL FIDDLEHEAD FERN (MATCHING IMAGE 2)
// Vibrant uncurling spiral crozier
// =========================================================================

export function SpiralFiddleheadFern({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: PlantProps) {
  const fernColor = '#4ade80';
  const innerColor = '#86efac';

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Lower Upright Stalk */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.06, 0.8, 6]} />
        <meshStandardMaterial color={fernColor} roughness={0.8} />
      </mesh>

      {/* Coiled Spiral Head (composed of torus segments) */}
      <group position={[0.1, 0.85, 0]}>
        <mesh rotation={[0, 0, 0.4]} castShadow>
          <torusGeometry args={[0.15, 0.04, 6, 16, Math.PI * 1.5]} />
          <meshStandardMaterial color={innerColor} roughness={0.75} />
        </mesh>
        <mesh position={[0.05, -0.04, 0]} rotation={[0, 0, 1.2]}>
          <torusGeometry args={[0.08, 0.03, 6, 12, Math.PI * 1.2]} />
          <meshStandardMaterial color="#bbf7d0" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 8. SUCCULENT ROSETTE (MATCHING IMAGE 2)
// Spreading star/agave rosette in rich turquoise / blue-green
// =========================================================================

export function SucculentRosette({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: PlantProps) {
  const succulentTurquoise = '#0d9488';
  const leafHighlight = '#2dd4bf';

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Outer Leaf Ring */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={`outer-${i}`}
            position={[Math.sin(angle) * 0.22, 0.06, Math.cos(angle) * 0.22]}
            rotation={[Math.cos(angle) * 0.5, angle, -Math.sin(angle) * 0.5]}
            receiveShadow
          >
            <boxGeometry args={[0.14, 0.04, 0.35]} />
            <meshStandardMaterial color={succulentTurquoise} roughness={0.65} />
          </mesh>
        );
      })}

      {/* Inner Raised Ring */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2 + 0.4;
        return (
          <mesh
            key={`inner-${i}`}
            position={[Math.sin(angle) * 0.12, 0.12, Math.cos(angle) * 0.12]}
            rotation={[Math.cos(angle) * 0.3, angle, -Math.sin(angle) * 0.3]}
          >
            <boxGeometry args={[0.1, 0.035, 0.25]} />
            <meshStandardMaterial color={leafHighlight} roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

// =========================================================================
// 9. ORGANIC BOTANICAL CLUSTER (COMPOSITE FIELD FOR FOREST & VILLAGE)
// Placed in natural groupings around springs, huts, boulders, and rivers
// =========================================================================

interface BotanicalGroveProps {
  type?: 'forest' | 'wetland' | 'village';
}

export function BotanicalMeadowField({ type = 'forest' }: BotanicalGroveProps) {
  // Precomputed coordinates for an expansive natural grassland meadow
  const grassClumpPositions: Array<[number, number, number, number]> = [
    // Near Whispering Spring & foreground
    [-4.5, 0, -1, 1.3],
    [4.8, 0, 0.5, 1.25],
    [-5.8, 0, 3.2, 1.35],
    [5.4, 0, 2.8, 1.25],
    [-3.2, 0, 4.5, 1.1],
    [3.5, 0, 4.2, 1.15],
    [-1.2, 0, 5.2, 1.05],
    [1.5, 0, 5.4, 1.05],
    [-6.5, 0, 5.0, 1.2],
    [6.8, 0, 4.8, 1.2],

    // Mid-meadow flanking the river brook
    [-3.8, 0, -4.5, 1.2],
    [4.0, 0, -5.2, 1.3],
    [-5.2, 0, -8.0, 1.25],
    [5.5, 0, -7.5, 1.3],
    [-3.4, 0, -11.5, 1.15],
    [3.6, 0, -12.0, 1.2],
    [-6.2, 0, -14.0, 1.35],
    [6.4, 0, -14.5, 1.3],
    [-4.0, 0, -17.5, 1.2],
    [4.2, 0, -18.0, 1.25],

    // Upper meadow leading towards waterfall tarn
    [-5.5, 0, -21.0, 1.3],
    [5.8, 0, -21.5, 1.25],
    [-3.6, 0, -24.5, 1.2],
    [3.8, 0, -25.0, 1.15],
    [-6.5, 0, -27.5, 1.4],
    [6.8, 0, -28.0, 1.35],
    [-4.2, 0, -31.0, 1.25],
    [4.5, 0, -31.5, 1.3],

    // Outer lateral pasture hills (East & West)
    [-10.5, 0, -3.0, 1.4],
    [11.0, 0, -2.5, 1.35],
    [-12.0, 0, -9.0, 1.3],
    [12.5, 0, -8.5, 1.4],
    [-13.5, 0, -16.0, 1.35],
    [14.0, 0, -15.5, 1.3],
    [-11.5, 0, -22.0, 1.25],
    [12.0, 0, -23.0, 1.3],
  ];

  const tussockPositions: Array<[number, number, number, number]> = [
    [-2.8, 0, 0.2, 1.25],
    [2.9, 0, -0.4, 1.2],
    [-6.2, 0, -4.0, 1.4],
    [6.5, 0, -3.5, 1.35],
    [-2.2, 0, -9.5, 1.2],
    [2.4, 0, -10.0, 1.25],
    [-7.0, 0, -11.0, 1.3],
    [7.2, 0, -10.5, 1.3],
    [-2.6, 0, -16.0, 1.2],
    [2.8, 0, -16.5, 1.2],
    [-6.8, 0, -19.5, 1.35],
    [7.0, 0, -20.0, 1.3],
    [-3.0, 0, -28.5, 1.25],
    [3.2, 0, -29.0, 1.25],
    [-8.5, 0, -2.0, 1.3],
    [9.0, 0, -1.5, 1.35],
    [-9.5, 0, -14.0, 1.3],
    [10.0, 0, -13.5, 1.25],
  ];

  const wildflowerPositions: Array<[number, number, number, number]> = [
    [-3.6, 0, 2.4, 1.2],
    [3.8, 0, 1.8, 1.15],
    [-1.5, 0, 3.9, 1.0],
    [1.8, 0, 3.8, 1.05],
    [-4.8, 0, -2.5, 1.1],
    [5.0, 0, -1.8, 1.15],
    [-2.9, 0, -6.5, 1.05],
    [3.1, 0, -7.0, 1.1],
    [-5.8, 0, -12.5, 1.2],
    [6.0, 0, -13.0, 1.15],
    [-3.5, 0, -20.5, 1.1],
    [3.7, 0, -21.0, 1.1],
    [-5.2, 0, -26.0, 1.25],
    [5.4, 0, -26.5, 1.2],
    [-8.0, 0, 1.0, 1.2],
    [8.2, 0, 0.5, 1.15],
  ];

  const cattailPositions: Array<[number, number, number, number]> = [
    [-1.8, 0, -4.5, 1.2],
    [1.9, 0, -6.0, 1.15],
    [-1.9, 0, -10.0, 1.25],
    [2.0, 0, -12.5, 1.2],
    [-2.0, 0, -16.5, 1.3],
    [2.1, 0, -19.0, 1.25],
    [-2.1, 0, -23.5, 1.25],
    [2.2, 0, -26.0, 1.2],
    [-2.2, 0, -30.0, 1.3],
    [2.3, 0, -32.0, 1.25],
  ];

  return (
    <group>
      {/* 1. Pink Water Lilies floating serenely down the river brook */}
      <PinkWaterLily position={[-0.6, 0.032, -6.5]} scale={1.15} />
      <PinkWaterLily position={[0.7, 0.032, -12.5]} scale={1.1} />
      <PinkWaterLily position={[-0.5, 0.032, -18.5]} scale={1.15} />
      <PinkWaterLily position={[0.6, 0.032, -24.5]} scale={1.05} />
      <PinkWaterLily position={[-0.4, 0.032, -30.0]} scale={1.1} />

      {/* 2. Cattails lining the entire 36-unit mountain river brook */}
      {cattailPositions.map((pos, idx) => (
        <WetlandCattail
          key={`cattail-${idx}`}
          position={[pos[0], pos[1], pos[2]]}
          scale={pos[3]}
        />
      ))}

      {/* 3. Expansive Field of Lush Grass Clumps with Pebble Rings (Matching Image 1) */}
      {grassClumpPositions.map((pos, idx) => (
        <LushGrassClump
          key={`grass-clump-${idx}`}
          position={[pos[0], pos[1], pos[2]]}
          scale={pos[3]}
        />
      ))}

      {/* 4. Swaying Tall Blade Tussocks (Matching Image 1) */}
      {tussockPositions.map((pos, idx) => (
        <TallBladeTussock
          key={`tussock-${idx}`}
          position={[pos[0], pos[1], pos[2]]}
          scale={pos[3]}
        />
      ))}

      {/* 5. Golden Sunny Yellow Buttercups & Wildflower Drifts (Matching Image 2) */}
      {wildflowerPositions.map((pos, idx) => (
        <YellowGroundBlossom
          key={`blossom-${idx}`}
          position={[pos[0], pos[1], pos[2]]}
          scale={pos[3]}
        />
      ))}

      {/* 6. Broadleaf Hosta Foliage Clusters (Matching Image 3) */}
      <BroadleafHosta position={[-5.0, 0, 1.5]} scale={1.3} />
      <BroadleafHosta position={[5.2, 0, 1.2]} scale={1.25} />
      <BroadleafHosta position={[-2.2, 0, -15]} scale={1.4} />
      <BroadleafHosta position={[2.5, 0, -14.5]} scale={1.35} />
      <BroadleafHosta position={[-6.5, 0, -23]} scale={1.3} />
      <BroadleafHosta position={[6.8, 0, -22.5]} scale={1.3} />

      {/* 7. Spiral Fiddlehead Ferns (Matching Image 2) */}
      <SpiralFiddleheadFern position={[-4.2, 0, -8]} scale={1.3} />
      <SpiralFiddleheadFern position={[4.4, 0, -7.5]} scale={1.25} />
      <SpiralFiddleheadFern position={[-6.8, 0, 0]} scale={1.4} />
      <SpiralFiddleheadFern position={[7.0, 0, -1]} scale={1.3} />
      <SpiralFiddleheadFern position={[-5.2, 0, -27]} scale={1.3} />
      <SpiralFiddleheadFern position={[5.5, 0, -26.5]} scale={1.25} />

      {/* 8. Succulent Agave Rosettes (Matching Image 2) */}
      <SucculentRosette position={[-3.1, 0, 3.2]} scale={1.2} />
      <SucculentRosette position={[3.3, 0, 3.1]} scale={1.15} />
      <SucculentRosette position={[-5.5, 0, -6]} scale={1.35} />
      <SucculentRosette position={[5.8, 0, -5.5]} scale={1.3} />
      <SucculentRosette position={[-4.5, 0, -18]} scale={1.25} />
      <SucculentRosette position={[4.8, 0, -17.5]} scale={1.2} />
    </group>
  );
}
