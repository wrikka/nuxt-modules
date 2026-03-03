import type { PerformanceState } from './monitoring-core';

export function recordDataProcessingTime(state: PerformanceState, startTime: number) {
	const processingTime = performance.now() - startTime;
	state.currentMetrics["data-processing-time"] = processingTime;
}

export function recordInteractionLatency(state: PerformanceState, startTime: number) {
	const latency = performance.now() - startTime;
	state.currentMetrics["interaction-latency"] = latency;
}

export function recordAnimationDuration(state: PerformanceState, duration: number) {
	state.currentMetrics["animation-duration"] = duration;
}

export function recordNetworkRequestTime(state: PerformanceState, duration: number) {
	state.currentMetrics["network-request-time"] = duration;
}

export function recordCacheHitRate(state: PerformanceState, hitRate: number) {
	state.currentMetrics["cache-hit-rate"] = hitRate;
}
