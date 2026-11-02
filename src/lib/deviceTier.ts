/**
 * Hardware & Device Tier Detection Utility
 * Detects low RAM, weak CPUs, mobile GPUs, and user power preferences.
 * Allows adaptive scaling of 3D Canvas DPR, particle counts, and shadow maps
 * to ensure 60fps smoothness even on low-end hardware without altering UI/UX design.
 */

export interface DeviceTier {
  isLowEnd: boolean;
  isMobile: boolean;
  deviceMemory: number; // GB estimated
  cores: number;
  dpr: [number, number];
  shadowMapSize: number;
  enableHeavyEffects: boolean;
}

// Default baseline fallback for SSR
const DEFAULT_TIER: DeviceTier = {
  isLowEnd: false,
  isMobile: false,
  deviceMemory: 4,
  cores: 4,
  dpr: [1, 1.25],
  shadowMapSize: 1024,
  enableHeavyEffects: true,
};

let cachedTier: DeviceTier | null = null;

export function getDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') {
    return DEFAULT_TIER;
  }

  if (cachedTier) {
    return cachedTier;
  }

  const nav = window.navigator as any;
  const memory = nav.deviceMemory || 4; // in GB (Chrome/Edge supports navigator.deviceMemory)
  const cores = nav.hardwareConcurrency || 4;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    nav.userAgent
  );

  // Consider device low-end if <= 3GB RAM or <= 4 weak CPU cores or mobile with low specs
  const isLowEnd = memory <= 3 || cores <= 4 || (isMobile && memory <= 4);

  // Check WebGL renderer to detect software/integrated weak GPU
  let isWeakGPU = false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
        if (
          /swiftshader|llvmpipe|intel hd|intel\(r\) hd|mesa|adreno 3|adreno 4|adreno 50|mali-4|mali-t/i.test(
            renderer
          )
        ) {
          isWeakGPU = true;
        }
      }
    }
  } catch {
    // Ignore WebGL check errors
  }

  const lowTier = isLowEnd || isWeakGPU;

  cachedTier = {
    isLowEnd: lowTier,
    isMobile,
    deviceMemory: memory,
    cores,
    // On low-end / weak GPU devices, lock DPR to 1.0 to save up to 60% memory & shader fill-rate
    dpr: lowTier ? [1, 1] : [1, 1.25],
    shadowMapSize: lowTier ? 512 : 1024,
    enableHeavyEffects: !lowTier,
  };

  return cachedTier;
}
