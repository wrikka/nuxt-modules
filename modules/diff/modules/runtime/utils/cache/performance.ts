import type { PerformanceMetrics, PerformanceState } from "../../types/cache";

export const createPerformanceMonitor = (): PerformanceState => ({
	metrics: new Map(),
});

export const startTimer = (
	monitor: PerformanceState,
	key: string,
): (() => void) => {
	const startTime = performance.now();

	return () => {
		const endTime = performance.now();
		const duration = endTime - startTime;

		const current = monitor.metrics.get(key) || {
			avgTime: 0,
			count: 0,
			totalTime: 0,
		};
		current.count++;
		current.totalTime += duration;
		current.avgTime = current.totalTime / current.count;

		monitor.metrics.set(key, current);
	};
};

export const getMetrics = (
	monitor: PerformanceState,
): Record<string, PerformanceMetrics> => {
	return Object.fromEntries(monitor.metrics);
};

export const clearMetrics = (monitor: PerformanceState): void => {
	monitor.metrics.clear();
};

export const performanceMonitor = createPerformanceMonitor();













