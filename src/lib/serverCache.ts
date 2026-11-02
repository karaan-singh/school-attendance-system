/**
 * Server-side In-Memory Cache for fast DB query reuse.
 * Reduces redundant multi-table joins to MySQL / SQLite,
 * ensuring repeated API requests resolve in <1ms without round-trip DB delays.
 */

let cachedClassesData: any = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 10000; // 10-second TTL

export function getCachedClasses<T = any>(): T | null {
  const now = Date.now();
  if (cachedClassesData && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedClassesData as T;
  }
  return null;
}

export function setCachedClasses(data: any): void {
  cachedClassesData = data;
  lastCacheTime = Date.now();
}

export function invalidateClassesCache(): void {
  cachedClassesData = null;
  lastCacheTime = 0;
}

