'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PinkWaterLily, WetlandCattail } from './StylizedBotanicals';

// =========================================================================
// 1. MOSSY CRAG BOULDER (NATURAL FACETED FORM)
// Features: Angular slate rock facets, natural mossy shelves,
// and companion river pebbles.
// =========================================================================

interface BoulderProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

export function MossyCragBoulder({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: BoulderProps) {
  const rockGranite = '#64748b';       // Sunlit mountain granite
  const rockSlate = '#475569';         // Stratified slate grey
  const rockSediment = '#78716c';      // Warm sedimentary mineral band
  const rockQuartz = '#94a3b8';        // Sun-bleached quartz edge highlight
  const rockFissure = '#334155';       // Crevice shadow depth
  const mossDeep = '#166534';          // Rich deep forest velvet moss
  const mossLime = '#84cc16';          // Sunlit golden-lime spore tips
  const flowerBlue = '#38bdf8';        // Alpine forget-me-not blue
  const flowerCenter = '#fde047';      // Blossom golden core

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* 1. Primary Faceted Geological Rock Mass with Sharp Cleavage Planes */}
      <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.45, 0]} />
        <meshStandardMaterial color={rockGranite} roughness={0.88} flatShading />
      </mesh>

      {/* 2. Secondary Angled Cleavage Shelf (Natural Stratification / Sedimentary Bedding) */}
      <mesh position={[0.32, 0.78, 0.42]} rotation={[0.18, 0.42, -0.12]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color={rockSediment} roughness={0.85} flatShading />
      </mesh>

      {/* 3. Sunlit Quartz Crest Facet (Catches high-altitude sunlight) */}
      <mesh position={[-0.22, 1.48, 0.18]} rotation={[0.25, -0.35, 0.15]} castShadow>
        <dodecahedronGeometry args={[0.82, 0]} />
        <meshStandardMaterial color={rockQuartz} roughness={0.78} flatShading />
      </mesh>

      {/* 4. Lower Shadowed Slate Fissure Base */}
      <mesh position={[-0.28, 0.42, 0.62]} rotation={[-0.1, -0.22, 0.08]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.28, 0]} />
        <meshStandardMaterial color={rockSlate} roughness={0.92} flatShading />
      </mesh>

      {/* 5. Deep Crevice Shadow Wedge */}
      <mesh position={[0.45, 0.45, -0.35]} rotation={[0.3, 0.1, -0.2]} castShadow>
        <dodecahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial color={rockFissure} roughness={0.95} flatShading />
      </mesh>

      {/* 6. Sculpted Multi-Lobed Velvet Moss Blanket Draping the Plateau */}
      <group position={[0.08, 1.84, -0.02]} rotation={[-0.08, 0.14, 0.04]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[0.88, 1.18, 0.22, 9]} />
          <meshStandardMaterial color={mossDeep} roughness={0.82} flatShading />
        </mesh>
        {/* Sunlit Golden-Lime Spore Crest */}
        <mesh position={[0.12, 0.08, 0.05]}>
          <cylinderGeometry args={[0.55, 0.82, 0.12, 8]} />
          <meshStandardMaterial color={mossLime} roughness={0.75} flatShading />
        </mesh>
      </group>

      {/* Secondary Moss Cushion on Mid-Shelf */}
      <mesh position={[0.42, 1.18, 0.54]} rotation={[0.15, 0.38, -0.12]} receiveShadow>
        <cylinderGeometry args={[0.52, 0.74, 0.14, 8]} />
        <meshStandardMaterial color={mossDeep} roughness={0.82} flatShading />
      </mesh>
      <mesh position={[0.45, 1.24, 0.54]} rotation={[0.15, 0.38, -0.12]}>
        <cylinderGeometry args={[0.32, 0.48, 0.08, 7]} />
        <meshStandardMaterial color={mossLime} roughness={0.75} flatShading />
      </mesh>

      {/* 7. Alpine Botanical Flora in Rock Crevices */}
      {/* Sedum Stonecrop Rosette */}
      <group position={[-0.65, 1.15, 0.68]} rotation={[0.38, -0.55, 0.22]}>
        <mesh scale={[0.16, 0.09, 0.16]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#84cc16" roughness={0.65} flatShading />
        </mesh>
        <mesh position={[0, 0.06, 0]} scale={[0.1, 0.06, 0.1]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#65a30d" roughness={0.6} flatShading />
        </mesh>
      </group>

      {/* Cluster of Tiny Azure Alpine Forget-Me-Not Wildflowers */}
      {[
        [-0.55, 1.35, 0.55],
        [-0.45, 1.42, 0.65],
        [-0.62, 1.28, 0.42],
      ].map((fp, fi) => (
        <group key={`flower-${fi}`} position={fp as any} scale={[0.075, 0.075, 0.075]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.4, 6, 6]} />
            <meshStandardMaterial color={flowerBlue} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.18, 6, 6]} />
            <meshStandardMaterial color={flowerCenter} emissive={flowerCenter} emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}

      {/* 8. Fractured Scree Collar (Encircling River Stones & Slate Chips) */}
      <mesh position={[-1.15, 0.22, 0.88]} castShadow>
        <dodecahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color={rockGranite} roughness={0.88} flatShading />
      </mesh>
      <mesh position={[1.32, 0.18, 0.72]} castShadow>
        <dodecahedronGeometry args={[0.36, 0]} />
        <meshStandardMaterial color={rockSlate} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.45, 0.14, 1.32]} castShadow>
        <dodecahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color={rockSediment} roughness={0.86} flatShading />
      </mesh>
      <mesh position={[-0.85, 0.15, -0.92]} castShadow>
        <dodecahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial color={rockGranite} roughness={0.88} flatShading />
      </mesh>
      <mesh position={[0.92, 0.14, -0.78]} castShadow>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={rockSlate} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.35, 0.12, 1.28]} castShadow>
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color={rockQuartz} roughness={0.82} flatShading />
      </mesh>
    </group>
  );
}

