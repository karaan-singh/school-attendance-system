'use client';

import React, { useEffect, useState, useRef } from 'react';
import { TempleNightScene } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';
import CanvasContainer from './CanvasContainer';
import ExplorerModel from './ExplorerModel';
import { FastForward, Compass, Sparkles, Trees, Eye, Moon, Flame } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

export function Scene() {
  return (
    <div className="shader-frame">
      <TempleNightScene variant="temple-night" />
    </div>
  );
}

interface TempleNightJourneySceneProps {
  onComplete: () => void;
  speed?: number;
}

export default function TempleNightJourneyScene({
  onComplete,
  speed = 1,
}: TempleNightJourneySceneProps) {
  const { selectedGuide } = useGameStore();
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState<'temple' | 'split'>('temple');
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const totalDuration = 10000 / (speed || 1); // ~10 seconds journey
    const start = performance.now();

    const tick = (now: number) => {
      if (isPaused) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = now - start;
      const p = Math.min(elapsed / totalDuration, 1);
      setProgress(p);

      if (p < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        // Auto-complete journey into the forest
        onComplete();
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [speed, isPaused, onComplete]);

  // Position of woodcutter across the bottom of the screen (from left to right)
  const walkerXPercent = Math.min(Math.max(progress * 100, 4), 92);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#060a0f] select-none">
      {/* ThreeUI Exact Authored Temple Night Scene */}
      <div className="absolute inset-0 h-full w-full">
        <Scene />
      </div>

      {/* Atmospheric Vignette & Temple Night Title Watermark */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60" />

      {/* 3D Silas the Woodcutter Walking Expedition Foreground Overlay */}
      <div
        className="pointer-events-none absolute bottom-12 z-20 transition-all duration-300 ease-linear flex flex-col items-center"
        style={{
          left: `${walkerXPercent}%`,
          transform: 'translateX(-50%)',
        }}
      >
        {/* Guide Floating Speech / Status Pill */}
        <div className="mb-2 flex items-center gap-2 rounded-full border border-amber-400/40 bg-black/75 px-3 py-1 text-[11px] font-bold text-amber-200 shadow-xl backdrop-blur-md animate-bounce">
          <span className="text-xs">🪓</span>
          <span>
            {progress < 0.35
              ? 'Silas passing the Kyoto Torii gates...'
              : progress < 0.75
              ? 'Rain washes the stone lanterns...'
              : 'Approaching the Whispering Grove!'}
          </span>
          <span className="font-mono text-[10px] text-amber-400">
            {Math.round(progress * 100)}%
          </span>
        </div>

        {/* 3D Animated Woodcutter Walker Canvas */}
        <div className="h-36 w-36 pointer-events-auto">
          <CanvasContainer cameraPosition={[0, 1.2, 3.8]} enableControls={false}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[2, 4, 3]} intensity={1.8} color="#fed7aa" />
            <pointLight position={[0, 1.5, 0.5]} intensity={1.5} color="#f59e0b" distance={4} />
            <group rotation={[0, Math.PI / 2 + 0.25, 0]} position={[0, -0.65, 0]}>
              <ExplorerModel isWalking={true} scale={1.35} guide="WOODCUTTER" />
            </group>
          </CanvasContainer>
        </div>
      </div>

      {/* Bottom Expedition Journey HUD */}
      <div className="pointer-events-none absolute bottom-4 inset-x-0 z-30 flex items-center justify-between px-6">
        {/* Lore / Status Badge */}
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-black/70 px-4 py-2.5 shadow-2xl backdrop-blur-md">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <Moon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Chapter II • Night Expedition
              </span>
              <span className="rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-mono text-amber-300">
                ThreeUI Temple Night
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Silas guides the journey under the blood moon through Kyoto temple cedar woods
            </p>
          </div>
        </div>

        {/* Action Buttons: Pause/Explore, Skip Journey */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md hover:bg-white/20 active:scale-95 transition-all"
            title="Pause to explore interactive rain, mist, and wisps"
          >
            <Eye className="h-3.5 w-3.5 text-amber-400" />
            <span>{isPaused ? 'Resume Journey' : 'Pause & Explore'}</span>
          </button>

          <button
            onClick={onComplete}
            className="flex items-center gap-1.5 rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-2 text-xs font-bold text-white shadow-xl hover:from-amber-500 hover:to-amber-400 active:scale-95 transition-all"
          >
            <FastForward className="h-3.5 w-3.5" />
            <span>Enter Forest Grove</span>
          </button>
        </div>
      </div>

      {/* Journey Progress Bar */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-1.5 bg-black/40">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-sky-400 transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
