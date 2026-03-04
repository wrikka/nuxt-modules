import { ref, reactive, computed, onMounted, onUnmounted, readonly } from "vue";
import type {
	PerformanceMetric,
	AlertLevel,
	PerformanceAlert,
	PerformanceSnapshot,
	PerformanceOptions,
} from "../types/performance";
import { getAlertMessage, getRecommendation } from "../utils/performance-utils";

import type { PerformanceState } from './performance/monitoring-core';
import { createPerformanceState, recordRenderStart as recordRenderStartCore, recordRenderEnd as recordRenderEndCore, takeSnapshot } from './performance/monitoring-core';
import { startFrameRateMonitoring } from './performance/frame-rate';
import { recordDataProcessingTime as recordDataProcessingTimeCore, recordInteractionLatency as recordInteractionLatencyCore, recordAnimationDuration as recordAnimationDurationCore, recordNetworkRequestTime as recordNetworkRequestTimeCore, recordCacheHitRate as recordCacheHitRateCore } from './performance/metrics';
import { checkAlerts } from './performance/alerts';
import { getPerformanceSummary as getPerformanceSummaryCore, getPerformanceTrends as getPerformanceTrendsCore, exportPerformanceData as exportPerformanceDataCore, clearPerformanceData as clearPerformanceDataCore, getOptimizationSuggestions as getOptimizationSuggestionsCore } from './performance/analysis';

/**
 * Composable for chart performance monitoring
 */
export function useChartPerformanceMonitoring(
	elementRef?: any,
	options: PerformanceOptions = {},
) {
	const {
		enableRealTimeMonitoring = true,
		samplingRate = 10, // 10 Hz
		maxHistorySize = 100,
		enableMemoryMonitoring = true,
		enableFrameRateMonitoring = true,
		alertThresholds = {
			"render-time": { warning: 16.67, error: 33.33, critical: 50 }, // 60fps, 30fps, 20fps
			"memory-usage": {
				warning: 50 * 1024 * 1024,
				error: 100 * 1024 * 1024,
				critical: 200 * 1024 * 1024,
			}, // MB
			"frame-rate": { warning: 50, error: 30, critical: 20 },
			"data-processing-time": { warning: 100, error: 500, critical: 1000 }, // ms
			"interaction-latency": { warning: 100, error: 300, critical: 500 }, // ms
			"animation-duration": { warning: 1000, error: 2000, critical: 5000 }, // ms
			"network-request-time": { warning: 1000, error: 3000, critical: 10000 }, // ms
			"cache-hit-rate": { warning: 0.7, error: 0.5, critical: 0.3 }, // percentage
		},
	} = options;

	const state = createPerformanceState();

	let monitoringInterval: number | null = null;
	let frameCount = ref(0);
	let lastFrameTime = ref(performance.now());
	let renderStartTime = ref(0);

	/**
	 * Start performance monitoring
	 */
	const startMonitoring = () => {
		if (state.isMonitoring) return;

		state.isMonitoring = true;
		frameCount.value = 0;
		lastFrameTime.value = performance.now();

		monitoringInterval = window.setInterval(() => {
			takeSnapshot(state, enableMemoryMonitoring, maxHistorySize);
			checkAlerts(state, alertThresholds);
		}, 1000 / samplingRate);

		if (enableFrameRateMonitoring) {
			startFrameRateMonitoring(state, frameCount, lastFrameTime);
		}
	};

	/**
	 * Stop performance monitoring
	 */
	const stopMonitoring = () => {
		if (!state.isMonitoring) return;

		state.isMonitoring = false;

		if (monitoringInterval) {
			clearInterval(monitoringInterval);
			monitoringInterval = null;
		}
	};

	/**
	 * Record render start
	 */
	const recordRenderStart = () => recordRenderStartCore(renderStartTime);

	/**
	 * Record render end
	 */
	const recordRenderEnd = () => recordRenderEndCore(state, renderStartTime);

	/**
	 * Record data processing time
	 */
	const recordDataProcessingTime = (startTime: number) => recordDataProcessingTimeCore(state, startTime);

	/**
	 * Record interaction latency
	 */
	const recordInteractionLatency = (startTime: number) => recordInteractionLatencyCore(state, startTime);

	/**
	 * Record animation duration
	 */
	const recordAnimationDuration = (duration: number) => recordAnimationDurationCore(state, duration);

	/**
	 * Record network request time
	 */
	const recordNetworkRequestTime = (duration: number) => recordNetworkRequestTimeCore(state, duration);

	/**
	 * Record cache hit rate
	 */
	const recordCacheHitRate = (hitRate: number) => recordCacheHitRateCore(state, hitRate);


	/**
	 * Get performance summary
	 */
	const getPerformanceSummary = () => getPerformanceSummaryCore(state);

	/**
	 * Get performance trends
	 */
	const getPerformanceTrends = () => getPerformanceTrendsCore(state);

	/**
	 * Export performance data
	 */
	const exportPerformanceData = () => exportPerformanceDataCore(state);

	/**
	 * Clear performance data
	 */
	const clearPerformanceData = () => clearPerformanceDataCore(state);

	/**
	 * Get optimization suggestions
	 */
	const getOptimizationSuggestions = () => getOptimizationSuggestionsCore(state);

	// Auto-start monitoring if enabled
	onMounted(() => {
		if (enableRealTimeMonitoring) {
			startMonitoring();
		}
	});

	onUnmounted(() => {
		stopMonitoring();
	});

	return {
		// State
		isMonitoring: state.isMonitoring,
		currentMetrics: readonly(state.currentMetrics),
		history: readonly(state.history),
		alerts: readonly(state.alerts),
		memoryUsage: state.memoryUsage,
		averageFrameRate: state.averageFrameRate,

		// Methods
		startMonitoring,
		stopMonitoring,
		recordRenderStart,
		recordRenderEnd,
		recordDataProcessingTime,
		recordInteractionLatency,
		recordAnimationDuration,
		recordNetworkRequestTime,
		recordCacheHitRate,
		getPerformanceSummary,
		getPerformanceTrends,
		exportPerformanceData,
		clearPerformanceData,
		getOptimizationSuggestions,
	};
}
