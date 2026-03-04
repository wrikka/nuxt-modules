import type { TimeSeriesPoint, TimeRange } from './time-series-types';
import type { ChartData } from '@/module/app/types/chart-basic';
import { getGranularityKey, parseGranularityKey } from './time-series-helpers';

/**
 * Filter time series by date range
 */
export function filterTimeSeriesByRange(
	points: TimeSeriesPoint[],
	range: TimeRange,
): TimeSeriesPoint[] {
	return points.filter(
		(point) => point.timestamp >= range.start && point.timestamp <= range.end,
	);
}

/**
 * Group time series by granularity
 */
export function groupTimeSeriesByGranularity(
	points: TimeSeriesPoint[],
	granularity: "hour" | "day" | "week" | "month" | "year",
	aggregation: "mean" | "sum" | "min" | "max" | "first" | "last" = "mean",
): TimeSeriesPoint[] {
	const groups = new Map<string, TimeSeriesPoint[]>();

	points.forEach((point) => {
		const key = getGranularityKey(point.timestamp, granularity);
		if (!groups.has(key)) {
			groups.set(key, []);
		}
		groups.get(key)!.push(point);
	});

	const result: TimeSeriesPoint[] = [];

	groups.forEach((groupPoints, key) => {
		const values = groupPoints.map((p) => p.value);
		let aggregatedValue: number;

		switch (aggregation) {
			case "mean":
				aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length;
				break;
			case "sum":
				aggregatedValue = values.reduce((a, b) => a + b, 0);
				break;
			case "min":
				aggregatedValue = Math.min(...values);
				break;
			case "max":
				aggregatedValue = Math.max(...values);
				break;
			case "first":
				aggregatedValue = values[0];
				break;
			case "last":
				aggregatedValue = values[values.length - 1];
				break;
			default:
				aggregatedValue = values[0];
		}

		const representativePoint = groupPoints[0];
		result.push({
			...representativePoint,
			x: parseGranularityKey(key, granularity),
			y: aggregatedValue,
			timestamp: parseGranularityKey(key, granularity),
			value: aggregatedValue,
			metadata: {
				...representativePoint.metadata,
				grouped: true,
				groupSize: groupPoints.length,
				aggregation,
			},
		});
	});

	return result.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

/**
 * Convert time series to chart data
 */
export function timeSeriesToChartData(
	points: TimeSeriesPoint[],
	options: { seriesName?: string } = {},
): ChartData {
	const { seriesName = "Time Series" } = options;

	return {
		series: [
			{
				name: seriesName,
				data: points.map((point) => ({
					x: point.timestamp,
					y: point.value,
					label: point.metadata?.source,
					color:
						point.metadata?.quality === 1
							? undefined
							: point.metadata?.quality === 0.5
								? "#ffa500"
								: "#ff6b6b",
				})),
			},
		],
	};
}
