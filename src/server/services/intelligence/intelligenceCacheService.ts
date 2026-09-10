interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class IntelligenceCacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs = 300000): void { // default 5 minutes
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  invalidate(prefix?: string): void {
    if (!prefix) {
      this.cache.clear();
      return;
    }
    for (const k of this.cache.keys()) {
      if (k.startsWith(prefix)) {
        this.cache.delete(k);
      }
    }
  }
}

export const intelligenceCacheService = new IntelligenceCacheService();
