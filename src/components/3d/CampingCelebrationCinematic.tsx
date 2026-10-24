'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { forestAudio } from '@/lib/audio';

interface CampingCelebrationCinematicProps {
  progress: number; // 0 to 1
  onComplete?: () => void;
}

export default function CampingCelebrationCinematic({
  progress,
  onComplete,
}: CampingCelebrationCinematicProps) {
  const { camera } = useThree();
  const bonfireLightRef = useRef<THREE.PointLight>(null);
  const fireworksFiredRef = useRef(false);

  useEffect(() => {
    // When progress enters phase 3 (Town camping celebration > 0.75), fire bursts of fireworks
    if (progress >= 0.75 && !fireworksFiredRef.current) {
      fireworksFiredRef.current = true;
      forestAudio.playCelebrationFanfare();

      try {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
        };

        function fire(particleRatio: number, opts: any) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
          colors: ['#fbbf24', '#f59e0b', '#22c55e'],
        });
        fire(0.2, {
          spread: 60,
          colors: ['#38bdf8', '#818cf8', '#f43f5e'],
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
          colors: ['#fde047', '#4ade80', '#fb7185'],
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
          colors: ['#a855f7', '#ec4899', '#f59e0b'],
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
          colors: ['#22c55e', '#38bdf8', '#fbbf24'],
        });
      } catch (e) {}
    }
  }, [progress]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // PHASE 1: Forest Moves Forward into the Sky (p: 0.0 -> 0.35)
    if (progress < 0.35) {
      const localT = progress / 0.35;
      // Camera ascends into the clouds and glides forward
      const startPos = new THREE.Vector3(0, 8, 16);
      const skyPos = new THREE.Vector3(0, 36, -15);
      camera.position.lerpVectors(startPos, skyPos, localT);
      camera.lookAt(0, 2, -60);
    }
    // PHASE 2: Mountain Sunset (p: 0.35 -> 0.75)
    else if (progress < 0.75) {
      const localT = (progress - 0.35) / 0.4;
      // Camera faces the majestic mountain horizon as the sun sinks behind the peaks
      const skyPos = new THREE.Vector3(0, 36, -15);
      const sunsetPos = new THREE.Vector3(0, 22, -45);
      camera.position.lerpVectors(skyPos, sunsetPos, localT);
      // Focus directly on the distant snow-capped mountain ridge
      camera.lookAt(0, 16, -110);
    }
    // PHASE 3: Town Camping Celebration (p: 0.75 -> 1.0)
    else {
      const localT = (progress - 0.75) / 0.25;
      // Camera glides down over the village square and roaring campsite bonfire
      const sunsetPos = new THREE.Vector3(0, 22, -45);
      const campPos = new THREE.Vector3(0, 9, 20);
      camera.position.lerpVectors(sunsetPos, campPos, localT);
      camera.lookAt(0, 2, 5);
    }

    // Roaring Bonfire Light during celebration phase
    if (bonfireLightRef.current) {
      const isCampingPhase = progress >= 0.7;
      bonfireLightRef.current.intensity = isCampingPhase
        ? 3.5 + Math.sin(t * 14) * 0.8 + Math.cos(t * 8) * 0.4
        : 0;
    }
  });

  return (
    <group>
      {/* Central Roaring Campfire for the Town Camping Celebration */}
      <group position={[0, 0, 5]}>
        {/* Bonfire Stone Enclosure */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <torusGeometry args={[1.5, 0.35, 10, 20]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>

        {/* Big Tepee Logs */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.6, 1.1, Math.sin(a) * 0.6]}
              rotation={[Math.cos(a) * 0.4, a, -Math.sin(a) * 0.4]}
              castShadow
            >
              <cylinderGeometry args={[0.12, 0.16, 2.4, 6]} />
              <meshStandardMaterial color="#1e130a" roughness={0.9} />
            </mesh>
          );
        })}

        {/* Great Flame Mesh (Ignites as town celebrates camping) */}
        {progress >= 0.65 && (
          <mesh position={[0, 1.4, 0]}>
            <coneGeometry args={[0.9, 2.2, 10]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#ea580c"
              emissiveIntensity={2.5}
              transparent
              opacity={0.94}
            />
          </mesh>
        )}

        {/* Campfire Sparkle & Glow Light */}
        <pointLight
          ref={bonfireLightRef}
          position={[0, 2.2, 0]}
          intensity={0}
          distance={26}
          color="#f97316"
        />

        {/* Campfire Sparks & Floating Embers */}
        {progress >= 0.7 && (
          <points position={[0, 2, 0]}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    0.2, 1.2, 0.1, -0.3, 1.8, 0.2, 0.4, 2.2, -0.1, -0.1, 2.5, 0.3,
                    0.3, 2.8, -0.2, -0.2, 3.2, 0.1, 0.1, 3.6, -0.1,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.22}
              color="#fde047"
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </points>
        )}
      </group>
    </group>
  );
}