// =========================================================================
// 2. HORIZON ALPINE MOUNTAIN RANGE (SHARP POINTY PEAKS & RIDGES)
// Features: Sweeping jagged alpine massifs with sharp conical needle horns,
// dramatic knife-edge ridge crests, and glacial snowcaps.
// =========================================================================

interface MountainProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

export function StratifiedMountainRange({
  position = [0, 0, -95],
  scale = 1,
  rotation = [0, 0, 0],
}: MountainProps) {
  const slateColor = '#334155';
  const slateDark = '#1e293b';
  const slateDeep = '#0f172a';
  const alpineMoss = '#365314';
  const snowCap = '#f1f5f9';

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Central Soaring Alpine Peak (Towering Needle Summit) */}
      <group position={[0, 0, 0]}>
        {/* Massive Base Massif */}
        <mesh position={[0, 18, 0]} castShadow receiveShadow>
          <coneGeometry args={[32, 38, 7]} />
          <meshStandardMaterial color={slateDeep} roughness={0.96} />
        </mesh>

        {/* Mid-Elevation Jagged Horn */}
        <mesh position={[0, 32, -2]} castShadow>
          <coneGeometry args={[20, 32, 6]} />
          <meshStandardMaterial color={slateColor} roughness={0.94} />
        </mesh>

        {/* Sharp Pointy Summit Spire */}
        <mesh position={[0, 48, -3]} castShadow>
          <coneGeometry args={[9.5, 22, 6]} />
          <meshStandardMaterial color={slateDark} roughness={0.92} />
        </mesh>

        {/* Alpine Glacial Snowhorn Needle Tip */}
        <mesh position={[0, 56, -3]}>
          <coneGeometry args={[4.8, 12, 6]} />
          <meshStandardMaterial color={snowCap} roughness={0.5} />
        </mesh>

        {/* High Alpine Moss Shoulder */}
        <mesh position={[-6, 26, 4]} rotation={[0.2, 0.4, -0.2]}>
          <coneGeometry args={[11, 18, 5]} />
          <meshStandardMaterial color={alpineMoss} roughness={0.9} />
        </mesh>
        <mesh position={[7, 28, 3]} rotation={[0.2, -0.4, 0.2]}>
          <coneGeometry args={[10, 19, 5]} />
          <meshStandardMaterial color={alpineMoss} roughness={0.9} />
        </mesh>
      </group>

      {/* West Flanking Sharp Needle Spire */}
      <group position={[-38, 0, 6]} rotation={[0, 0.25, 0.05]}>
        <mesh position={[0, 16, 0]} castShadow>
          <coneGeometry args={[22, 36, 6]} />
          <meshStandardMaterial color={slateDark} roughness={0.95} />
        </mesh>
        <mesh position={[0, 32, 0]} castShadow>
          <coneGeometry args={[10, 24, 6]} />
          <meshStandardMaterial color={slateColor} roughness={0.92} />
        </mesh>
        <mesh position={[0, 42, 0]}>
          <coneGeometry args={[4.2, 10, 6]} />
          <meshStandardMaterial color={snowCap} roughness={0.55} />
        </mesh>
      </group>

      {/* East Flanking Sharp Needle Spire */}
      <group position={[40, 0, 4]} rotation={[0, -0.25, -0.05]}>
        <mesh position={[0, 18, 0]} castShadow>
          <coneGeometry args={[24, 40, 6]} />
          <meshStandardMaterial color={slateDark} roughness={0.95} />
        </mesh>
        <mesh position={[0, 34, 0]} castShadow>
          <coneGeometry args={[11, 26, 6]} />
          <meshStandardMaterial color={slateColor} roughness={0.92} />
        </mesh>
        <mesh position={[0, 45, 0]}>
          <coneGeometry args={[4.5, 11, 6]} />
          <meshStandardMaterial color={snowCap} roughness={0.55} />
        </mesh>
      </group>

      {/* Far Distant Horizon Spire Horns */}
      <mesh position={[-75, 20, -18]} rotation={[0, 0.5, 0]}>
        <coneGeometry args={[28, 48, 6]} />
        <meshStandardMaterial color={slateDeep} roughness={0.98} />
      </mesh>
      <mesh position={[78, 22, -18]} rotation={[0, -0.5, 0]}>
        <coneGeometry args={[30, 52, 6]} />
        <meshStandardMaterial color={slateDeep} roughness={0.98} />
      </mesh>
    </group>
  );
}

