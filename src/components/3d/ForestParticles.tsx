'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getDeviceTier } from '@/lib/deviceTier';

interface ForestParticlesProps {
  count?: number;
  areaRadius?: number;
}

export default function ForestParticles({
  count = 70,
  areaRadius = 18,
}: ForestParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Adapt particle density for weak processors and low-RAM devices
  const effectiveCount = useMemo(() => {
    const tier = getDeviceTier();
    return tier.isLowEnd ? Math.min(count, 30) : count;
  }, [count]);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(effectiveCount * 3);

    for (let i = 0; i < effectiveCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * areaRadius;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 0.5 + Math.random() * 6.5; // height above ground
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return [pos];
  }, [effectiveCount, areaRadius]);

  // Hardware-accelerated transformation instead of expensive CPU BufferAttribute reallocation
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.04;
    pointsRef.current.position.y = Math.sin(time * 0.8) * 0.12;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        color="#fef08a" // Soft golden glow
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
