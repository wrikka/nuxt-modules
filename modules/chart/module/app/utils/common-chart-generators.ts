import type { ChartData, DataPoint, ChartSeries } from '@/module/app/types/chart-basic';
import { getSeriesColor } from './chart-utils';

export interface GenerateChartOptions {
	title?: string;
	seriesName?: string;
	color?: string;
	type: string;
	additionalOptions?: Record<string, any>;
}

/**
 * Generate chart data for simple charts (line, area, bar)
 */
export function generateSimpleChartData(
	xValues: (string | number | Date)[],
	yValues: number[],
	type: "line" | "area" | "bar",
	options: Omit<GenerateChartOptions, "type"> = {},
): ChartData {
	const { title, seriesName = "Data", color, additionalOptions = {} } = options;

	const data: DataPoint[] = xValues.map((x, index) => ({
		x,
		y: yValues[index],
		color: color || getSeriesColor(0),
	}));

	const series: ChartSeries = {
		name: seriesName,
		data,
		type,
		color: color || getSeriesColor(0),
		...additionalOptions,
	};

	return {
		title,
		series: [series],
	};
}

/**
 * Generate chart data for multi-series charts
 */
export function generateMultiSeriesChartData(
	xValues: (string | number | Date)[],
	seriesData: Array<{
		name: string;
		values: number[];
		color?: string;
	}>,
	type: "line" | "area" | "bar",
	options: { title?: string; stacked?: boolean } = {},
): ChartData {
	const { title, stacked = false } = options;

	const series: ChartSeries[] = seriesData.map((seriesItem, index) => {
		const data: DataPoint[] = xValues.map((x, xIndex) => ({
			x,
			y: seriesItem.values[xIndex] || 0,
			color: seriesItem.color || getSeriesColor(index),
		}));

		return {
			name: seriesItem.name,
			data,
			type,
			color: seriesItem.color || getSeriesColor(index),
		};
	});

	return {
		title,
		series,
		stacked,
	};
}
