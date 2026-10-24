'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ExpeditionGuide } from '@/types';
import { useGameStore } from '@/store/useGameStore';

interface ExplorerModelProps {
  isWalking?: boolean;
  scale?: number;
  guide?: ExpeditionGuide;
  variant?: 'blue_tunic' | 'green_vest' | 'woodcutter' | 'white_shirt' | 'dark_tunic';
}

export default function ExplorerModel({
  isWalking = false,
  scale = 1,
  guide: propGuide,
  variant,
}: ExplorerModelProps) {
  const storeGuide = useGameStore((state) => state.selectedGuide);
  const activeGuide = propGuide || storeGuide || 'WOODCUTTER';

  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // Dynamic animation loop: natural walking limb swing and idle breathing
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (isWalking) {
      const walkSpeed = 8.5;
      // Leg swings
      if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(t * walkSpeed) * 0.55;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(t * walkSpeed) * 0.55;

      // Arm swings
      if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.sin(t * walkSpeed) * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t * walkSpeed) * 0.5;

      // Vertical body bob
      if (groupRef.current) {
        groupRef.current.position.y = Math.abs(Math.sin(t * walkSpeed)) * 0.08;
      }
      // Head slight bounce
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * walkSpeed * 0.5) * 0.04;
      }
    } else {
      // Idle breathing and slight subtle head sway
      if (groupRef.current) {
        groupRef.current.position.y = Math.sin(t * 2) * 0.03;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.8) * 0.06;
      }
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 1.5) * 0.04;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t * 1.5) * 0.04;
    }
  });

  // Determine outfit styling matching the user's reference image
  const skinColor = '#fed7aa'; // Warm anime skin tone from reference
  const skinShadow = '#fbcfe8';

  // Hair & Tunic palettes inspired by the reference grid
  let hairColor = '#78350f';       // Chestnut brown (center character)
  let hairFringeColor = '#92400e';
  let tunicColor = '#0284c7';      // Azure blue tunic
  let tunicDetailColor = '#0369a1';
  let pantsColor = '#1e3a8a';      // Deep denim
  let bootColor = '#3e2723';       // Dark leather boots
  let beltColor = '#451a03';
  let buckleColor = '#f59e0b';     // Brass/golden buckle
  let eyeColor = '#1e293b';        // Dark pupil

  if (activeGuide === 'WOODCUTTER' || variant === 'woodcutter') {
    // Silas the Woodcutter: Auburn/brown hair, green & leather vest (middle-left reference)
    hairColor = '#451a03';
    hairFringeColor = '#5c2406';
    tunicColor = '#15803d';        // Forest hunter green
    tunicDetailColor = '#522b10';  // Leather vest overlay
    pantsColor = '#3e2723';        // Earth brown trousers
    bootColor = '#1c1917';
    eyeColor = '#0f172a';
  } else if (activeGuide === 'DRUID' || variant === 'green_vest') {
    // Druid: Emerald tunic with deep teal pants (row 3 center in reference)
    hairColor = '#1c1917';        // Black hair
    hairFringeColor = '#292524';
    tunicColor = '#0f766e';        // Dark teal/green
    tunicDetailColor = '#042f2e';
    pantsColor = '#334155';
    bootColor = '#1e293b';
  } else if (activeGuide === 'RANGER' || variant === 'white_shirt') {
    // Ranger: Golden blonde hair, tavern tunic with suspenders (row 3 right in reference)
    hairColor = '#d97706';        // Blonde/honey
    hairFringeColor = '#b45309';
    tunicColor = '#f8fafc';        // White shirt
    tunicDetailColor = '#78350f';  // Suspenders
    pantsColor = '#451a03';        // Brown pants
    bootColor = '#1c1917';
  } else if (activeGuide === 'SCOUT' || variant === 'blue_tunic') {
    // Scout: Bright blue tunic with chest slit (center character in reference)
    hairColor = '#92400e';
    hairFringeColor = '#78350f';
    tunicColor = '#0284c7';
    tunicDetailColor = '#0369a1';
    pantsColor = '#1e3a8a';
    bootColor = '#3e2723';
  }

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* ===================================================================
          1. HEAD & HAIR (EXACT BLOCKY / MINECRAFT AESTHETIC FROM REFERENCE)
          =================================================================== */}
      <group ref={headRef} position={[0, 1.48, 0]}>
        {/* Core Head Block */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.54, 0.54]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>

        {/* Chunky Hair Cap (Top, Back, Sides) */}
        <mesh position={[0, 0.16, -0.02]} castShadow>
          <boxGeometry args={[0.58, 0.28, 0.58]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>
        {/* Back Hair Drape */}
        <mesh position={[0, -0.08, -0.22]} castShadow>
          <boxGeometry args={[0.58, 0.38, 0.18]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>
        {/* Left Side Hair Lock */}
        <mesh position={[-0.27, -0.02, 0.04]} castShadow>
          <boxGeometry args={[0.06, 0.36, 0.44]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>
        {/* Right Side Hair Lock */}
        <mesh position={[0.27, -0.02, 0.04]} castShadow>
          <boxGeometry args={[0.06, 0.36, 0.44]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>

        {/* Front Fringe / Bangs (Matching Character in Reference Image) */}
        <mesh position={[-0.14, 0.20, 0.27]} castShadow>
          <boxGeometry args={[0.24, 0.18, 0.06]} />
          <meshStandardMaterial color={hairFringeColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.12, 0.22, 0.27]} castShadow>
          <boxGeometry args={[0.24, 0.14, 0.06]} />
          <meshStandardMaterial color={hairFringeColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.02, 0.14, 0.272]} castShadow>
          <boxGeometry args={[0.12, 0.12, 0.05]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>

        {/* Pixel Eyes (White Sclera + Dark Pupils from Reference) */}
        {/* Left Eye */}
        <group position={[-0.14, -0.02, 0.272]}>
          <mesh>
            <planeGeometry args={[0.11, 0.08]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.02, 0, 0.002]}>
            <planeGeometry args={[0.06, 0.08]} />
            <meshBasicMaterial color={eyeColor} />
          </mesh>
          {/* Eyebrow */}
          <mesh position={[0, 0.065, 0.002]}>
            <planeGeometry args={[0.11, 0.024]} />
            <meshBasicMaterial color={hairColor} />
          </mesh>
        </group>

        {/* Right Eye */}
        <group position={[0.14, -0.02, 0.272]}>
          <mesh>
            <planeGeometry args={[0.11, 0.08]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.02, 0, 0.002]}>
            <planeGeometry args={[0.06, 0.08]} />
            <meshBasicMaterial color={eyeColor} />
          </mesh>
          {/* Eyebrow */}
          <mesh position={[0, 0.065, 0.002]}>
            <planeGeometry args={[0.11, 0.024]} />
            <meshBasicMaterial color={hairColor} />
          </mesh>
        </group>

        {/* Subtle Cute Mouth Line */}
        <mesh position={[0, -0.16, 0.272]}>
          <planeGeometry args={[0.10, 0.024]} />
          <meshBasicMaterial color="#d97706" />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.28, -0.02, 0]}>
          <boxGeometry args={[0.04, 0.08, 0.06]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        <mesh position={[0.28, -0.02, 0]}>
          <boxGeometry args={[0.04, 0.08, 0.06]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* ===================================================================
          2. TORSO & TUNIC (V-NECK / SUSPENDERS / BELT FROM REFERENCE)
          =================================================================== */}
      <group position={[0, 0.88, 0]}>
        {/* Main Body Block */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.66, 0.32]} />
          <meshStandardMaterial color={tunicColor} roughness={0.7} />
        </mesh>

        {/* V-Neck / Open Collar detailing showing undershirt/skin (Reference Image) */}
        <mesh position={[0, 0.22, 0.162]}>
          <planeGeometry args={[0.18, 0.20]} />
          <meshBasicMaterial color={skinColor} />
        </mesh>
        {/* Collar V-Trim Lines */}
        <mesh position={[-0.08, 0.22, 0.164]} rotation={[0, 0, -0.3]}>
          <planeGeometry args={[0.04, 0.22]} />
          <meshBasicMaterial color={tunicDetailColor} />
        </mesh>
        <mesh position={[0.08, 0.22, 0.164]} rotation={[0, 0, 0.3]}>
          <planeGeometry args={[0.04, 0.22]} />
          <meshBasicMaterial color={tunicDetailColor} />
        </mesh>

        {/* Vest or Suspenders Overlay (For Woodcutter & Ranger) */}
        {(activeGuide === 'WOODCUTTER' || activeGuide === 'RANGER') && (
          <group position={[0, 0, 0.02]}>
            <mesh position={[-0.18, 0.02, 0.16]}>
              <boxGeometry args={[0.12, 0.62, 0.02]} />
              <meshStandardMaterial color={tunicDetailColor} roughness={0.8} />
            </mesh>
            <mesh position={[0.18, 0.02, 0.16]}>
              <boxGeometry args={[0.12, 0.62, 0.02]} />
              <meshStandardMaterial color={tunicDetailColor} roughness={0.8} />
            </mesh>
          </group>
        )}

        {/* Waist Belt with Metallic Buckle (Image Reference) */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.56, 0.10, 0.34]} />
          <meshStandardMaterial color={beltColor} roughness={0.85} />
        </mesh>
        {/* Belt Buckle */}
        <mesh position={[0, -0.22, 0.174]}>
          <boxGeometry args={[0.12, 0.08, 0.02]} />
          <meshStandardMaterial color={buckleColor} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Slung Timber Lumber Axe on back (For Silas the Woodcutter) */}
        {activeGuide === 'WOODCUTTER' && (
          <group position={[0.05, 0.15, -0.22]} rotation={[0, 0, -0.45]}>
            {/* Axe Handle */}
            <mesh castShadow>
              <cylinderGeometry args={[0.03, 0.035, 1.05, 6]} />
              <meshStandardMaterial color="#543d2b" roughness={0.9} />
            </mesh>
            {/* Axe Steel Head */}
            <mesh position={[0, 0.42, 0.07]} castShadow>
              <boxGeometry args={[0.08, 0.24, 0.16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        )}
      </group>

      {/* ===================================================================
          3. TWO-TONE BLOCKY ARMS & HANDS (MATCHING REFERENCE IMAGE)
          Upper sleeve in tunic color, lower arm/hand in skin tone
          =================================================================== */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.38, 1.12, 0]}>
        {/* Upper Sleeve */}
        <mesh position={[0, -0.20, 0]} castShadow>
          <boxGeometry args={[0.20, 0.40, 0.20]} />
          <meshStandardMaterial color={tunicColor} roughness={0.7} />
        </mesh>
        {/* Lower Forearm / Skin Hand */}
        <mesh position={[0, -0.48, 0]} castShadow>
          <boxGeometry args={[0.18, 0.24, 0.18]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.38, 1.12, 0]}>
        {/* Upper Sleeve */}
        <mesh position={[0, -0.20, 0]} castShadow>
          <boxGeometry args={[0.20, 0.40, 0.20]} />
          <meshStandardMaterial color={tunicColor} roughness={0.7} />
        </mesh>
        {/* Lower Forearm / Skin Hand */}
        <mesh position={[0, -0.48, 0]} castShadow>
          <boxGeometry args={[0.18, 0.24, 0.18]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>

        {/* Small Lantern in Hand */}
        <group position={[0, -0.58, 0.14]}>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.12, 4]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.13, 0.16, 0.13]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.2}
              roughness={0.3}
            />
          </mesh>
        </group>
      </group>

      {/* ===================================================================
          4. LEGS & BOOTS (MATCHING REFERENCE IMAGE)
          Trousers block with dark leather boots at bottom
          =================================================================== */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.15, 0.55, 0]}>
        {/* Trousers */}
        <mesh position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.22, 0.36, 0.24]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.44, 0.02]} castShadow>
          <boxGeometry args={[0.23, 0.22, 0.27]} />
          <meshStandardMaterial color={bootColor} roughness={0.9} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.15, 0.55, 0]}>
        {/* Trousers */}
        <mesh position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.22, 0.36, 0.24]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.44, 0.02]} castShadow>
          <boxGeometry args={[0.23, 0.22, 0.27]} />
          <meshStandardMaterial color={bootColor} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
