import type { ChartData, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Calculate treemap statistics
 */
export function calculateTreemapStats(data: ChartData) {
	const series = data.series[0];
	if (!series) return null;

	const values = series.data.map((p: DataPoint) =>
		typeof p.y === "number" ? p.y : 0,
	);
	const totalValue = values.reduce((sum: number, val: number) => sum + val, 0);
	const leafNodes = series.data.length;

	return {
		totalValue,
		leafNodes,
		averageValue: totalValue / leafNodes,
		maxValue: Math.max(...values),
		minValue: Math.min(...values),
		valueRange: Math.max(...values) - Math.min(...values),
	};
}

/**
 * Filter treemap data by value threshold
 */
export function filterTreemapData(
	data: ChartData,
	minValue?: number,
	maxValue?: number,
): ChartData {
	const series = data.series[0];
	if (!series) return data;

	const filteredData = series.data.filter((point) => {
		const value = typeof point.y === "number" ? point.y : 0;
		return (!minValue || value >= minValue) && (!maxValue || value <= maxValue);
	});

	return {
		...data,
		series: [
			{
				...series,
				data: filteredData,
			},
		],
	};
}

export function normalizeTreemapData(data: ChartData): ChartData {
	const series: any = data.series[0];
	if (!series) return data;

	const total = series.data.reduce((sum: number, point: DataPoint) => {
		return sum + (typeof point.y === "number" ? point.y : 0);
	}, 0);

	if (total === 0) return data;

	const normalizedData = series.data.map((point: DataPoint) => ({
		...point,
		y: typeof point.y === "number" ? (point.y / total) * 100 : 0,
	}));

	return {
		...data,
		series: [
			{
				...series,
				data: normalizedData,
			},
		],
	};
}

/**
 * Find the largest rectangles in treemap
 */
export function findLargestTreemapRectangles(
	data: ChartData,
	count: number = 5,
): Array<{ name: string; value: number; path: string }> {
	const series = data.series[0];
	if (!series) return [];

	const sorted = series.data
		.map((point: DataPoint) => ({
			name: (point.x as string).split("/").pop() || "",
			value: typeof point.y === "number" ? point.y : 0,
			path: point.x as string,
		}))
		.sort(
			(
				a: { name: string; value: number; path: string },
				b: { name: string; value: number; path: string },
			) => b.value - a.value,
		);

	return sorted.slice(0, count);
}


