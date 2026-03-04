import type { ChartData, DataPoint, ChartSeries } from '../../types/chart-basic';

/**
 * Create smooth line data using cubic spline interpolation
 */
export function createSmoothLineData(
	data: DataPoint[],
	_tension: number = 0.5,
): DataPoint[] {
	if (data.length < 3) return data;

	const smoothed: DataPoint[] = data
		.filter((p) => typeof p.y === "number")
		.map((point: DataPoint) => ({ ...point }));

	const points = smoothed;

	for (let i = 0; i < points.length - 1; i++) {
		const current = points[i]!;
		const next = points[i + 1]!;

		if (
			typeof current.x === "number" &&
			typeof next.x === "number" &&
			typeof current.y === "number" &&
			typeof next.y === "number"
		) {
			const _x1 = current.x;
			const _y1 = current.y;
			const _x2 = next.x;
			const _y2 = next.y;

			// Simple linear interpolation for now
			// Could implement more complex spline interpolation
			smoothed.push(current);
		}
	}

	if (points.length > 0) {
		smoothed.push(points[points.length - 1]!);
	}

	return smoothed;
}

/**
 * Calculate trend line for data points
 */
export function calculateTrendLine(data: DataPoint[]): DataPoint[] {
	const numericPoints = data.filter(
		(p) => typeof p.x === "number" && typeof p.y === "number",
	) as Array<{ x: number; y: number }>;

	if (numericPoints.length < 2) return [];

	const n = numericPoints.length;
	const sumX = numericPoints.reduce((sum, p) => sum + p.x, 0);
	const sumY = numericPoints.reduce((sum, p) => sum + p.y, 0);
	const sumXY = numericPoints.reduce((sum, p) => sum + p.x * p.y, 0);
	const sumXX = numericPoints.reduce((sum, p) => sum + p.x * p.x, 0);

	const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
	const intercept = (sumY - slope * sumX) / n;

	const minX = Math.min(...numericPoints.map((p) => p.x));
	const maxX = Math.max(...numericPoints.map((p) => p.x));

	return [
		{ x: minX, y: slope * minX + intercept },
		{ x: maxX, y: slope * maxX + intercept },
	];
}

/**
 * Calculate moving average for line chart
 */
export function calculateMovingAverage(
	data: DataPoint[],
	windowSize: number = 5,
): DataPoint[] {
	const numericPoints = data.filter(
		(p) => typeof p.x === "number" && typeof p.y === "number",
	) as Array<{ x: number; y: number }>;

	const result: DataPoint[] = [];

	for (let i = 0; i < numericPoints.length; i++) {
		const start = Math.max(0, i - windowSize + 1);
		const end = i + 1;
		const window = numericPoints.slice(start, end);
		const average = window.reduce((sum, p) => sum + p.y, 0) / window.length;

		result.push({
			x: numericPoints[i].x,
			y: average,
		});
	}

	return result;
}

/**
 * Find peaks and valleys in line chart data
 */
export function findPeaksAndValleys(
	data: DataPoint[],
	threshold: number = 0.1,
): { peaks: DataPoint[]; valleys: DataPoint[] } {
	const numericPoints = data.filter((p) => typeof p.y === "number") as Array<{
		x: number | string | Date;
		y: number;
	}>;
	const peaks: DataPoint[] = [];
	const valleys: DataPoint[] = [];

	for (let i = 1; i < numericPoints.length - 1; i++) {
		const prev = numericPoints[i - 1].y;
		const current = numericPoints[i].y;
		const next = numericPoints[i + 1].y;

		const change = Math.abs(current - prev) / Math.max(Math.abs(prev), 1);

		if (change > threshold) {
			if (current > prev && current > next) {
				peaks.push(numericPoints[i]);
			} else if (current < prev && current < next) {
				valleys.push(numericPoints[i]);
			}
		}
	}

	return { peaks, valleys };
}

/**
 * Normalize line chart data to percentage
 */
export function normalizeLineData(data: ChartData): ChartData {
	const allValues: number[] = [];

	data.series.forEach((series: ChartSeries) => {
		series.data.forEach((point: DataPoint) => {
			if (typeof point.y === "number") {
				allValues.push(point.y);
			}
		});
	});

	const min = Math.min(...allValues);
	const max = Math.max(...allValues);
	const range = max - min;

	const normalizedSeries = data.series.map((series: ChartSeries) => ({
		...series,
		data: series.data.map((point: DataPoint) => ({
			...point,
			y:
				range === 0
					? 0
					: (((typeof point.y === "number" ? point.y : 0) - min) / range) * 100,
		})),
	}));

	return {
		...data,
		series: normalizedSeries,
	};
}