// =========================================================================
// 3. CASCADING WATERFALL MOUNTAIN (MASSIVE NATURAL POINTY MASSIF)
// Features:
// - ZERO blocky rectangular boxes.
// - Soaring jagged pointy alpine horns, aiguille needles, and angled ridge spurs.
// - Deep carved V-gorge canyon chasm where the torrent rushes down.
// - Clifftop evergreens/pines clinging to crags.
// - Multi-tier cascading flumes, churning splash shelf with rustic timber bridge.
// - Broad lower roaring cascade pouring into deep crystal turquoise plunge pool.
// =========================================================================

interface WaterfallProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

export function CascadingWaterfall({
  position = [0, 0, -22],
  scale = 1,
  rotation = [0, 0, 0],
}: WaterfallProps) {
  const upperWaterRef = useRef<THREE.Mesh>(null);
  const upperFoamRef = useRef<THREE.Mesh>(null);
  const midShelfFoamRef = useRef<THREE.Mesh>(null);
  const lowerWaterRef = useRef<THREE.Mesh>(null);
  const lowerVeilRef = useRef<THREE.Mesh>(null);
  const ripplesRef = useRef<THREE.Mesh>(null);
  const ripplesOuterRef = useRef<THREE.Mesh>(null);
  const ripplesTarnRef = useRef<THREE.Mesh>(null);
  const mistGroupRef = useRef<THREE.Group>(null);
  const splashGroupRef = useRef<THREE.Group>(null);

  const mountainDark = '#475569';     // Weathered mountain granite shadow (NO black lining)
  const mountainSlate = '#64748b';    // Sunlit slate rock
  const mountainCrag = '#64748b';     // Faceted cliff face
  const mountainHighlight = '#94a3b8';// Sunlit sharp rock rim
  const mossGreens = '#15803d';       // Lush alpine emerald moss
  const mossSunlit = '#65a30d';       // Sunlit golden-lime moss terrace
  const snowFrost = '#f8fafc';        // Pointy mountain frost/snow tips

  const waterDeepBlue = '#0369a1';    // Deep sapphire underbed
  const waterCyan = '#06b6d4';        // Vibrant crystal cyan
  const waterDeep = '#0284c7';        // Deep azure water
  const waterTurquoise = '#22d3ee';   // Shimmering turquoise
  const waterSky = '#38bdf8';         // Sunlit bright blue
  const waterPale = '#7dd3fc';        // Translucent shallow wash
  const foamWhite = '#ffffff';        // Brilliant aerated pure white foam

  // Rising volumetric gorge spray mist particles
  const mistParticles = useMemo(() => {
    return Array.from({ length: 44 }).map(() => ({
      x: (Math.random() - 0.5) * 5.8,
      y: 0.5 + Math.random() * 5.0,
      z: (Math.random() - 0.5) * 4.0,
      scale: 0.32 + Math.random() * 0.55,
      speedY: 0.7 + Math.random() * 1.0,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  // 28 airborne splash droplets arching up from the plunge pool impact zone
  const splashDroplets = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      angle: (i / 28) * Math.PI * 2 + (Math.random() - 0.5) * 0.3,
      radius: 0.9 + Math.random() * 1.8,
      maxH: 1.4 + Math.random() * 2.2,
      speed: 2.8 + Math.random() * 2.2,
      phase: Math.random() * Math.PI * 2,
      size: 0.08 + Math.random() * 0.1,
    }));
  }, []);

  // Frame animations for realistic physical water flow, waves, splashes, and boiling foam
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Dynamic physical vertex wave undulation for Upper Flume (cascading downward)
    if (upperWaterRef.current) {
      const geom = upperWaterRef.current.geometry;
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const x = pos.getX(i);
        const zWave = Math.sin(y * 3.2 - t * 16.0) * 0.09 + Math.cos(x * 3.0 + t * 10.0) * 0.04;
        pos.setZ(i, zWave);
      }
      pos.needsUpdate = true;
    }
    if (upperFoamRef.current) {
      upperFoamRef.current.position.z = 2.52 + Math.cos(t * 12.0) * 0.045;
      upperFoamRef.current.scale.x = 1 + Math.sin(t * 8.0) * 0.035;
    }

    // 2. Mid-tier churning splash shelf under wooden footbridge
    if (midShelfFoamRef.current) {
      midShelfFoamRef.current.scale.set(
        1 + Math.sin(t * 12) * 0.1,
        1 + Math.cos(t * 14) * 0.14,
        1
      );
    }

    // 3. Dynamic physical vertex wave undulation for Lower Cascade (violent roaring torrent)
    if (lowerWaterRef.current) {
      const geom = lowerWaterRef.current.geometry;
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const x = pos.getX(i);
        const zWave = Math.sin(y * 3.5 - t * 20.0) * 0.14 + Math.cos(x * 3.6 + t * 12.0) * 0.06;
        pos.setZ(i, zWave);
      }
      pos.needsUpdate = true;
    }
    if (lowerVeilRef.current) {
      lowerVeilRef.current.position.z = 4.38 + Math.cos(t * 14.0) * 0.05;
      lowerVeilRef.current.scale.x = 1 + Math.sin(t * 10.0) * 0.04;
    }

    // 4. Triple Concentric Expanding Plunge Pool Ripple Waves
    if (ripplesRef.current) {
      const cycle = (t * 2.0) % 1;
      const s = 1.0 + cycle * 0.6;
      ripplesRef.current.scale.set(s, s, 1);
      (ripplesRef.current.material as THREE.MeshStandardMaterial).opacity = (1 - cycle) * 0.85;
    }
    if (ripplesOuterRef.current) {
      const cycle2 = (t * 2.0 + 0.33) % 1;
      const s2 = 1.0 + cycle2 * 0.7;
      ripplesOuterRef.current.scale.set(s2, s2, 1);
      (ripplesOuterRef.current.material as THREE.MeshStandardMaterial).opacity = (1 - cycle2) * 0.65;
    }
    if (ripplesTarnRef.current) {
      const cycle3 = (t * 2.0 + 0.66) % 1;
      const s3 = 1.0 + cycle3 * 0.8;
      ripplesTarnRef.current.scale.set(s3, s3, 1);
      (ripplesTarnRef.current.material as THREE.MeshStandardMaterial).opacity = (1 - cycle3) * 0.45;
    }

    // 5. Airborne Upward-Shooting Splash Droplets
    if (splashGroupRef.current) {
      splashGroupRef.current.children.forEach((child, i) => {
        const d = splashDroplets[i];
        if (d) {
          const cycle = ((t * d.speed + d.phase) % 1);
          child.position.y = 0.1 + Math.sin(cycle * Math.PI) * d.maxH;
          child.position.x = Math.cos(d.angle) * (d.radius * (0.35 + cycle * 0.65));
          child.position.z = Math.sin(d.angle) * (d.radius * (0.35 + cycle * 0.65)) - 0.6;
        }
      });
    }

    // 6. Upward drift of volumetric gorge spray mist
    if (mistGroupRef.current) {
      mistGroupRef.current.children.forEach((child, i) => {
        const p = mistParticles[i];
        if (p) {
          child.position.y = 0.5 + ((t * p.speedY + p.phase) % 5.0);
          child.position.x = p.x + Math.sin(t * 2.4 + p.phase) * 0.45;
        }
      });
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* ===================================================================
          1. MASSIVE POINTY MOUNTAIN MASSIF (ZERO BUILDING BLOCKS)
          Jagged pointy horns, sharp needles, angled ridge shoulders,
          and faceted crags.
          =================================================================== */}
      <group position={[0, 0, 0]}>
        {/* Central Towering Pointed Horn Peak (Apex at y = 38) */}
        <mesh position={[0, 19, -9]} castShadow receiveShadow>
          <coneGeometry args={[18, 38, 7]} />
          <meshStandardMaterial color={mountainDark} roughness={0.95} />
        </mesh>
        {/* Central Frost / Snow Needle Tip */}
        <mesh position={[0, 31, -9]}>
          <coneGeometry args={[6.5, 14, 7]} />
          <meshStandardMaterial color={snowFrost} roughness={0.65} />
        </mesh>
        {/* Massive Background Ridge for depth */}
        <mesh position={[0, 23, -17]} rotation={[0, 0.3, 0]} castShadow>
          <coneGeometry args={[26, 46, 6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.98} />
        </mesh>

        {/* ---------------- WEST FLANKING POINTED SPIRES & RIDGES ---------------- */}
        {/* West Primary Needle Horn (Apex at y = 32) */}
        <mesh position={[-14, 16, -4]} rotation={[0.08, 0.2, 0.06]} castShadow receiveShadow>
          <coneGeometry args={[11, 32, 6]} />
          <meshStandardMaterial color={mountainSlate} roughness={0.92} />
        </mesh>
        {/* West Needle Frost Cap */}
        <mesh position={[-14, 27.5, -4]}>
          <coneGeometry args={[4.0, 9, 6]} />
          <meshStandardMaterial color={snowFrost} roughness={0.65} />
        </mesh>

        {/* West Outer Pointed Spur (Apex at y = 23) */}
        <mesh position={[-22, 11.5, -1]} rotation={[-0.05, 0.4, 0.12]} castShadow receiveShadow>
          <coneGeometry args={[9.5, 23, 6]} />
          <meshStandardMaterial color={mountainDark} roughness={0.95} />
        </mesh>

        {/* West Forward Ridge Shoulder (Apex at y = 17) */}
        <mesh position={[-11, 8.5, 3.5]} rotation={[0.1, 0.35, -0.08]} castShadow receiveShadow>
          <coneGeometry args={[7.5, 17, 5]} />
          <meshStandardMaterial color={mountainCrag} roughness={0.9} />
        </mesh>

        {/* West High Scree & Moss Shoulder */}
        <mesh position={[-8.5, 14.5, 1.2]} rotation={[0.15, 0.2, -0.1]}>
          <coneGeometry args={[5.5, 11, 5]} />
          <meshStandardMaterial color={mossGreens} roughness={0.88} />
        </mesh>

        {/* ---------------- EAST FLANKING POINTED SPIRES & RIDGES ---------------- */}
        {/* East Primary Needle Horn (Apex at y = 33) */}
        <mesh position={[14, 16.5, -4]} rotation={[0.08, -0.2, -0.06]} castShadow receiveShadow>
          <coneGeometry args={[11.5, 33, 6]} />
          <meshStandardMaterial color={mountainSlate} roughness={0.92} />
        </mesh>
        {/* East Needle Frost Cap */}
        <mesh position={[14, 28.5, -4]}>
          <coneGeometry args={[4.2, 9.5, 6]} />
          <meshStandardMaterial color={snowFrost} roughness={0.65} />
        </mesh>

        {/* East Outer Pointed Spur (Apex at y = 24) */}
        <mesh position={[22, 12, -1]} rotation={[-0.05, -0.4, -0.12]} castShadow receiveShadow>
          <coneGeometry args={[10, 24, 6]} />
          <meshStandardMaterial color={mountainDark} roughness={0.95} />
        </mesh>

        {/* East Forward Ridge Shoulder (Apex at y = 17) */}
        <mesh position={[11, 8.5, 3.5]} rotation={[0.1, -0.35, 0.08]} castShadow receiveShadow>
          <coneGeometry args={[7.5, 17, 5]} />
          <meshStandardMaterial color={mountainCrag} roughness={0.9} />
        </mesh>

        {/* East High Scree & Moss Shoulder */}
        <mesh position={[8.5, 14.5, 1.2]} rotation={[0.15, -0.2, 0.1]}>
          <coneGeometry args={[5.5, 11, 5]} />
          <meshStandardMaterial color={mossGreens} roughness={0.88} />
        </mesh>

        {/* ---------------- CARVED V-GORGE CANYON WALLS (FACETED CRAGS) ---------------- */}
        {/* Left Canyon Faceted Rock Outcrops (Widened to 14.5 to cradle grand 22.5-unit cascade) */}
        <mesh position={[-13.5, 13.8, 0.8]} rotation={[0.2, 0.4, -0.1]} castShadow receiveShadow>
          <dodecahedronGeometry args={[4.2, 0]} />
          <meshStandardMaterial color={mountainCrag} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[-12.8, 9.5, 2.0]} rotation={[-0.1, 0.3, 0.15]} castShadow receiveShadow>
          <dodecahedronGeometry args={[3.8, 0]} />
          <meshStandardMaterial color={mountainDark} roughness={0.94} flatShading />
        </mesh>
        <mesh position={[-11.5, 5.2, 3.4]} rotation={[0.15, -0.2, 0.1]} castShadow receiveShadow>
          <dodecahedronGeometry args={[3.4, 0]} />
          <meshStandardMaterial color={mountainCrag} roughness={0.88} flatShading />
        </mesh>
        <mesh position={[-10.8, 2.0, 5.6]} rotation={[0.05, 0.3, -0.05]} castShadow receiveShadow>
          <dodecahedronGeometry args={[3.2, 0]} />
          <meshStandardMaterial color={mountainHighlight} roughness={0.85} flatShading />
        </mesh>
        {/* Left Moss Shelf Patches */}
        <mesh position={[-11.5, 7.6, 3.2]} rotation={[-0.1, 0.2, 0.05]}>
          <cylinderGeometry args={[2.2, 2.8, 0.35, 8]} />
          <meshStandardMaterial color={mossSunlit} roughness={0.82} flatShading />
        </mesh>
        <mesh position={[-10.5, 3.8, 5.4]} rotation={[-0.05, 0.15, 0.05]}>
          <cylinderGeometry args={[1.8, 2.4, 0.28, 8]} />
          <meshStandardMaterial color={mossSunlit} roughness={0.82} flatShading />
        </mesh>

        {/* Right Canyon Faceted Rock Outcrops */}
        <mesh position={[13.5, 13.8, 0.8]} rotation={[0.2, -0.4, 0.1]} castShadow receiveShadow>
          <dodecahedronGeometry args={[4.2, 0]} />
          <meshStandardMaterial color={mountainCrag} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[12.8, 9.5, 2.0]} rotation={[-0.1, -0.3, -0.15]} castShadow receiveShadow>
          <dodecahedronGeometry args={[3.8, 0]} />
          <meshStandardMaterial color={mountainDark} roughness={0.94} flatShading />
        </mesh>
        <mesh position={[11.5, 5.2, 3.4]} rotation={[0.15, 0.2, -0.1]} castShadow receiveShadow>
          <dodecahedronGeometry args={[3.4, 0]} />
          <meshStandardMaterial color={mountainCrag} roughness={0.88} flatShading />
        </mesh>
        <mesh position={[10.8, 2.0, 5.6]} rotation={[0.05, -0.3, 0.05]} castShadow receiveShadow>
          <dodecahedronGeometry args={[3.2, 0]} />
          <meshStandardMaterial color={mountainHighlight} roughness={0.85} flatShading />
        </mesh>
        {/* Right Moss Shelf Patches */}
        <mesh position={[11.5, 7.6, 3.2]} rotation={[-0.1, -0.2, -0.05]}>
          <cylinderGeometry args={[2.2, 2.8, 0.35, 8]} />
          <meshStandardMaterial color={mossSunlit} roughness={0.82} flatShading />
        </mesh>
        <mesh position={[10.5, 3.8, 5.4]} rotation={[-0.05, -0.15, -0.05]}>
          <cylinderGeometry args={[1.8, 2.4, 0.28, 8]} />
          <meshStandardMaterial color={mossSunlit} roughness={0.82} flatShading />
        </mesh>

      </group>

      {/* ===================================================================
          2. CLIFFTOP ALPINE CONIFER PINES PERCHED ON HIGH CRAGS
          Slender evergreen spires clinging to pointed mountain ridges
          =================================================================== */}
      <group position={[0, 0, 0]}>
        {[
          // West Crag Pines
          { pos: [-15.5, 15.2, 0.5], scale: 1.35 },
          { pos: [-12.8, 16.5, -1.2], scale: 1.55 },
          { pos: [-18.5, 12.0, 2.2], scale: 1.2 },
          { pos: [-20.0, 14.5, -2.5], scale: 1.4 },
          { pos: [-13.8, 8.8, 3.2], scale: 1.05 },

          // East Crag Pines
          { pos: [15.5, 15.2, 0.5], scale: 1.35 },
          { pos: [12.8, 16.5, -1.2], scale: 1.5 },
          { pos: [18.5, 12.0, 2.2], scale: 1.25 },
          { pos: [20.5, 14.5, -2.5], scale: 1.35 },
          { pos: [13.8, 8.8, 3.2], scale: 1.05 },
        ].map((pine, idx) => (
          <group key={`alpine-pine-${idx}`} position={pine.pos as any} scale={[pine.scale, pine.scale, pine.scale]}>
            {/* Trunk */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.22, 2.4, 6]} />
              <meshStandardMaterial color="#5d4037" roughness={0.9} />
            </mesh>
            {/* 3 Tiered Pointy Pine Needle Cones */}
            <mesh position={[0, 2.5, 0]} castShadow>
              <coneGeometry args={[1.4, 2.1, 7]} />
              <meshStandardMaterial color="#143d2b" roughness={0.82} />
            </mesh>
            <mesh position={[0, 3.8, 0]} castShadow>
              <coneGeometry args={[1.1, 1.9, 7]} />
              <meshStandardMaterial color="#1c4d36" roughness={0.8} />
            </mesh>
            <mesh position={[0, 5.0, 0]} castShadow>
              <coneGeometry args={[0.75, 1.6, 7]} />
              <meshStandardMaterial color="#2d6a4f" roughness={0.78} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ===================================================================
          3. RUSTIC WOODEN LOG FOOTBRIDGE (WARM SUNLIT TIMBER - NO BLACK LINES)
          =================================================================== */}
      <group position={[0, 6.2, 4.4]}>
        {/* Main Timber Deck Planks (Sunlit Warm Driftwood Cedar) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[24.0, 0.38, 2.2]} />
          <meshStandardMaterial color="#bcaaa4" roughness={0.82} />
        </mesh>
        {/* Support Log Piers */}
        {[-8.5, 8.5].map((px, i) => (
          <mesh key={`pier-${i}`} position={[px, -1.8, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.32, 3.8, 8]} />
            <meshStandardMaterial color="#8d6e63" roughness={0.88} />
          </mesh>
        ))}
        {/* Support Stringer Beams */}
        <mesh position={[0, -0.26, 0.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 24.0, 8]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.26, -0.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 24.0, 8]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} />
        </mesh>
        {/* Handrail Posts */}
        {[-10.5, -7.5, -4.5, -1.5, 1.5, 4.5, 7.5, 10.5].map((hx, idx) => (
          <group key={idx} position={[hx, 0.68, 0.95]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 1.35, 6]} />
              <meshStandardMaterial color="#8d6e63" />
            </mesh>
          </group>
        ))}
        {/* Handrail Top Beam */}
        <mesh position={[0, 1.32, 0.95]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 24.0, 6]} />
          <meshStandardMaterial color="#a1887f" />
        </mesh>
      </group>

      {/* ===================================================================
          4. ENORMOUS WATERFALL FALL AREA & RUSHING CASCADES (22.5 WIDTH)
          Realistic Multi-Shaded Blue & White Water (Zero Black Lining)
          =================================================================== */}
      {/* Tier 1 Underlayer: Deep Sapphire Bedrock Channel (Prevents Any Dark Crevices Behind Water) */}
      <mesh position={[0, 12.2, 2.22]} rotation={[0.14, 0, 0]}>
        <planeGeometry args={[14.8, 14.2]} />
        <meshStandardMaterial
          color={waterDeepBlue}
          emissive={waterDeepBlue}
          emissiveIntensity={0.35}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Tier 1: Grand Upper Mountain Flume with Dynamic Vertex Waves (Vibrant Cyan & Turquoise) */}
      <mesh
        ref={upperWaterRef}
        position={[0, 12.2, 2.3]}
        rotation={[0.14, 0, 0]}
        castShadow
      >
        <planeGeometry args={[14.5, 14.0, 24, 32]} />
        <meshStandardMaterial
          color={waterCyan}
          emissive={waterTurquoise}
          emissiveIntensity={0.72}
          roughness={0.05}
          metalness={0.28}
          transparent
          opacity={0.93}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Upper Flume Aerated White-Water Torrent Streaks */}
      <mesh ref={upperFoamRef} position={[0, 12.2, 2.38]} rotation={[0.14, 0, 0]}>
        <planeGeometry args={[13.5, 13.2, 20, 24]} />
        <meshStandardMaterial
          color={foamWhite}
          emissive="#ffffff"
          emissiveIntensity={0.95}
          roughness={0.12}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Mid-Tier Churning White-Water Splash Shelf under Bridge (Pure Foaming White & Cyan) */}
      <mesh
        ref={midShelfFoamRef}
        position={[0, 6.4, 3.4]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[20.5, 6.0]} />
        <meshStandardMaterial
          color={foamWhite}
          emissive={foamWhite}
          emissiveIntensity={0.98}
          roughness={0.15}
          transparent
          opacity={0.96}
        />
      </mesh>

      {/* Tier 2 Underlayer: Deep Sapphire Water Bed (Gives water realistic depth, NO black lining) */}
      <mesh position={[0, 3.8, 4.22]} rotation={[0.22, 0, 0]}>
        <planeGeometry args={[22.8, 9.6]} />
        <meshStandardMaterial
          color={waterDeepBlue}
          emissive={waterDeepBlue}
          emissiveIntensity={0.38}
          roughness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Tier 2: Lower Grand Roaring Cascade Curtain (EXPANDED TO 22.5 WIDTH) with Dynamic Surging Waves */}
      <mesh
        ref={lowerWaterRef}
        position={[0, 3.8, 4.3]}
        rotation={[0.22, 0, 0]}
        castShadow
      >
        <planeGeometry args={[22.5, 9.2, 36, 36]} />
        <meshStandardMaterial
          color={waterCyan}
          emissive={waterTurquoise}
          emissiveIntensity={0.78}
          roughness={0.04}
          metalness={0.3}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lower Cascade Shimmering Sky-Blue Mid-Layer */}
      <mesh position={[0, 3.8, 4.36]} rotation={[0.22, 0, 0]}>
        <planeGeometry args={[22.0, 9.0]} />
        <meshStandardMaterial
          color={waterSky}
          emissive={waterTurquoise}
          emissiveIntensity={0.65}
          roughness={0.06}
          transparent
          opacity={0.82}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lower Cascade Roaring White-Water Foam Veil */}
      <mesh ref={lowerVeilRef} position={[0, 3.8, 4.42]} rotation={[0.22, 0, 0]}>
        <planeGeometry args={[21.5, 8.8, 28, 28]} />
        <meshStandardMaterial
          color={foamWhite}
          emissive="#ffffff"
          emissiveIntensity={0.98}
          roughness={0.08}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Braided White Water Rapids (11 Vertical Torrent Stream Strips across 22.5-wide cascade) */}
      {[-9.5, -7.6, -5.7, -3.8, -1.9, 0, 1.9, 3.8, 5.7, 7.6, 9.5].map((fx, idx) => (
        <mesh
          key={`flume-${idx}`}
          position={[fx, 3.8, 4.5]}
          rotation={[0.22, 0, (idx === 0 ? 0.08 : idx === 10 ? -0.08 : (idx % 2 === 0 ? 0.025 : -0.025))]}
        >
          <planeGeometry args={[1.5, 8.8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.0}
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* ===================================================================
          5. EXPANSIVE MOUNTAIN TARN LAKE & CHURNING BASIN (EXPANDED TO RADIUS 24.0)
          =================================================================== */}
      <group position={[0, 0.12, 7.5]}>
        {/* Crystal Turquoise Alpine Tarn Pool Surface (Radius expanded to 24.0) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[24.0, 64]} />
          <meshStandardMaterial
            color={waterDeep}
            emissive={waterCyan}
            emissiveIntensity={0.52}
            roughness={0.04}
            metalness={0.38}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Deep Sapphire Water Bed */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
          <circleGeometry args={[25.2, 64]} />
          <meshStandardMaterial color="#0284c7" roughness={0.8} />
        </mesh>

        {/* Churning Impact White-Water Boiling Mound (Radius expanded to 11.5) */}
        <mesh position={[0, 0.08, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[11.5, 48]} />
          <meshStandardMaterial
            color={foamWhite}
            emissive={foamWhite}
            emissiveIntensity={1.0}
            transparent
            opacity={0.96}
          />
        </mesh>

        {/* 1. Primary Inner High-Intensity Impact Foam Ripple Ring */}
        <mesh
          ref={ripplesRef}
          position={[0, 0.06, -1.5]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[3.5, 9.8, 44]} />
          <meshStandardMaterial
            color={foamWhite}
            emissive={foamWhite}
            emissiveIntensity={0.92}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* 2. Secondary Mid-Range Turquoise Shockwave Ripple Ring */}
        <mesh
          ref={ripplesOuterRef}
          position={[0, 0.05, -1.5]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[9.0, 17.5, 52]} />
          <meshStandardMaterial
            color={waterTurquoise}
            emissive={waterTurquoise}
            emissiveIntensity={0.65}
            transparent
            opacity={0.68}
          />
        </mesh>

        {/* 3. Tertiary Outer Dissipating Tarn Ripple Ring (Spanning to Radius 24) */}
        <mesh
          ref={ripplesTarnRef}
          position={[0, 0.04, -1.5]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[16.8, 24.0, 60]} />
          <meshStandardMaterial
            color={waterCyan}
            emissive={waterTurquoise}
            emissiveIntensity={0.45}
            transparent
            opacity={0.48}
          />
        </mesh>

        {/* Airborne Water Splash Droplet Particles Shooting Upwards */}
        <group ref={splashGroupRef}>
          {splashDroplets.map((d, idx) => (
            <mesh key={`splash-${idx}`}>
              <sphereGeometry args={[d.size * 1.25, 6, 6]} />
              <meshStandardMaterial
                color="#f0fdfa"
                emissive="#ffffff"
                emissiveIntensity={0.85}
                transparent
                opacity={0.92}
              />
            </mesh>
          ))}
        </group>

        {/* Plunge Pool Ambient Glow Light */}
        <pointLight position={[0, 2.8, -1.0]} intensity={5.5} distance={32} color="#67e8f9" />

        {/* 14 HYPER-REALISTIC BOTANICAL PINK LOTUS WATER LILIES SCATTERED ON EXPANDIVE 24-UNIT LAKE */}
        <PinkWaterLily position={[5.2, 0.04, 1.8]} scale={1.45} />
        <PinkWaterLily position={[-5.5, 0.04, 2.2]} scale={1.4} />
        <PinkWaterLily position={[9.8, 0.04, 4.5]} scale={1.5} />
        <PinkWaterLily position={[-10.2, 0.04, 5.0]} scale={1.4} />
        <PinkWaterLily position={[3.8, 0.04, 9.5]} scale={1.35} />
        <PinkWaterLily position={[-4.2, 0.04, 10.2]} scale={1.35} />
        <PinkWaterLily position={[8.5, 0.04, 12.5]} scale={1.3} />
        <PinkWaterLily position={[-8.8, 0.04, 12.0]} scale={1.3} />
        <PinkWaterLily position={[14.2, 0.04, 7.5]} scale={1.35} />
        <PinkWaterLily position={[-14.5, 0.04, 8.2]} scale={1.3} />
        <PinkWaterLily position={[12.5, 0.04, 14.5]} scale={1.25} />
        <PinkWaterLily position={[-12.8, 0.04, 14.0]} scale={1.25} />
        <PinkWaterLily position={[2.2, 0.04, 16.5]} scale={1.2} />
        <PinkWaterLily position={[-2.5, 0.04, 17.0]} scale={1.2} />

        {/* Cattails & Wetland Reeds flanking the grand 24-unit lake shoreline */}
        <WetlandCattail position={[-19.5, 0, 2.5]} scale={1.55} />
        <WetlandCattail position={[19.8, 0, 2.8]} scale={1.5} />
        <WetlandCattail position={[-21.5, 0, 8.5]} scale={1.6} />
        <WetlandCattail position={[21.8, 0, 9.0]} scale={1.55} />
        <WetlandCattail position={[-18.5, 0, 15.5]} scale={1.45} />
        <WetlandCattail position={[18.8, 0, 16.0]} scale={1.4} />
        <WetlandCattail position={[-15.2, 0, 19.5]} scale={1.35} />
        <WetlandCattail position={[15.5, 0, 19.8]} scale={1.3} />
      </group>

      {/* ===================================================================
          6. ATMOSPHERIC GORGE SPRAY MIST PARTICLES
          =================================================================== */}
      <group ref={mistGroupRef} position={[0, 0.2, 6.0]}>
        {mistParticles.map((p, idx) => (
          <mesh key={idx} position={[p.x * 2.2, p.y, p.z]} scale={[p.scale * 1.3, p.scale * 1.3, p.scale * 1.3]}>
            <sphereGeometry args={[0.38, 8, 8]} />
            <meshStandardMaterial
              color="#e0f2fe"
              emissive="#bae6fd"
              emissiveIntensity={0.55}
              transparent
              opacity={0.44}
              roughness={0.25}
            />
          </mesh>
        ))}
      </group>

      {/* Outflowing Mountain River Stream flowing downstream into forest */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.08, 17.5]}
        receiveShadow
      >
        <planeGeometry args={[9.5, 16.0]} />
        <meshStandardMaterial
          color={waterDeep}
          emissive={waterCyan}
          emissiveIntensity={0.42}
          roughness={0.08}
          metalness={0.25}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}
