import type {
	TimeSeriesPoint,
	TimeSeriesOptions,
	TimeRange,
} from './time-series-types';
import { interpolate, getGranularityInterval } from './time-series-helpers';

/**
 * Fill gaps in time series data
 */
export function fillTimeSeriesGaps(
	points: TimeSeriesPoint[],
	method: "linear" | "step" | "cubic" = "linear",
): TimeSeriesPoint[] {
	if (points.length < 2) return points;

	const filled: TimeSeriesPoint[] = [];
	const sorted = [...points].sort(
		(a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
	);

	for (let i = 0; i < sorted.length - 1; i++) {
		const current = sorted[i];
		const next = sorted[i + 1];
		filled.push(current);

		const timeDiff = next.timestamp.getTime() - current.timestamp.getTime();
		const maxGap = getGranularityInterval("hour") * 2; // Allow 2-hour gaps max

		if (timeDiff > maxGap) {
			// Fill the gap
			const steps = Math.floor(timeDiff / (1000 * 60 * 60)); // Hourly steps
			for (let j = 1; j < steps; j++) {
				const ratio = j / steps;
				const interpolatedValue = interpolate(
					current.value,
					next.value,
					ratio,
					method,
				);
				const interpolatedTime = new Date(
					current.timestamp.getTime() + timeDiff * ratio,
				);

				filled.push({
					x: interpolatedTime,
					y: interpolatedValue,
					timestamp: interpolatedTime,
					value: interpolatedValue,
					metadata: {
						quality: 0.5, // Lower quality for interpolated points
						source: "interpolated",
					},
				});
			}
		}
	}

	filled.push(sorted[sorted.length - 1]);
	return filled;
}

/**
 * Apply rolling window calculations
 */
export function applyRollingWindow(
	points: TimeSeriesPoint[],
	windowSize: number,
	operation: "mean" | "median" | "sum" | "min" | "max" = "mean",
): TimeSeriesPoint[] {
	return points.map((point, index) => {
		const start = Math.max(0, index - windowSize + 1);
		const window = points.slice(start, index + 1).map((p) => p.value);

		let calculatedValue: number;
		switch (operation) {
			case "mean":
				calculatedValue = window.reduce((a, b) => a + b, 0) / window.length;
				break;
			case "median":
				const sorted = [...window].sort((a, b) => a - b);
				calculatedValue = sorted[Math.floor(sorted.length / 2)];
				break;
			case "sum":
				calculatedValue = window.reduce((a, b) => a + b, 0);
				break;
			case "min":
				calculatedValue = Math.min(...window);
				break;
			case "max":
				calculatedValue = Math.max(...window);
				break;
			default:
				calculatedValue = point.value;
		}

		return {
			...point,
			y: calculatedValue,
			value: calculatedValue,
			metadata: {
				...point.metadata,
				rollingWindow: {
					size: windowSize,
					operation,
				},
			},
		};
	});
}
