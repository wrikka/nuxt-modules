import type { DiffOptions, DiffResult } from "../../types/diff";
import { diff } from "../diff";
import {
	clearCache,
	createCache,
	getCacheEntry,
	getCacheStats,
	setCacheEntry,
} from "./operations";

// Global cache instance
const globalCache = createCache<DiffResult>();

export function cachedDiff<T>(
	dataA: T,
	dataB: T,
	options: DiffOptions = {},
): DiffResult {
	const key = generateCacheKey(dataA, dataB, options);

	const cached = getCacheEntry(globalCache, key);
	if (cached !== undefined) {
		return cached;
	}

	const result = diff(dataA, dataB, options);
	setCacheEntry(globalCache, key, result);

	return result;
}

export function clearGlobalCache(): void {
	clearCache(globalCache);
}

export function getGlobalCacheStats() {
	return getCacheStats(globalCache);
}

function generateCacheKey<T>(dataA: T, dataB: T, options: DiffOptions): string {
	const dataHash = `${hashObject(dataA)}|${hashObject(dataB)}`;
	const optionsHash = hashObject(options);
	return `${dataHash}:${optionsHash}`;
}

function hashObject(obj: unknown): string {
	if (obj === null || obj === undefined) {
		return "null";
	}

	if (typeof obj === "string") {
		return obj;
	}

	if (typeof obj === "number" || typeof obj === "boolean") {
		return String(obj);
	}

	if (typeof obj === "object") {
		if (Array.isArray(obj)) {
			return `[${obj.map(hashObject).join(",")}]`;
		}

		const record = obj as Record<string, unknown>;
		const keys = Object.keys(record).sort();
		return (
			"{" +
			keys.map((key) => `"${key}":${hashObject(record[key])}`).join(",") +
			"}"
		);
	}

	return String(obj);
}














