import type { TimeSeriesPoint } from './time-series-types';

/**
 * Detect anomalies in time series
 */
export function detectTimeSeriesAnomalies(
	points: TimeSeriesPoint[],
	threshold: number = 2,
): { anomalies: TimeSeriesPoint[]; normal: TimeSeriesPoint[] } {
	if (points.length < 3) {
		return { anomalies: [], normal: points };
	}

	const values = points.map((p) => p.value);
	const mean = values.reduce((a, b) => a + b, 0) / values.length;
	const stdDev = Math.sqrt(
		values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
			values.length,
	);

	const anomalies: TimeSeriesPoint[] = [];
	const normal: TimeSeriesPoint[] = [];

	points.forEach((point) => {
		const zScore = Math.abs((point.value - mean) / stdDev);
		if (zScore > threshold) {
			anomalies.push({
				...point,
				metadata: {
					...point.metadata,
					anomaly: true,
					zScore,
				},
			});
		} else {
			normal.push(point);
		}
	});

	return { anomalies, normal };
}
