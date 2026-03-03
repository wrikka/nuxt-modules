import type { PerformanceMetric, AlertLevel } from "../types/performance";

/**
 * Get alert message for performance metric
 */
export const getAlertMessage = (
	metric: PerformanceMetric,
	level: AlertLevel,
	value: number,
	threshold: number,
): string => {
	const metricNames: Record<PerformanceMetric, string> = {
		"render-time": "Render time",
		"memory-usage": "Memory usage",
		"frame-rate": "Frame rate",
		"data-processing-time": "Data processing time",
		"interaction-latency": "Interaction latency",
		"animation-duration": "Animation duration",
		"network-request-time": "Network request time",
		"cache-hit-rate": "Cache hit rate",
	};

	const levelMessages: Record<AlertLevel, string> = {
		info: "is within normal range",
		warning: "is approaching threshold",
		error: "has exceeded acceptable limits",
		critical: "is critically high",
	};

	const units: Record<PerformanceMetric, string> = {
		"render-time": "ms",
		"memory-usage": "MB",
		"frame-rate": "fps",
		"data-processing-time": "ms",
		"interaction-latency": "ms",
		"animation-duration": "ms",
		"network-request-time": "ms",
		"cache-hit-rate": "%",
	};

	const valueStr =
		metric === "cache-hit-rate" ? (value * 100).toFixed(1) : value.toFixed(2);
	const thresholdStr =
		metric === "cache-hit-rate"
			? (threshold * 100).toFixed(1)
			: threshold.toString();

	return `${metricNames[metric]} (${valueStr}${units[metric]}) ${levelMessages[level]} (${thresholdStr}${units[metric]})`;
};

/**
 * Get recommendation for performance alert
 */
export const getRecommendation = (
	metric: PerformanceMetric,
	level: AlertLevel,
): string => {
	const recommendations: Record<
		PerformanceMetric,
		Record<AlertLevel, string>
	> = {
		"render-time": {
			info: "Render time indicates how long it takes to draw the chart",
			warning: "Consider optimizing chart rendering or reducing data points",
			error: "Implement virtual scrolling or data sampling",
			critical: "Reduce chart complexity or switch to simpler visualization",
		},
		"memory-usage": {
			info: "Memory usage tracks how much memory the chart consumes",
			warning: "Monitor memory usage and consider data cleanup",
			error: "Implement data pagination or reduce cached data",
			critical: "Clear caches and reduce data processing",
		},
		"frame-rate": {
			info: "Frame rate measures how many frames per second the chart renders",
			warning: "Optimize animations and reduce visual complexity",
			error: "Disable heavy animations and reduce update frequency",
			critical: "Simplify chart or reduce real-time updates",
		},
		"data-processing-time": {
			info: "Data processing time is the time spent transforming data for display",
			warning: "Optimize data transformation logic",
			error: "Implement data caching or preprocessing",
			critical: "Reduce data processing or use sampling",
		},
		"interaction-latency": {
			info: "Interaction latency measures response time to user interactions",
			warning: "Optimize event handlers and reduce DOM manipulation",
			error: "Debounce interactions and optimize rendering",
			critical: "Simplify interactions or reduce data updates",
		},
		"animation-duration": {
			info: "Animation duration tracks how long animations take to complete",
			warning: "Optimize animation easing and reduce keyframes",
			error: "Use hardware acceleration and reduce animation complexity",
			critical: "Disable complex animations or use simpler transitions",
		},
		"network-request-time": {
			info: "Network request time measures how long network calls take",
			warning: "Optimize API calls and implement caching",
			error: "Use data compression and reduce request frequency",
			critical: "Implement offline mode or reduce data requirements",
		},
		"cache-hit-rate": {
			info: "Cache hit rate shows the percentage of cache requests that are successful",
			warning: "Review cache invalidation strategy",
			error: "Optimize cache keys and increase cache size",
			critical: "Implement better caching strategy or reduce cache dependency",
		},
	};

	return recommendations[metric]?.[level] || "Review and optimize performance";
};
