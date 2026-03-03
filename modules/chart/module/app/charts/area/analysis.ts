import type { ChartData, DataPoint, ChartSeries } from '@/module/app/types/chart-basic';

/**
 * Calculate area under the curve using trapezoidal rule
 */
export function calculateAreaUnderCurve(data: DataPoint[]): number {
	const numericPoints = data.filter(
		(p) => typeof p.x === "number" && typeof p.y === "number",
	) as Array<{ x: number; y: number }>;

	if (numericPoints.length < 2) return 0;

	let area = 0;
	for (let i = 0; i < numericPoints.length - 1; i++) {
		const x1 = numericPoints[i].x;
		const x2 = numericPoints[i + 1].x;
		const y1 = numericPoints[i].y;
		const y2 = numericPoints[i + 1].y;

		// Trapezoidal rule: (x2 - x1) * (y1 + y2) / 2
		area += ((x2 - x1) * (y1 + y2)) / 2;
	}

	return area;
}

/**
 * Calculate areas for all series in area chart
 */
export function calculateAreas(data: ChartData): Record<string, number> {
	const areas: Record<string, number> = {};

	data.series.forEach((series: ChartSeries) => {
		areas[series.name] = calculateAreaUnderCurve(series.data);
	});

	return areas;
}

/**
 * Smooth area chart data
 */
export function smoothAreaData(
	data: DataPoint[],
	_tension: number = 0.5,
): DataPoint[] {
	if (data.length < 3) return data;

	const smoothed: DataPoint[] = [];
	const points = data.filter((p) => typeof p.y === "number");

	for (let i = 0; i < points.length; i++) {
		if (i === 0 || i === points.length - 1) {
			smoothed.push(points[i]);
		} else {
			const prev = points[i - 1];
			const current = points[i];
			const next = points[i + 1];

			if (
				typeof prev.y === "number" &&
				typeof current.y === "number" &&
				typeof next.y === "number"
			) {
				// Simple smoothing - could implement more sophisticated algorithms
				const smoothedY = (prev.y + current.y + next.y) / 3;
				smoothed.push({
					...current,
					y: smoothedY,
				});
			} else {
				smoothed.push(points[i]);
			}
		}
	}

	return smoothed;
}

/**
 * Apply smoothing to all series in area chart
 */
export function smoothAreaChart(
	data: ChartData,
	tension: number = 0.5,
): ChartData {
	const smoothedSeries = data.series.map((series: ChartSeries) => ({
		...series,
		data: smoothAreaData(series.data, tension),
	}));

	return {
		...data,
		series: smoothedSeries,
	};
}

/**
 * Find intersection points between two area series
 */
export function findIntersectionPoints(
	series1: DataPoint[],
	series2: DataPoint[],
): DataPoint[] {
	const intersections: DataPoint[] = [];

	// Simple implementation - assumes sorted x values
	const maxLength = Math.max(series1.length, series2.length);

	for (let i = 0; i < maxLength - 1; i++) {
		const p1 = series1[i];
		const p2 = series1[i + 1];
		const q1 = series2[i];
		const q2 = series2[i + 1];

		if (
			typeof p1?.y === "number" &&
			typeof p2?.y === "number" &&
			typeof q1?.y === "number" &&
			typeof q2?.y === "number" &&
			typeof p1.x === "number" &&
			typeof p2.x === "number"
		) {
			// Check if lines intersect
			if ((p1.y - q1.y) * (p2.y - q2.y) < 0) {
				// Simple linear interpolation to find intersection
				const x =
					p1.x + ((p2.x - p1.x) * (q1.y - p1.y)) / (p1.y - p2.y + q2.y - q1.y);
				const y = q1.y;
				intersections.push({ x, y });
			}
		}
	}

	return intersections;
}

/**
 * Normalize area chart data (stack to 100%)
 */
export function normalizeAreaData(data: ChartData): ChartData {
	const xPoints = new Set<number | string | Date>();

	// Collect all x values
	data.series.forEach((series: ChartSeries) => {
		series.data.forEach((point: DataPoint) => {
			xPoints.add(point.x);
		});
	});

	const xArray = Array.from(xPoints).sort();

	const normalizedSeries: ChartSeries[] = data.series.map(
		(series: ChartSeries) => {
			const dataMap = new Map(series.data.map((p: DataPoint) => [p.x, p.y]));

			const normalizedData: DataPoint[] = xArray.map((x) => {
				const y =
					typeof dataMap.get(x) === "number" ? (dataMap.get(x) as number) : 0;
				return { x, y };
			});

			return {
				...series,
				data: normalizedData,
			};
		},
	);

	return {
		...data,
		series: normalizedSeries,
	};
}


