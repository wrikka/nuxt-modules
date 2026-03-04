import type { BarChartData, DataPoint, ChartSeries } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import {
	generateSimpleChartData,
	generateMultiSeriesChartData,
} from './common-chart-generators';

/**
 * Generate bar chart data from categories and values
 */
export function generateBarChartData(
	categories: string[],
	values: number[],
	options: {
		title?: string;
		seriesName?: string;
		colors?: string[];
	} = {},
): BarChartData {
	const { title, seriesName = "Values" } = options;

	return generateSimpleChartData(categories, values, "bar", {
		title,
		seriesName,
	}) as BarChartData;
}

/**
 * Generate grouped bar chart data
 */
export function generateGroupedBarChartData(
	categories: string[],
	seriesData: Array<{
		name: string;
		values: number[];
		color?: string;
	}>,
): BarChartData {
	return generateMultiSeriesChartData(
		categories,
		seriesData,
		"bar",
	) as BarChartData;
}

/**
 * Generate stacked bar chart data
 */
export function generateStackedBarChartData(
	categories: string[],
	seriesData: Array<{
		name: string;
		values: number[];
		color?: string;
	}>,
): BarChartData {
	return {
		...generateMultiSeriesChartData(categories, seriesData, "bar", {
			stacked: true,
		}),
		orientation: "vertical",
	} as BarChartData;
}


