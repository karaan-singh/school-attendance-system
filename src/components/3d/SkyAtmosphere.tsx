'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface SkyAtmosphereProps {
  mode?: 'day' | 'sunset' | 'night' | 'cinematic';
  cinematicProgress?: number; // 0 (day/clearing) -> 0.5 (sunset in mountains) -> 1 (night camping celebration)
}

export default function SkyAtmosphere({
  mode = 'day',
  cinematicProgress = 0,
}: SkyAtmosphereProps) {
  const sunPosRef = useRef<[number, number, number]>([50, 40, -100]);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  useFrame(() => {
    let sunY = 40;
    let sunX = 50;
    let sunZ = -100;
    let lightColor = new THREE.Color('#fff7ed');
    let lightIntensity = 1.3;
    let ambientColor = new THREE.Color('#e0f2fe');
    let ambientIntensity = 0.6;

    if (mode === 'cinematic') {
      // 0.0 -> 0.4: Day turning to Golden Hour
      // 0.4 -> 0.7: Majestic Sun setting behind mountains
      // 0.7 -> 1.0: Twilight & Night camping with stars
      const p = cinematicProgress;

      if (p < 0.4) {
        const t = p / 0.4;
        sunY = THREE.MathUtils.lerp(40, 15, t);
        sunX = THREE.MathUtils.lerp(50, 10, t);
        sunZ = THREE.MathUtils.lerp(-100, -140, t);
        lightColor.lerp(new THREE.Color('#fbbf24'), t);
        lightIntensity = THREE.MathUtils.lerp(1.3, 1.1, t);
      } else if (p < 0.75) {
        const t = (p - 0.4) / 0.35;
        // Sun dips right behind the distant mountain horizon
        sunY = THREE.MathUtils.lerp(15, -2, t);
        sunX = THREE.MathUtils.lerp(10, 0, t);
        sunZ = -150;
        lightColor.lerp(new THREE.Color('#f43f5e'), t); // Fiery sunset red/pink
        ambientColor.lerp(new THREE.Color('#c084fc'), t); // Twilight purple
        lightIntensity = THREE.MathUtils.lerp(1.1, 0.4, t);
        ambientIntensity = THREE.MathUtils.lerp(0.6, 0.3, t);
      } else {
        const t = (p - 0.75) / 0.25;
        sunY = -25;
        sunX = 0;
        sunZ = -150;
        lightColor.set('#38bdf8'); // Moonlight
        lightIntensity = 0.25;
        ambientColor.set('#0b1d28');
        ambientIntensity = 0.35;
      }
    } else if (mode === 'sunset') {
      sunY = 4;
      sunX = 0;
      sunZ = -140;
      lightColor.set('#f97316');
      ambientColor.set('#9333ea');
      lightIntensity = 0.8;
      ambientIntensity = 0.45;
    } else if (mode === 'night') {
      sunY = -30;
      lightColor.set('#7dd3fc');
      ambientColor.set('#031525');
      lightIntensity = 0.2;
      ambientIntensity = 0.3;
    }

    sunPosRef.current = [sunX, sunY, sunZ];

    if (lightRef.current) {
      lightRef.current.position.set(sunX, Math.max(sunY, 8), sunZ);
      lightRef.current.color.copy(lightColor);
      lightRef.current.intensity = lightIntensity;
    }
    if (ambientRef.current) {
      ambientRef.current.color.copy(ambientColor);
      ambientRef.current.intensity = ambientIntensity;
    }
  });

  const isNightOrLateSunset =
    mode === 'night' || (mode === 'cinematic' && cinematicProgress > 0.65);

  return (
    <>
      {/* Dynamic Procedural Sky */}
      <Sky
        distance={450000}
        sunPosition={sunPosRef.current}
        inclination={0.6}
        azimuth={0.25}
        turbidity={mode === 'cinematic' && cinematicProgress > 0.4 ? 10 : 6}
        rayleigh={mode === 'cinematic' && cinematicProgress > 0.4 ? 3.5 : 1.2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Starry Night Sky when sun sets */}
      {isNightOrLateSunset && (
        <Stars
          radius={120}
          depth={60}
          count={3500}
          factor={4}
          saturation={0.5}
          fade
          speed={0.8}
        />
      )}

      {/* Primary Directional Sunlight / Moonlight */}
      <directionalLight
        ref={lightRef}
        position={[50, 40, -100]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={180}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />

      {/* Ambient Forest Light */}
      <ambientLight ref={ambientRef} intensity={0.65} color="#e0f2fe" />

      {/* Soft Fog for Realistic Atmospheric Depth */}
      <fog
        attach="fog"
        args={[
          isNightOrLateSunset ? '#061118' : '#e0f2fe',
          35,
          175,
        ]}
      />
    </>
  );
}
