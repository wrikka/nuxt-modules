interface CacheConfig {
	ttl?: number;
	prefix?: string;
}

export class ContentCache {
	private cache: Map<string, { data: any; expires: number }> = new Map();
	private defaultTTL: number = 5 * 60 * 1000; // 5 minutes
	private prefix: string = "content";

	constructor(config?: CacheConfig) {
		if (config?.ttl) this.defaultTTL = config.ttl;
		if (config?.prefix) this.prefix = config.prefix;
	}

	private getCacheKey(key: string): string {
		return `${this.prefix}:${key}`;
	}

	private isExpired(expires: number): boolean {
		return Date.now() > expires;
	}

	set(key: string, data: any, ttl?: number): void {
		const cacheKey = this.getCacheKey(key);
		const expires = Date.now() + (ttl || this.defaultTTL);
		this.cache.set(cacheKey, { data, expires });
	}

	get<T = any>(key: string): T | null {
		const cacheKey = this.getCacheKey(key);
		const cached = this.cache.get(cacheKey);

		if (!cached) return null;

		if (this.isExpired(cached.expires)) {
			this.cache.delete(cacheKey);
			return null;
		}

		return cached.data as T;
	}

	delete(key: string): void {
		const cacheKey = this.getCacheKey(key);
		this.cache.delete(cacheKey);
	}

	clear(): void {
		this.cache.clear();
	}

	has(key: string): boolean {
		const cacheKey = this.getCacheKey(key);
		const cached = this.cache.get(cacheKey);
		if (!cached) return false;
		if (this.isExpired(cached.expires)) {
			this.cache.delete(cacheKey);
			return false;
		}
		return true;
	}

	get size(): number {
		return this.cache.size;
	}

	cleanExpired(): void {
		for (const [key, cached] of this.cache.entries()) {
			if (this.isExpired(cached.expires)) {
				this.cache.delete(key);
			}
		}
	}

	invalidatePattern(pattern: string): void {
		for (const [key] of this.cache.entries()) {
			if (key.includes(pattern)) {
				this.cache.delete(key);
			}
		}
	}
}

// Singleton instance
let cacheInstance: ContentCache | null = null;

export function useContentCache(config?: CacheConfig): ContentCache {
	if (!cacheInstance) {
		cacheInstance = new ContentCache(config);
	}
	return cacheInstance;
}

export function invalidateContentCache(pattern: string): void {
	const cache = useContentCache();
	cache.invalidatePattern(pattern);
}
