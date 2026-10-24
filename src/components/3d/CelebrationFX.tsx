'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

export default function CelebrationFX() {
  const { camera } = useThree();
  const angleRef = useRef(0);
  const ringRef = useRef<THREE.Points>(null);

  useEffect(() => {
    // Fire festive fireworks confetti in 2D overlay
    try {
      const end = Date.now() + 3 * 1000;
      const colors = ['#22c55e', '#fbbf24', '#38bdf8', '#4ade80'];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch (e) {}
  }, []);

  // Cinematic 360 camera pan
  useFrame((_, delta) => {
    angleRef.current += delta * 0.18;
    const radius = 16;
    const x = Math.sin(angleRef.current) * radius;
    const z = Math.cos(angleRef.current) * radius;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, x, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 8, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.05);
    camera.lookAt(0, 2, 0);

    // Rotate golden ring
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.5;
    }
  });

  // Golden particle vortex particles
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const a = (i / particleCount) * Math.PI * 4;
    const r = 2 + (i / particleCount) * 12;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = 0.5 + (i / particleCount) * 10;
    positions[i * 3 + 2] = Math.sin(a) * r;
  }

  return (
    <group>
      {/* Golden Heavenly Light Beam */}
      <spotLight
        position={[0, 24, 0]}
        target-position={[0, 0, 0]}
        intensity={3.5}
        color="#fef08a"
        angle={Math.PI / 4}
        penumbra={0.8}
      />

      {/* Golden Vortex Ring */}
      <points ref={ringRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          color="#fde047"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
