'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getDeviceTier } from '@/lib/deviceTier';

// 1. Circling Birds in the Upper Sky
export function FlyingBirds({ count = 6, height = 35, radius = 40 }: { count?: number; height?: number; radius?: number }) {
  const birdsGroupRef = useRef<THREE.Group>(null);
  const tier = useMemo(() => getDeviceTier(), []);

  useFrame(({ clock }) => {
    if (!birdsGroupRef.current) return;
    const t = clock.getElapsedTime() * 0.4;
    birdsGroupRef.current.rotation.y = t;
  });

  const birdPositions = useMemo(() => {
    const effectiveCount = tier.isLowEnd ? Math.min(count, 3) : count;
    return Array.from({ length: effectiveCount }).map((_, i) => {
      const angle = (i / effectiveCount) * Math.PI * 2;
      const r = radius + (Math.sin(i * 1.7) * 8);
      const h = height + Math.cos(i * 2.3) * 4;
      return [Math.cos(angle) * r, h, Math.sin(angle) * r] as [number, number, number];
    });
  }, [count, height, radius, tier.isLowEnd]);

  return (
    <group ref={birdsGroupRef}>
      {birdPositions.map((pos, idx) => (
        <group key={idx} position={pos} rotation={[0, -Math.PI / 2 + idx, 0]}>
          {/* Simple low-poly bird V-wing */}
          <mesh castShadow={tier.enableHeavyEffects}>
            <coneGeometry args={[0.2, 0.7, 4]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
          <mesh position={[-0.45, 0.05, 0]} rotation={[0, 0, 0.25]}>
            <boxGeometry args={[0.8, 0.04, 0.25]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh position={[0.45, 0.05, 0]} rotation={[0, 0, -0.25]}>
            <boxGeometry args={[0.8, 0.04, 0.25]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 2. Natural Meadow Wildflowers (Daisies, Buttercups, Poppies) - Batched with InstancedMesh (2 draw calls vs 180)
export function WildflowerField({ count = 90, spread = 45 }: { count?: number; spread?: number }) {
  const tier = useMemo(() => getDeviceTier(), []);
  const effectiveCount = tier.isLowEnd ? Math.min(count, 42) : count;

  const stemMeshRef = useRef<THREE.InstancedMesh>(null);
  const headMeshRef = useRef<THREE.InstancedMesh>(null);

  const flowerData = useMemo(() => {
    const list = [];
    const hexColors = ['#f8fafc', '#fef08a', '#f43f5e', '#a855f7', '#fb923c'];
    for (let i = 0; i < effectiveCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 5 + Math.random() * spread;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const color = new THREE.Color(hexColors[i % hexColors.length]);
      const scale = 0.6 + Math.random() * 0.7;
      list.push({ x, z, color, scale });
    }
    return list;
  }, [effectiveCount, spread]);

  useEffect(() => {
    if (!stemMeshRef.current || !headMeshRef.current) return;
    const dummy = new THREE.Object3D();

    flowerData.forEach((f, i) => {
      // 1. Stem instanced matrix
      dummy.position.set(f.x, 0.15 + 0.12 * f.scale, f.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(f.scale, f.scale, f.scale);
      dummy.updateMatrix();
      stemMeshRef.current!.setMatrixAt(i, dummy.matrix);

      // 2. Petal Head instanced matrix & individual color
      dummy.position.set(f.x, 0.15 + 0.25 * f.scale, f.z);
      dummy.rotation.set(0.2, (i * 0.7) % Math.PI, 0);
      dummy.scale.set(f.scale, f.scale, f.scale);
      dummy.updateMatrix();
      headMeshRef.current!.setMatrixAt(i, dummy.matrix);
      headMeshRef.current!.setColorAt(i, f.color);
    });

    stemMeshRef.current.instanceMatrix.needsUpdate = true;
    headMeshRef.current.instanceMatrix.needsUpdate = true;
    if (headMeshRef.current.instanceColor) {
      headMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [flowerData]);

  return (
    <group>
      <instancedMesh
        ref={stemMeshRef}
        args={[undefined, undefined, effectiveCount]}
        frustumCulled={false}
      >
        <cylinderGeometry args={[0.015, 0.02, 0.25, 4]} />
        <meshStandardMaterial color="#3f6212" roughness={0.9} />
      </instancedMesh>
      <instancedMesh
        ref={headMeshRef}
        args={[undefined, undefined, effectiveCount]}
        frustumCulled={false}
      >
        <dodecahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
    </group>
  );
}

// 3. Wooden Split-Rail Village Fences
export function SplitRailFences() {
  const fencePosts = [
    [-6.5, 0, 5],
    [-4.5, 0, 6.5],
    [-2.5, 0, 7.8],
    [2.5, 0, 7.8],
    [4.5, 0, 6.5],
    [6.5, 0, 5],
  ];

  return (
    <group>
      {fencePosts.map((pos, idx) => (
        <group key={idx} position={pos as any}>
          {/* Vertical Post */}
          <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.07, 0.09, 1.3, 6]} />
            <meshStandardMaterial color="#4a3728" roughness={0.9} />
          </mesh>

          {/* Horizontal Rails connecting to next post */}
          {idx < fencePosts.length - 1 && (
            <>
              <mesh
                position={[1.0, 0.85, 0.5]}
                rotation={[0, -0.4, 0]}
                castShadow
              >
                <boxGeometry args={[2.2, 0.07, 0.07]} />
                <meshStandardMaterial color="#5c4331" roughness={0.9} />
              </mesh>
              <mesh
                position={[1.0, 0.45, 0.5]}
                rotation={[0, -0.4, 0]}
                castShadow
              >
                <boxGeometry args={[2.2, 0.07, 0.07]} />
                <meshStandardMaterial color="#5c4331" roughness={0.9} />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
}

// 4. Village Stone Water Well
export function VillageWell({ position = [0, 0, -2] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cobblestone Circular Well Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.25, 1.0, 14]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      {/* Well Opening / Interior Water */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.1, 12]} />
        <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.4} />
      </mesh>

      {/* Two Timber Support Pillars */}
      <mesh position={[-0.8, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 1.8, 6]} />
        <meshStandardMaterial color="#5d4037" roughness={0.9} />
      </mesh>
      <mesh position={[0.8, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 1.8, 6]} />
        <meshStandardMaterial color="#5d4037" roughness={0.9} />
      </mesh>

      {/* Horizontal Crossbeam & Winch */}
      <mesh position={[0, 2.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 1.7, 6]} />
        <meshStandardMaterial color="#4e342e" roughness={0.9} />
      </mesh>
      {/* Hanging Wooden Water Bucket */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.16, 0.35, 8]} />
        <meshStandardMaterial color="#6d4c41" roughness={0.8} />
      </mesh>

      {/* Gabled Thatched Wooden Well Roof */}
      <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[1.5, 0.9, 4]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.85} />
      </mesh>
    </group>
  );
}

// 5. Rustic Directional Signpost
export function DirectionalSignpost({ position = [2.2, 0, 2.5] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Vertical Post */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 2.2, 6]} />
        <meshStandardMaterial color="#4e342e" roughness={0.9} />
      </mesh>
      {/* Arrow Sign 1: Forest Clearing */}
      <mesh position={[0.35, 1.7, 0]} rotation={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.85, 0.22, 0.05]} />
        <meshStandardMaterial color="#795548" roughness={0.8} />
      </mesh>
      {/* Arrow Sign 2: Lake Sylva */}
      <mesh position={[-0.35, 1.35, 0]} rotation={[0, -0.6, 0]} castShadow>
        <boxGeometry args={[0.8, 0.2, 0.05]} />
        <meshStandardMaterial color="#795548" roughness={0.8} />
      </mesh>
    </group>
  );
}

// 6. Forest Floor Glow Mushrooms
export function ForestMushrooms({ count = 16, radius = 25 }: { count?: number; radius?: number }) {
  const tier = useMemo(() => getDeviceTier(), []);
  const mushrooms = useMemo(() => {
    const effectiveCount = tier.isLowEnd ? Math.min(count, 8) : count;
    return Array.from({ length: effectiveCount }).map((_, i) => {
      const a = (i / effectiveCount) * Math.PI * 2 + Math.sin(i) * 0.4;
      const r = 8 + (i % 4) * 4;
      return {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        scale: 0.7 + (i % 3) * 0.3,
        color: i % 2 === 0 ? '#38bdf8' : '#fb923c', // Bioluminescent cyan and amber
      };
    });
  }, [count, radius, tier.isLowEnd]);

  return (
    <group>
      {mushrooms.map((m, idx) => (
        <group key={idx} position={[m.x, 0, m.z]} scale={[m.scale, m.scale, m.scale]}>
          {/* Stem */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.05, 0.08, 0.4, 6]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
          </mesh>
          {/* Glowing Cap */}
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.2, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color={m.color}
              emissive={m.color}
              emissiveIntensity={0.65}
              roughness={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
