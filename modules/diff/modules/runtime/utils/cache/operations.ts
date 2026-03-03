import type { CacheOptions, CacheState } from "../../types/cache";

// FP Cache operations
export const createCache = <T>(options: CacheOptions = {}): CacheState<T> => ({
	entries: new Map(),
	maxSize: options.maxSize || 1000,
	ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
});

export const getCacheEntry = <T>(
	cache: CacheState<T>,
	key: string,
): T | undefined => {
	const entry = cache.entries.get(key);

	if (!entry) {
		return undefined;
	}

	// Check TTL
	if (Date.now() - entry.timestamp > cache.ttl) {
		cache.entries.delete(key);
		return undefined;
	}

	// Update access count for LRU
	entry.accessCount++;
	return entry.value;
};

export const setCacheEntry = <T>(
	cache: CacheState<T>,
	key: string,
	value: T,
): void => {
	// Remove oldest entry if cache is full
	if (cache.entries.size >= cache.maxSize) {
		const oldestKey = findOldestEntry(cache);
		if (oldestKey) {
			cache.entries.delete(oldestKey);
		}
	}

	cache.entries.set(key, {
		accessCount: 1,
		timestamp: Date.now(),
		value,
	});
};

export const clearCache = <T>(cache: CacheState<T>): void => {
	cache.entries.clear();
};

export const getCacheSize = <T>(cache: CacheState<T>): number => {
	return cache.entries.size;
};

export const getCacheStats = <T>(cache: CacheState<T>) => {
	const entries = Array.from(cache.entries.entries()).map(([key, entry]) => ({
		accessCount: entry.accessCount,
		age: Date.now() - entry.timestamp,
		key,
	}));

	return {
		entries,
		maxSize: cache.maxSize,
		size: cache.entries.size,
	};
};

const findOldestEntry = <T>(cache: CacheState<T>): string | undefined => {
	let oldestKey: string | undefined;
	let oldestTime = Date.now();

	for (const [key, entry] of cache.entries.entries()) {
		if (entry.timestamp < oldestTime) {
			oldestTime = entry.timestamp;
			oldestKey = key;
		}
	}

	return oldestKey;
};













