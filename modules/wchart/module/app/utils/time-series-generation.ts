import type { TimeSeriesOptions, TimeSeriesPoint } from './time-series-types';
import { getGranularityInterval } from './time-series-helpers';

/**
 * Generate time series data with gaps and irregularities
 */
export function generateTimeSeriesData(
	startDate: Date,
	endDate: Date,
	options: TimeSeriesOptions = {},
	randomFn: () => number = Math.random,
): TimeSeriesPoint[] {
	const {
		granularity = "day",
		fillGaps = false,
		interpolateMethod = "linear",
	} = options;

	const points: TimeSeriesPoint[] = [];
	const current = new Date(startDate);

	// Calculate interval
	const intervalMs = getGranularityInterval(granularity);

	while (current <= endDate) {
		// Skip some points randomly to create gaps
		if (!fillGaps && randomFn() < 0.1) {
			current.setTime(current.getTime() + intervalMs);
			continue;
		}

		const baseValue =
			100 + Math.sin(current.getTime() / (1000 * 60 * 60 * 24)) * 20;
		const noise = (randomFn() - 0.5) * 10;
		const value = baseValue + noise;

		points.push({
			x: new Date(current),
			y: Math.max(0, value),
			timestamp: new Date(current),
			value: Math.max(0, value),
			metadata: {
				quality: randomFn() > 0.05 ? 1 : 0.8, // 95% high quality
				source: "generated",
			},
		});

		current.setTime(current.getTime() + intervalMs);
	}

	return points;
}
