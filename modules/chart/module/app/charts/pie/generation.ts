import type { PieChartData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate pie chart data from labels and values
 */
export function generatePieChartData(
	labels: string[],
	values: number[],
	options: {
		title?: string;
		seriesName?: string;
		colors?: string[];
		donut?: boolean;
		innerRadius?: number;
	} = {},
): PieChartData {
	const {
		title,
		seriesName = "Categories",
		colors,
		donut = false,
		innerRadius = 0,
	} = options;

	const data: DataPoint[] = labels.map((label, index) => ({
		x: label,
		y: values[index],
		color: colors?.[index] || getSeriesColor(index),
	}));

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "pie",
			},
		],
		donut,
		innerRadius,
	};
}

/**
 * Generate pie chart from data array with automatic percentage calculation
 */
export function generatePieChartFromData(
	data: Array<{ label: string; value: number; color?: string }>,
	options: {
		title?: string;
		seriesName?: string;
		donut?: boolean;
		innerRadius?: number;
	} = {},
): PieChartData {
	const {
		title,
		seriesName = "Data",
		donut = false,
		innerRadius = 0,
	} = options;

	const chartData: DataPoint[] = data.map((item, index) => ({
		x: item.label,
		y: item.value,
		color: item.color || getSeriesColor(index),
	}));

	return {
		title,
		series: [
			{
				name: seriesName,
				data: chartData,
				type: "pie",
			},
		],
		donut,
		innerRadius,
	};
}


