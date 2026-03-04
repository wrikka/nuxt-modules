export interface CacheOptions {
	maxSize?: number;
	ttl?: number; // Time to live in milliseconds
	enableMemoization?: boolean;
}

export interface CacheEntry<T> {
	value: T;
	timestamp: number;
	accessCount: number;
}

export interface CacheState<T> {
	entries: Map<string, CacheEntry<T>>;
	maxSize: number;
	ttl: number;
}

export interface PerformanceMetrics {
	count: number;
	totalTime: number;
	avgTime: number;
}

export interface PerformanceState {
	metrics: Map<string, PerformanceMetrics>;
}













