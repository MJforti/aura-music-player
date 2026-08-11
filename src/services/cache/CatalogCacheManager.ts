/**
 * CatalogCacheManager
 * Scalable in-memory and persistent storage cache manager with TTL expiration.
 * Prevents redundant catalog provider API calls for track, artist, album metadata & search queries.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // TTL in milliseconds
}

export class CatalogCacheManager {
  private static instance: CatalogCacheManager;
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 1000 * 60 * 15; // 15 minutes default TTL

  private constructor() {
    this.cleanExpired();
  }

  public static getInstance(): CatalogCacheManager {
    if (!CatalogCacheManager.instance) {
      CatalogCacheManager.instance = new CatalogCacheManager();
    }
    return CatalogCacheManager.instance;
  }

  public get<T>(key: string): T | null {
    // 1. Check in-memory cache
    const entry = this.memoryCache.get(key);
    if (entry) {
      if (Date.now() - entry.timestamp < entry.ttl) {
        return entry.data as T;
      }
      this.memoryCache.delete(key);
    }

    // 2. Check localStorage fallback
    try {
      const raw = localStorage.getItem(`aura_cache_${key}`);
      if (raw) {
        const stored: CacheEntry<T> = JSON.parse(raw);
        if (Date.now() - stored.timestamp < stored.ttl) {
          this.memoryCache.set(key, stored); // Promote to memory cache
          return stored.data;
        }
        localStorage.removeItem(`aura_cache_${key}`);
      }
    } catch (e) {
      // LocalStorage access exception catch
    }

    return null;
  }

  public set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // Store in memory
    this.memoryCache.set(key, entry);

    // Store in localStorage for lightweight items
    try {
      if (key.length < 200) {
        localStorage.setItem(`aura_cache_${key}`, JSON.stringify(entry));
      }
    } catch (e) {
      // QuotaExceededError check
    }
  }

  public clear(): void {
    this.memoryCache.clear();
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('aura_cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {}
  }

  private cleanExpired(): void {
    setInterval(() => {
      const now = Date.now();
      this.memoryCache.forEach((entry, key) => {
        if (now - entry.timestamp >= entry.ttl) {
          this.memoryCache.delete(key);
        }
      });
    }, 1000 * 60 * 5); // Clean every 5 minutes
  }
}

export const catalogCache = CatalogCacheManager.getInstance();
