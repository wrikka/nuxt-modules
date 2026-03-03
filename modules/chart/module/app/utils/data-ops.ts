import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Merge multiple chart data objects
 */
export function mergeChartData(...chartDataArray: ChartData[]): ChartData {
	const mergedSeries: ChartSeries[] = [];
	for (const chartData of chartDataArray) {
		mergedSeries.push(...chartData.series);
	}
	return {
		title: chartDataArray[0]?.title,
		series: mergedSeries,
	};
}

/**
 * Sort data points by x or y value
 */
export function sortDataPoints(
	data: DataPoint[],
	sortBy: "x" | "y" = "x",
	order: "asc" | "desc" = "asc",
): DataPoint[] {
	return [...data].sort((a, b) => {
		const aValue = sortBy === "x" ? a.x : typeof a.y === "number" ? a.y : 0;
		const bValue = sortBy === "x" ? b.x : typeof b.y === "number" ? b.y : 0;
		if (typeof aValue === "string" && typeof bValue === "string") {
			return order === "asc"
				? aValue.localeCompare(bValue)
				: bValue.localeCompare(aValue);
		}
		const aNum = typeof aValue === "number" ? aValue : 0;
		const bNum = typeof bValue === "number" ? bValue : 0;
		return order === "asc" ? aNum - bNum : bNum - aNum;
	});
}
