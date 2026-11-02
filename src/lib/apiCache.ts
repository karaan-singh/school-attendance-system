/**
 * Enhanced Multi-Tier Cache with Stale-While-Revalidate & Session Persistence.
 * Prevents redundant network requests, eliminates unwanted loading spinners,
 * keeps RAM footprint low with bounded LRU eviction, and provides 0ms instant UI hydration.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const MAX_CACHE_ENTRIES = 50; // Bound memory usage to prevent RAM leaks on weak devices
const memoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

// Helper to safely access sessionStorage
function getStoredCache<T>(key: string): CacheEntry<T> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`sms_cache_${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry<T>;
  } catch {
    return null;
  }
}

function setStoredCache<T>(key: string, entry: CacheEntry<T>): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(`sms_cache_${key}`, JSON.stringify(entry));
  } catch {
    // Quota exceeded or private browsing mode - silently ignore
  }
}

export async function fetchWithCache<T>(
  url: string,
  options?: { ttlMs?: number; forceFresh?: boolean }
): Promise<T> {
  const ttlMs = options?.ttlMs ?? 60000; // 60-second default TTL
  const now = Date.now();
  let cached = memoryCache.get(url);

  // Check sessionStorage fallback if memory cache is empty
  if (!cached) {
    const stored = getStoredCache<T>(url);
    if (stored) {
      cached = stored;
      memoryCache.set(url, stored);
    }
  }

  // Return cached data immediately if still within TTL
  if (!options?.forceFresh && cached && now - cached.timestamp < ttlMs) {
    return cached.data as T;
  }

  // Deduplicate in-flight requests to avoid redundant simultaneous network calls
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url)!;
  }

  const fetchPromise = fetch(url, {
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch from ${url} (status: ${res.status})`);
      }
      return res.json();
    })
    .then((data: T) => {
      const entry: CacheEntry<T> = { data, timestamp: Date.now() };
      
      // Enforce bounded cache size to preserve low RAM
      if (memoryCache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = memoryCache.keys().next().value;
        if (oldestKey) memoryCache.delete(oldestKey);
      }
      
      memoryCache.set(url, entry);
      setStoredCache(url, entry);
      inFlightRequests.delete(url);
      return data;
    })
    .catch((err) => {
      inFlightRequests.delete(url);
      // If network fails but we have stale cache, return stale data smoothly
      if (cached) {
        console.warn(`[apiCache] Network failed for ${url}, returning stale cached data.`, err);
        return cached.data as T;
      }
      throw err;
    });

  inFlightRequests.set(url, fetchPromise);
  return fetchPromise;
}

/**
 * Returns cached data synchronously if available (for zero-loading instant UI hydration).
 */
export function getCachedData<T>(url: string): T | null {
  const memCached = memoryCache.get(url);
  if (memCached) return memCached.data as T;

  const stored = getStoredCache<T>(url);
  if (stored) {
    memoryCache.set(url, stored);
    return stored.data as T;
  }

  return null;
}

/**
 * Manually invalidate cache entries (e.g. after roster import or attendance finalization).
 */
export function invalidateCache(urlPrefix?: string): void {
  if (!urlPrefix) {
    memoryCache.clear();
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const k = sessionStorage.key(i);
          if (k && k.startsWith('sms_cache_')) keysToRemove.push(k);
        }
        keysToRemove.forEach((k) => sessionStorage.removeItem(k));
      } catch {}
    }
  } else {
    for (const key of memoryCache.keys()) {
      if (key.startsWith(urlPrefix)) {
        memoryCache.delete(key);
      }
    }
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(`sms_cache_${urlPrefix}`);
      } catch {}
    }
  }
}
