import type { PerformanceState, PerformanceMetric, AlertLevel, PerformanceAlert } from './monitoring-core';
import { getAlertMessage, getRecommendation } from "../../utils/performance-utils";

export function checkAlerts(
	state: PerformanceState,
	alertThresholds: Record<PerformanceMetric, { warning: number; error: number; critical: number }>,
) {
	Object.entries(alertThresholds).forEach(([metric, thresholds]) => {
		const value = state.currentMetrics[metric as PerformanceMetric];
		if (value == null) return;

		let level: AlertLevel | null = null;
		let threshold = 0;

		if (value >= thresholds.critical) {
			level = "critical";
			threshold = thresholds.critical;
		} else if (value >= thresholds.error) {
			level = "error";
			threshold = thresholds.error;
		} else if (value >= thresholds.warning) {
			level = "warning";
			threshold = thresholds.warning;
		}

		if (level) {
			const alert: PerformanceAlert = {
				id: `alert_${metric}_${Date.now()}`,
				metric: metric as PerformanceMetric,
				level,
				message: getAlertMessage(
					metric as PerformanceMetric,
					level,
					value,
					threshold,
				),
				value,
				threshold,
				timestamp: new Date(),
				recommendation: getRecommendation(metric as PerformanceMetric, level),
			};

			state.alerts.push(alert);

			if (state.alerts.length > 50) {
				state.alerts.shift();
			}
		}
	});
}
