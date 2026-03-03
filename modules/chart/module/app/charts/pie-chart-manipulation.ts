import type { PieChartData, DataPoint, ChartSeries } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Calculate percentages for pie chart data
 */
export function calculatePiePercentages(data: PieChartData): PieChartData {
	const series = data.series[0];
	if (!series) return data;

	const total = series.data.reduce((sum: number, point: DataPoint) => {
		return sum + (typeof point.y === "number" ? point.y : 0);
	}, 0);

	const updatedData = series.data.map((point: DataPoint) => ({
		...point,
		label: `${point.x}: ${(((typeof point.y === "number" ? point.y : 0) / total) * 100).toFixed(1)}%`,
	}));

	return {
		...data,
		series: [
			{
				...series,
				data: updatedData,
			},
		],
	};
}

/**
 * Sort pie chart data by value
 */
export function sortPieChartData(
	data: PieChartData,
	order: "asc" | "desc" = "desc",
): PieChartData {
	const series = data.series[0];
	if (!series) return data;

	const sortedData = [...series.data].sort((a, b) => {
		const aVal = typeof a.y === "number" ? a.y : 0;
		const bVal = typeof b.y === "number" ? b.y : 0;
		return order === "asc" ? aVal - bVal : bVal - aVal;
	});

	return {
		...data,
		series: [
			{
				...series,
				data: sortedData,
			},
		],
	};
}

/**
 * Filter pie chart data by minimum value or percentage threshold
 */
export function filterPieChartData(
	data: PieChartData,
	options: {
		minValue?: number;
		minPercentage?: number;
		groupOthers?: boolean;
		othersLabel?: string;
	} = {},
): PieChartData {
	const {
		minValue,
		minPercentage,
		groupOthers = true,
		othersLabel = "Others",
	} = options;

	const series = data.series[0];
	if (!series) return data;

	const total = series.data.reduce((sum: number, point: DataPoint) => {
		return sum + (typeof point.y === "number" ? point.y : 0);
	}, 0);

	let filteredData = series.data.filter((point: DataPoint) => {
		const value = typeof point.y === "number" ? point.y : 0;
		const percentage = (value / total) * 100;

		return (
			(!minValue || value >= minValue) &&
			(!minPercentage || percentage >= minPercentage)
		);
	});

	if (groupOthers && filteredData.length < series.data.length) {
		const othersValue = series.data.reduce((sum: number, point: DataPoint) => {
			const value = typeof point.y === "number" ? point.y : 0;
			const inFiltered = filteredData.some((fp: DataPoint) => fp.x === point.x);
			return inFiltered ? sum : sum + value;
		}, 0);

		if (othersValue > 0) {
			filteredData.push({
				x: othersLabel,
				y: othersValue,
				color: getSeriesColor(filteredData.length),
			});
		}
	}

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

/**
 * Create donut chart from pie chart data
 */
export function createDonutChart(
	data: PieChartData,
	innerRadius: number = 50,
): PieChartData {
	return {
		...data,
		donut: true,
		innerRadius,
	};
}

/**
 * Calculate pie chart statistics
 */
export function calculatePieChartStats(data: PieChartData): {
	total: number;
	max: { value: number; label: string | undefined };
	min: { value: number; label: string | undefined };
	average: number;
	count: number;
	largestSlice: {
		label: string | undefined;
		value: number;
		percentage: number;
	};
} | null {
	const series = data.series[0];
	if (!series) return null;

	const values = series.data.map((point: DataPoint) =>
		typeof point.y === "number" ? point.y : 0,
	);
	const total = values.reduce((sum, val: number) => sum + val, 0);
	const max = Math.max(...values);
	const min = Math.min(...values);
	const avg = total / values.length;

	const maxIndex = values.indexOf(max);
	const minIndex = values.indexOf(min);

	return {
		total,
		max: { value: max, label: series.data[maxIndex]?.x?.toString() },
		min: { value: min, label: series.data[minIndex]?.x?.toString() },
		average: avg,
		count: values.length,
		largestSlice: {
			label: series.data[maxIndex]?.x?.toString(),
			value: max,
			percentage: (max / total) * 100,
		},
	};
}

/**
 * Merge small slices into "Others" category
 */
export function mergeSmallSlices(
	data: PieChartData,
	threshold: number = 5, // percentage
): PieChartData {
	const series = data.series[0];
	if (!series) return data;

	const total = series.data.reduce((sum: number, point: DataPoint) => {
		return sum + (typeof point.y === "number" ? point.y : 0);
	}, 0);

	const largeSlices: DataPoint[] = [];
	let othersValue = 0;

	series.data.forEach((point: DataPoint) => {
		const value = typeof point.y === "number" ? point.y : 0;
		const percentage = (value / total) * 100;

		if (percentage >= threshold) {
			largeSlices.push(point);
		} else {
			othersValue += value;
		}
	});

	if (othersValue > 0) {
		largeSlices.push({
			x: "Others",
			y: othersValue,
			color: getSeriesColor(largeSlices.length),
		});
	}

	return {
		...data,
		series: [
			{
				...series,
				data: largeSlices,
			},
		],
	};
}


