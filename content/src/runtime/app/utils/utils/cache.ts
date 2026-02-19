import type { ContentItem } from "../../../shared/types";

export interface CacheEntry {
	data: ContentItem[];
	etag: string;
	lastModified: string;
	expiresAt: number;
}

export interface CacheConfig {
	maxAge: number; // in milliseconds
	staleWhileRevalidate: number;
	etag: boolean;
}

export class ContentCacheStrategy {
	private cache: Map<string, CacheEntry> = new Map();
	private config: CacheConfig = {
		maxAge: 5 * 60 * 1000, // 5 minutes
		staleWhileRevalidate: 60 * 1000, // 1 minute
		etag: true,
	};

	setConfig(config: Partial<CacheConfig>) {
		this.config = { ...this.config, ...config };
	}

	generateETag(items: ContentItem[]): string {
		const content = JSON.stringify(items);
		const hash = this.simpleHash(content);
		return `"${hash}"`;
	}

	private simpleHash(str: string): string {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return Math.abs(hash).toString(16);
	}

	set(key: string, data: ContentItem[], lastModified: string = new Date().toISOString()) {
		const entry: CacheEntry = {
			data,
			etag: this.generateETag(data),
			lastModified,
			expiresAt: Date.now() + this.config.maxAge,
		};

		this.cache.set(key, entry);
	}

	get(key: string, ifNoneMatch?: string): ContentItem[] | null {
		const entry = this.cache.get(key);

		if (!entry) {
			return null;
		}

		// Check if cache is expired
		if (Date.now() > entry.expiresAt) {
			return null;
		}

		// Check ETag if provided
		if (ifNoneMatch && entry.etag === ifNoneMatch) {
			return null;
		}

		return entry.data;
	}

	getCacheHeaders(key: string): {
		"ETag"?: string;
		"Last-Modified"?: string;
		"Cache-Control"?: string;
		"Age"?: string;
	} {
		const entry = this.cache.get(key);

		if (!entry) {
			return {};
		}

		const age = Math.max(0, Date.now() - (entry.expiresAt - this.config.maxAge));
		const isStale = Date.now() > entry.expiresAt;

		return {
			"ETag": entry.etag,
			"Last-Modified": entry.lastModified,
			"Cache-Control": isStale
				? `max-age=${this.config.staleWhileRevalidate}, stale-while-revalidate=${this.config.staleWhileRevalidate}`
				: `max-age=${this.config.maxAge}`,
			"Age": Math.floor(age / 1000).toString(),
		};
	}

	invalidate(key: string) {
		this.cache.delete(key);
	}

	invalidateAll() {
		this.cache.clear();
	}

	getStats() {
		return {
			size: this.cache.size,
			keys: Array.from(this.cache.keys()),
		};
	}
}

let cacheInstance: ContentCacheStrategy | null = null;

export function getCacheStrategy(): ContentCacheStrategy {
	if (!cacheInstance) {
		cacheInstance = new ContentCacheStrategy();
	}
	return cacheInstance;
}
