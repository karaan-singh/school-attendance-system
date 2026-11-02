'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface SkyAtmosphereProps {
  mode?: 'day' | 'sunset' | 'night' | 'cinematic';
  cinematicProgress?: number; // 0 (day/clearing) -> 0.5 (sunset in mountains) -> 1 (night camping celebration)
}

const COLOR_DAY_LIGHT = new THREE.Color('#fff7ed');
const COLOR_DAY_AMBIENT = new THREE.Color('#e0f2fe');
const COLOR_GOLDEN = new THREE.Color('#fbbf24');
const COLOR_SUNSET_ROSE = new THREE.Color('#f43f5e');
const COLOR_TWILIGHT_PURPLE = new THREE.Color('#c084fc');
const COLOR_MOONLIGHT = new THREE.Color('#38bdf8');
const COLOR_NIGHT_AMBIENT = new THREE.Color('#0b1d28');
const COLOR_SUNSET_LIGHT = new THREE.Color('#f97316');
const COLOR_SUNSET_AMBIENT = new THREE.Color('#9333ea');
const COLOR_NIGHT_SKY_LIGHT = new THREE.Color('#7dd3fc');
const COLOR_NIGHT_SKY_AMBIENT = new THREE.Color('#031525');

const tempLightColor = new THREE.Color();
const tempAmbientColor = new THREE.Color();

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
    let lightIntensity = 1.3;
    let ambientIntensity = 0.6;
    tempLightColor.copy(COLOR_DAY_LIGHT);
    tempAmbientColor.copy(COLOR_DAY_AMBIENT);

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
        tempLightColor.copy(COLOR_DAY_LIGHT).lerp(COLOR_GOLDEN, t);
        lightIntensity = THREE.MathUtils.lerp(1.3, 1.1, t);
      } else if (p < 0.75) {
        const t = (p - 0.4) / 0.35;
        // Sun dips right behind the distant mountain horizon
        sunY = THREE.MathUtils.lerp(15, -2, t);
        sunX = THREE.MathUtils.lerp(10, 0, t);
        sunZ = -150;
        tempLightColor.copy(COLOR_GOLDEN).lerp(COLOR_SUNSET_ROSE, t);
        tempAmbientColor.copy(COLOR_DAY_AMBIENT).lerp(COLOR_TWILIGHT_PURPLE, t);
        lightIntensity = THREE.MathUtils.lerp(1.1, 0.4, t);
        ambientIntensity = THREE.MathUtils.lerp(0.6, 0.3, t);
      } else {
        const t = (p - 0.75) / 0.25;
        sunY = -25;
        sunX = 0;
        sunZ = -150;
        tempLightColor.copy(COLOR_MOONLIGHT);
        lightIntensity = 0.25;
        tempAmbientColor.copy(COLOR_NIGHT_AMBIENT);
        ambientIntensity = 0.35;
      }
    } else if (mode === 'sunset') {
      sunY = 4;
      sunX = 0;
      sunZ = -140;
      tempLightColor.copy(COLOR_SUNSET_LIGHT);
      tempAmbientColor.copy(COLOR_SUNSET_AMBIENT);
      lightIntensity = 0.8;
      ambientIntensity = 0.45;
    } else if (mode === 'night') {
      sunY = -30;
      tempLightColor.copy(COLOR_NIGHT_SKY_LIGHT);
      tempAmbientColor.copy(COLOR_NIGHT_SKY_AMBIENT);
      lightIntensity = 0.2;
      ambientIntensity = 0.3;
    }

    sunPosRef.current = [sunX, sunY, sunZ];

    if (lightRef.current) {
      lightRef.current.position.set(sunX, Math.max(sunY, 8), sunZ);
      lightRef.current.color.copy(tempLightColor);
      lightRef.current.intensity = lightIntensity;
    }
    if (ambientRef.current) {
      ambientRef.current.color.copy(tempAmbientColor);
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
