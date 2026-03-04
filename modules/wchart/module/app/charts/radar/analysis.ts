import type { DataPoint, ChartSeries, ChartData } from '@/module/app/types/chart-basic';

/**
 * Normalize radar chart data to 0-100 scale
 */
export function normalizeRadarData(data: ChartData): ChartData {
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

/**
 * Calculate radar chart statistics for each category
 */
export function calculateRadarStats(data: ChartData) {
	const categoryStats: Record<
		string,
		{
			min: number;
			max: number;
			mean: number;
			count: number;
			values: number[];
		}
	> = {};

	// Initialize stats for each category
	data.series.forEach((series: ChartSeries) => {
		series.data.forEach((point: DataPoint) => {
			const category = point.x as string;
			const value = typeof point.y === "number" ? point.y : 0;

			if (!categoryStats[category]) {
				categoryStats[category] = {
					min: Infinity,
					max: -Infinity,
					mean: 0,
					count: 0,
					values: [],
				};
			}

			categoryStats[category].values.push(value);
			categoryStats[category].min = Math.min(
				categoryStats[category].min,
				value,
			);
			categoryStats[category].max = Math.max(
				categoryStats[category].max,
				value,
			);
			categoryStats[category].count++;
		});
	});

	// Calculate means
	Object.keys(categoryStats).forEach((category) => {
		const stats = categoryStats[category];
		stats.mean = stats.values.reduce((sum, val) => sum + val, 0) / stats.count;
	});

	return categoryStats;
}

/**
 * Calculate area of radar chart polygon
 */
export function calculateRadarArea(data: ChartSeries): number {
	const points = data.data.filter((p) => typeof p.y === "number") as Array<{
		x: string;
		y: number;
	}>;

	if (points.length < 3) return 0;

	// Convert to polar coordinates and calculate area
	const angles = points.map(
		(_, index) => (2 * Math.PI * index) / points.length,
	);
	let area = 0;

	for (let i = 0; i < points.length; i++) {
		const j = (i + 1) % points.length;
		area += points[i].y * points[j].y * Math.sin(angles[j] - angles[i]);
	}

	return Math.abs(area) / 2;
}

/**
 * Find the best performing series in radar chart
 */
export function findBestRadarSeries(
	data: ChartData,
): { series: ChartSeries; score: number } | null {
	if (data.series.length === 0) return null;

	let bestSeries = data.series[0];
	let bestScore = calculateRadarArea(bestSeries);

	for (let i = 1; i < data.series.length; i++) {
		const series = data.series[i];
		const score = calculateRadarArea(series);
		if (score > bestScore) {
			bestScore = score;
			bestSeries = series;
		}
	}

	return { series: bestSeries, score: bestScore };
}

/**
 * Calculate radar chart symmetry score
 */
export function calculateRadarSymmetry(data: ChartSeries): number {
	const points = data.data.filter((p) => typeof p.y === "number") as Array<{
		x: string;
		y: number;
	}>;

	if (points.length < 3) return 0;

	const values = points.map((p) => p.y);
	const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

	// Calculate variance from mean (lower variance = more symmetric)
	const variance =
		values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
		values.length;
	const symmetryScore = Math.max(0, 100 - (variance / mean) * 10);

	return Math.min(100, symmetryScore);
}

/**
 * Calculate radar chart completeness score
 */
export function calculateRadarCompleteness(data: ChartSeries): number {
	const points = data.data.filter((p) => typeof p.y === "number" && p.y > 0);
	const totalCategories = data.data.length;

	if (totalCategories === 0) return 0;

	return (points.length / totalCategories) * 100;
}

/**
 * Find categories with highest and lowest values across all series
 */
export function findRadarExtremes(data: ChartData): {
	highest: { category: string; value: number; series: string };
	lowest: { category: string; value: number; series: string };
} {
	let highest = { category: "", value: -Infinity, series: "" };
	let lowest = { category: "", value: Infinity, series: "" };

	data.series.forEach((series: ChartSeries) => {
		series.data.forEach((point: DataPoint) => {
			const value = typeof point.y === "number" ? point.y : 0;
			const category = point.x as string;

			if (value > highest.value) {
				highest = { category, value, series: series.name };
			}

			if (value < lowest.value) {
				lowest = { category, value, series: series.name };
			}
		});
	});

	return { highest, lowest };
}


