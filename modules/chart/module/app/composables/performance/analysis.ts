import type { PerformanceState, PerformanceMetric } from './monitoring-core';

export function getPerformanceSummary(state: PerformanceState) {
	if (state.history.length === 0) return null;

	const latest = state.history[state.history.length - 1];
	const first = state.history[0];

	const timeSpan = latest.timestamp.getTime() - first.timestamp.getTime();

	const averages = state.history.reduce(
		(acc, snapshot) => {
			Object.entries(snapshot.metrics).forEach(([metric, value]) => {
				if (!acc[metric]) acc[metric] = [];
				acc[metric].push(value);
			});
			return acc;
		},
		{} as Record<string, number[]>,
	);

	const avgMetrics: Record<string, number> = {};
	Object.entries(averages).forEach(([metric, values]) => {
		avgMetrics[metric] = values.reduce((a, b) => a + b, 0) / values.length;
	});

	return {
		timeSpan,
		latestSnapshot: latest,
		averageMetrics: avgMetrics,
		alertCount: state.alerts.length,
		renderCount: state.renderCount,
		averageRenderTime:
			state.renderCount > 0 ? state.totalRenderTime / state.renderCount : 0,
	};
}

export function getPerformanceTrends(state: PerformanceState) {
	if (state.history.length < 2) return null;

	const trends: Record<
		PerformanceMetric,
		"improving" | "degrading" | "stable"
	> = {} as any;

	const recent = state.history.slice(-10);
	const older = state.history.slice(-20, -10);

	if (older.length === 0) return null;

	Object.keys(state.currentMetrics).forEach((metric: string) => {
		const recentAvg =
			recent.reduce(
				(sum, s) => sum + (s.metrics[metric as PerformanceMetric] || 0),
				0,
			) / recent.length;
		const olderAvg =
			older.reduce(
				(sum, s) => sum + (s.metrics[metric as PerformanceMetric] || 0),
				0,
			) / older.length;

		const change = (recentAvg - olderAvg) / olderAvg;

		if (Math.abs(change) < 0.05) {
			trends[metric as PerformanceMetric] = "stable";
		} else if (change < 0) {
			trends[metric as PerformanceMetric] = "improving";
		} else {
			trends[metric as PerformanceMetric] = "degrading";
		}
	});

	return trends;
}

export function exportPerformanceData(state: PerformanceState) {
	return {
		history: state.history,
		alerts: state.alerts,
		summary: getPerformanceSummary(state),
		trends: getPerformanceTrends(state),
	};
}

export function clearPerformanceData(state: PerformanceState) {
	state.history = [];
	state.alerts = [];
	state.totalRenderTime = 0;
	state.renderCount = 0;
}

export function getOptimizationSuggestions(state: PerformanceState) {
	const suggestions: string[] = [];
	const summary = getPerformanceSummary(state);

	if (!summary) return suggestions;

	if (summary.averageRenderTime > 16.67) {
		suggestions.push(
			"Consider implementing virtual scrolling for large datasets",
		);
		suggestions.push(
			"Optimize chart rendering by reducing visual complexity",
		);
	}

	if (state.memoryUsage > 50 * 1024 * 1024) {
		suggestions.push("Implement data pagination to reduce memory usage");
		suggestions.push("Clear unused caches and optimize data structures");
	}

	if (state.averageFrameRate < 50) {
		suggestions.push("Reduce animation complexity and frequency");
		suggestions.push(
			"Implement frame rate limiting for smoother performance",
		);
	}

	const criticalAlerts = state.alerts.filter((a) => a.level === "critical");
	if (criticalAlerts.length > 0) {
		suggestions.push("Address critical performance alerts immediately");
		suggestions.push("Consider reducing real-time data updates");
	}

	return suggestions;
}
