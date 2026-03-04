import type { DiffResult } from "../../types/diff";
import { createCache, getCacheEntry, setCacheEntry } from "./operations";
import type { CacheOptions } from "../../types/cache";

// Memoization decorator for diff functions
export function memoizeDiff(
	fn: (...args: unknown[]) => DiffResult,
	cacheOptions: CacheOptions = {},
): (...args: unknown[]) => DiffResult {
	const cache = createCache<DiffResult>(cacheOptions);
	const keyGenerator = (...args: unknown[]) => JSON.stringify(args);

	return (...args: unknown[]) => {
		const key = keyGenerator(...args);
		const cached = getCacheEntry(cache, key);

		if (cached !== undefined) {
			return cached;
		}

		const result = fn(...args);
		setCacheEntry(cache, key, result);
		return result;
	};
}

// General memoization function
export function memoize<T extends (...args: unknown[]) => unknown>(
	fn: T,
	cacheOptions: CacheOptions = {},
): T {
	const cache = createCache<ReturnType<T>>(cacheOptions);
	const keyGenerator = (...args: unknown[]) => JSON.stringify(args);

	return ((...args: Parameters<T>) => {
		const key = keyGenerator(...args);
		const cached = getCacheEntry(cache, key);

		if (cached !== undefined) {
			return cached;
		}

		const result = fn(...args);
		setCacheEntry(cache, key, result);
		return result;
	}) as T;
}

// WeakMap-based memoization for object references
export function memoizeWeak<T extends (...args: unknown[]) => unknown>(
	fn: T,
): T {
	const cache = new WeakMap();

	return ((...args: unknown[]) => {
		const firstArg = args[0];

		if (typeof firstArg === "object" && firstArg !== null) {
			let result = cache.get(firstArg);

			if (result === undefined) {
				result = fn(...args);
				cache.set(firstArg, result);
			}

			return result;
		}

		// Fallback to regular execution for non-object arguments
		return fn(...args);
	}) as T;
}














