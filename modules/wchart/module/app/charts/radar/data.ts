import type { DataPoint, ChartSeries, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate radar chart data from categories and values
 */
export function generateRadarData(
	categories: string[],
	values: number[],
	options: {
		title?: string;
		seriesName?: string;
		color?: string;
		maxValue?: number;
		levels?: number;
	} = {},
): ChartData {
	const { title, seriesName = "Data", color, maxValue, levels = 5 } = options;

	const data: DataPoint[] = categories.map((category, index) => ({
		x: category,
		y: values[index],
		color: color || getSeriesColor(0),
	}));

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "radar",
			},
		],
	};
}

/**
 * Generate multi-series radar chart data
 */
export function generateMultiRadarData(
	categories: string[],
	seriesData: Array<{
		name: string;
		values: number[];
		color?: string;
	}>,
): ChartData {
	const series: ChartSeries[] = seriesData.map((seriesItem, index) => {
		const data: DataPoint[] = categories.map((category, categoryIndex) => ({
			x: category,
			y: seriesItem.values[categoryIndex] || 0,
			color: seriesItem.color || getSeriesColor(index),
		}));

		return {
			name: seriesItem.name,
			data,
			type: "radar",
			color: seriesItem.color || getSeriesColor(index),
		};
	});

	return {
		series,
	};
}

/**
 * Generate comparison radar chart for two series
 */
export function generateComparisonRadarData(
	categories: string[],
	series1: { name: string; values: number[]; color?: string },
	series2: { name: string; values: number[]; color?: string },
): ChartData {
	return {
		series: [
			{
				name: series1.name,
				data: categories.map((cat, index) => ({
					x: cat,
					y: series1.values[index] || 0,
					color: series1.color || getSeriesColor(0),
				})),
				type: "radar",
				color: series1.color || getSeriesColor(0),
			},
			{
				name: series2.name,
				data: categories.map((cat, index) => ({
					x: cat,
					y: series2.values[index] || 0,
					color: series2.color || getSeriesColor(1),
				})),
				type: "radar",
				color: series2.color || getSeriesColor(1),
			},
		],
	};
}

/**
 * Create radar chart with weighted categories
 */
export function generateWeightedRadarData(
	categories: Array<{ name: string; weight: number }>,
	values: number[],
	options: {
		title?: string;
		seriesName?: string;
		color?: string;
	} = {},
): ChartData {
	const { title, seriesName = "Weighted Data", color } = options;

	const data: DataPoint[] = categories.map((category, index) => ({
		x: category.name,
		y: values[index] * category.weight,
		color: color || getSeriesColor(0),
	}));

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "radar",
			},
		],
	};
}


