/**
 * Performance metric
 */
export type PerformanceMetric =
	| "render-time"
	| "memory-usage"
	| "frame-rate"
	| "data-processing-time"
	| "interaction-latency"
	| "animation-duration"
	| "network-request-time"
	| "cache-hit-rate";

/**
 * Alert level
 */
export type AlertLevel = "info" | "warning" | "error" | "critical";

/**
 * Performance alert
 */
export interface PerformanceAlert {
	id: string;
	metric: PerformanceMetric;
	level: AlertLevel;
	message: string;
	value: number;
	threshold: number;
	timestamp: Date;
	recommendation?: string;
}

/**
 * Performance snapshot
 */
export interface PerformanceSnapshot {
	timestamp: Date;
	metrics: Record<PerformanceMetric, number>;
	memoryUsage: number;
	frameRate: number;
	renderTime: number;
}

/**
 * Performance monitoring options
 */
export interface PerformanceOptions {
	enableRealTimeMonitoring?: boolean;
	alertThresholds?: Partial<
		Record<
			PerformanceMetric,
			{ warning: number; error: number; critical: number }
		>
	>;
	samplingRate?: number; // Hz
	maxHistorySize?: number;
	enableMemoryMonitoring?: boolean;
	enableFrameRateMonitoring?: boolean;
}
