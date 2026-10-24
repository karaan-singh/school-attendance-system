'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ForestParticlesProps {
  count?: number;
  areaRadius?: number;
}

export default function ForestParticles({
  count = 70,
  areaRadius = 18,
}: ForestParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * areaRadius;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 0.5 + Math.random() * 6.5; // height above ground
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      scl[i] = 0.8 + Math.random() * 1.4;
    }
    return [pos, scl];
  }, [count, areaRadius]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = positionAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Gentle floating bob & drift
      array[idx + 1] += Math.sin(time * 1.5 + i) * 0.008;
      array[idx] += Math.cos(time * 0.8 + i) * 0.004;

      // Keep within bounds
      if (array[idx + 1] > 8) array[idx + 1] = 1;
      if (array[idx + 1] < 0.5) array[idx + 1] = 7;
    }
    positionAttr.needsUpdate = true;
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
      />
    </points>
  );
}
