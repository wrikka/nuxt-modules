import type { BarChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Transform data to horizontal bar chart format
 */
export function createHorizontalBarChart(data: BarChartData): BarChartData {
	return {
		...data,
		orientation: "horizontal",
	};
}

/**
 * Calculate bar chart statistics
 */
export function calculateBarChartStats(data: BarChartData): {
	total: number;
	max: number;
	min: number;
	average: number;
	count: number;
} {
	const allValues: number[] = [];

	data.series.forEach((series: ChartSeries) => {
		series.data.forEach((point: DataPoint) => {
			if (typeof point.y === "number") {
				allValues.push(point.y);
			}
		});
	});

	const sum = allValues.reduce((a, b) => a + b, 0);
	const max = Math.max(...allValues);
	const min = Math.min(...allValues);
	const avg = sum / allValues.length;

	return {
		total: sum,
		max,
		min,
		average: avg,
		count: allValues.length,
	};
}

/**
 * Sort bar chart data by values
 */
export function sortBarChartData(
	data: BarChartData,
	order: "asc" | "desc" = "desc",
): BarChartData {
	const sortedSeries = data.series.map((series: ChartSeries) => ({
		...series,
		data: [...series.data].sort((a: DataPoint, b: DataPoint) => {
			const aVal = typeof a.y === "number" ? a.y : 0;
			const bVal = typeof b.y === "number" ? b.y : 0;
			return order === "asc" ? aVal - bVal : bVal - aVal;
		}),
	}));

	return {
		...data,
		series: sortedSeries,
	};
}

/**
 * Filter bar chart data by value threshold
 */
export function filterBarChartData(
	data: BarChartData,
	minValue?: number,
	maxValue?: number,
): BarChartData {
	const filteredSeries = data.series.map((series: ChartSeries) => ({
		...series,
		data: series.data.filter((point: DataPoint) => {
			const yVal = typeof point.y === "number" ? point.y : 0;
			return (!minValue || yVal >= minValue) && (!maxValue || yVal <= maxValue);
		}),
	}));

	return {
		...data,
		series: filteredSeries,
	};
}


