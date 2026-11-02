'use client';

import React, { useEffect, useState, Suspense, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2 } from 'lucide-react';
import { getDeviceTier, DeviceTier } from '@/lib/deviceTier';

interface CanvasContainerProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  enableControls?: boolean;
  className?: string;
}

function SmoothCameraController({
  targetPos,
  targetLookAt,
  enableControls,
}: {
  targetPos: [number, number, number];
  targetLookAt: [number, number, number];
  enableControls: boolean;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetVec = useMemo(() => new THREE.Vector3(...targetLookAt), [targetLookAt]);
  const posVec = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);

  useFrame(() => {
    // Only lerp if there's actual distance to bridge, avoiding continuous idle CPU overhead
    const posDistSq = camera.position.distanceToSquared(posVec);
    if (posDistSq > 0.0001) {
      camera.position.lerp(posVec, 0.05);
    }

    if (controlsRef.current) {
      const targetDistSq = controlsRef.current.target.distanceToSquared(targetVec);
      if (targetDistSq > 0.0001) {
        controlsRef.current.target.lerp(targetVec, 0.05);
        controlsRef.current.update();
      }
    }
  });

  if (!enableControls) return null;

  return (
    <OrbitControls
      ref={controlsRef}
      target={targetLookAt}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={2}
      maxDistance={115}
      enableDamping
      dampingFactor={0.06}
    />
  );
}



export default function CanvasContainer({
  children,
  cameraPosition = [0, 8, 16],
  cameraTarget = [0, 1, 0],
  enableControls = true,
  className = '',
}: CanvasContainerProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [tier, setTier] = useState<DeviceTier>(() => getDeviceTier());
  const [isInView, setIsInView] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect WebGL capability and dynamic device tier
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
      setTier(getDeviceTier());
    } catch {
      setHasWebGL(false);
    }

    // Visibility Listener: pause 3D loops completely when tab is hidden to save RAM & CPU
    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Intersection Observer: pause rendering when scrolled out of viewport
    let observer: IntersectionObserver | null = null;
    if (containerRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer) observer.disconnect();
    };
  }, []);

  if (hasWebGL === false) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-8 text-center text-slate-700">
        <p className="text-lg font-semibold text-slate-900">
          WebGL Hardware Acceleration is Disabled or Unavailable
        </p>
        <p className="mt-2 text-sm text-slate-500">
          You can continue using the fast roll-call table mode below.
        </p>
      </div>
    );
  }

  // Determine whether WebGL engine should actively render frames
  const shouldRender = isTabVisible && isInView;

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ contain: 'paint size' }}
    >
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center bg-sky-50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="text-xs uppercase font-bold tracking-widest text-blue-700">
                Awakening Sunlit Valley...
              </span>
            </div>
          </div>
        }
      >
        <Canvas
          shadows={tier.enableHeavyEffects}
          dpr={tier.dpr}
          frameloop={shouldRender ? 'always' : 'never'}
          performance={{ min: 0.5 }}
          gl={{
            antialias: !tier.isLowEnd, // Enable antialias on mid/high tier; disable on ultra-low tier for big fill-rate gain
            alpha: true,
            powerPreference: tier.isLowEnd ? 'default' : 'high-performance',
            precision: tier.isLowEnd ? 'mediump' : 'highp',
            stencil: false,
            depth: true,
            preserveDrawingBuffer: false,
          }}
          className="h-full w-full"
        >
          <PerspectiveCamera
            makeDefault
            position={cameraPosition}
            fov={52}
            near={0.1}
            far={tier.isLowEnd ? 700 : 1200}
          />

          <SmoothCameraController
            targetPos={cameraPosition}
            targetLookAt={cameraTarget}
            enableControls={enableControls}
          />

          {/* Crisp, Sunlit Daylight Lighting */}
          <ambientLight intensity={0.7} color="#f0f9ff" />
          <directionalLight
            position={[16, 28, 14]}
            intensity={1.4}
            color="#fffbeb"
            castShadow={tier.enableHeavyEffects}
            shadow-mapSize-width={tier.shadowMapSize}
            shadow-mapSize-height={tier.shadowMapSize}
            shadow-camera-far={150}
            shadow-camera-left={-60}
            shadow-camera-right={60}
            shadow-camera-top={60}
            shadow-camera-bottom={-60}
          />
          <directionalLight position={[-14, 12, -12]} intensity={0.4} color="#bfdbfe" />
          <fog attach="fog" args={['#e0f2fe', 65, tier.isLowEnd ? 160 : 220]} />

          {children}
        </Canvas>
      </Suspense>
    </div>
  );
}
