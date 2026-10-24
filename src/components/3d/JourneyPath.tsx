'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ExplorerModel from './ExplorerModel';
import ForestParticles from './ForestParticles';

interface JourneyPathProps {
  onComplete: () => void;
  speed?: number;
}

export default function JourneyPath({ onComplete, speed = 0.08 }: JourneyPathProps) {
  const explorerGroupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const { camera } = useThree();

  // 3D Curved Forest Trail Waypoints
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 14),
      new THREE.Vector3(-3, 0, 8),
      new THREE.Vector3(2, 0, 2),
      new THREE.Vector3(-2, 0, -5),
      new THREE.Vector3(0, 0, -12),
    ]);
  }, []);

  useFrame((_, delta) => {
    if (progressRef.current >= 1) {
      onComplete();
      return;
    }

    progressRef.current += delta * speed;
    const t = Math.min(progressRef.current, 1);

    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();

    if (explorerGroupRef.current) {
      explorerGroupRef.current.position.copy(point);

      // Rotate character to face forward along the path
      const targetRotation = Math.atan2(tangent.x, tangent.z);
      explorerGroupRef.current.rotation.y = targetRotation;
    }

    // Camera smoothly follows 4 units behind and 3 units above
    const camOffset = tangent.clone().multiplyScalar(-5).add(new THREE.Vector3(0, 3.5, 0));
    const targetCamPos = point.clone().add(camOffset);
    camera.position.lerp(targetCamPos, 0.06);
    camera.lookAt(point.x, point.y + 1.2, point.z);
  });

  return (
    <group>
      {/* Ground Forest Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0c2315" roughness={0.9} />
      </mesh>

      {/* Dirt Forest Trail */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[3.2, 35]} />
        <meshStandardMaterial color="#3b2513" roughness={0.95} />
      </mesh>

      {/* Animated Walking Explorer */}
      <group ref={explorerGroupRef} position={[0, 0, 14]}>
        <ExplorerModel isWalking={true} scale={1.1} />
      </group>

      {/* Pathway Lanterns along the way */}
      {[-8, -2, 4, 10].map((z, idx) => (
        <group key={idx} position={[idx % 2 === 0 ? 2.2 : -2.2, 0, z]}>
          {/* Wooden Post */}
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 2, 6]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          {/* Glowing Lantern */}
          <mesh position={[0, 1.9, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.2}
            />
          </mesh>
          <pointLight position={[0, 1.9, 0]} intensity={1.2} distance={5} color="#fbbf24" />
        </group>
      ))}

      {/* Canopy Trees lining the journey */}
      {Array.from({ length: 16 }).map((_, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        const x = side * (4.5 + Math.random() * 4);
        const z = -14 + i * 2.2;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 2.5, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.45, 5, 6]} />
              <meshStandardMaterial color="#2d1c0b" roughness={0.9} />
            </mesh>
            <mesh position={[0, 5.5, 0]} castShadow>
              <coneGeometry args={[2.2, 4.5, 7]} />
              <meshStandardMaterial color={i % 3 === 0 ? '#14532d' : '#166534'} roughness={0.8} />
            </mesh>
          </group>
        );
      })}

      <ForestParticles count={70} areaRadius={16} />
    </group>
  );
}
