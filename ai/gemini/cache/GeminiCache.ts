// ============================================================================
// Sentinel AI — Gemini Caching Layer
// ============================================================================

import { AIStructuredIncidentResponse } from '../types';

export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  ttlMs: number;
}

export class GeminiCache {
  private static instance: GeminiCache;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private hits: number = 0;
  private misses: number = 0;
  private defaultTtlMs: number = 5 * 60 * 1000; // 5 minutes default

  private constructor() {}

  public static getInstance(): GeminiCache {
    if (!GeminiCache.instance) {
      GeminiCache.instance = new GeminiCache();
    }
    return GeminiCache.instance;
  }

  public generateKey(prompt: string, templateType: string, language: string): string {
    const raw = `${templateType}:${language}:${prompt.trim().toLowerCase()}`;
    // Simple hash for caching
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `gemini_cache_${Math.abs(hash)}`;
  }

  public get<T = AIStructuredIncidentResponse | string>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttlMs?: number): void {
    this.cache.set(key, {
      key,
      data,
      timestamp: Date.now(),
      ttlMs: ttlMs || this.defaultTtlMs,
    });
  }

  public invalidate(key: string): boolean {
    return this.cache.delete(key);
  }

  public clearAll(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  public getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      totalQueries: total,
      hitRatePercentage: total > 0 ? ((this.hits / total) * 100).toFixed(1) : '0.0',
      cachedItemsCount: this.cache.size,
    };
  }
}
