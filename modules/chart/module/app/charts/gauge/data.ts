import type { ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate gauge chart data
 */
export function generateGaugeData(
	value: number,
	options: {
		title?: string;
		min?: number;
		max?: number;
		seriesName?: string;
		color?: string;
		thresholds?: Array<{ value: number; color: string; label?: string }>;
	} = {},
): ChartData {
	const {
		title,
		min = 0,
		max = 100,
		seriesName = "Gauge",
		color,
		thresholds = [],
	} = options;

	const data: DataPoint[] = [
		{
			x: "value",
			y: value,
			color: color || getSeriesColor(0),
		},
	];

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "gauge",
			},
		],
	};
}

/**
 * Generate multi-value gauge chart
 */
export function generateMultiGaugeData(
	values: Array<{ name: string; value: number; color?: string }>,
	options: {
		title?: string;
		min?: number;
		max?: number;
	} = {},
): ChartData {
	const { title, min = 0, max = 100 } = options;

	const data: DataPoint[] = values.map((item, index) => ({
		x: item.name,
		y: item.value,
		color: item.color || getSeriesColor(index),
	}));

	return {
		title,
		series: [
			{
				name: "Multi Gauge",
				data,
				type: "gauge",
			},
		],
	};
}

/**
 * Generate semicircle gauge data
 */
export function generateSemicircleGaugeData(
	value: number,
	options: {
		title?: string;
		min?: number;
		max?: number;
		seriesName?: string;
		color?: string;
	} = {},
): ChartData {
	const {
		title,
		min = 0,
		max = 100,
		seriesName = "Semicircle Gauge",
		color,
	} = options;

	return generateGaugeData(value, {
		...options,
		title,
		min,
		max,
		seriesName,
		color,
	});
}

/**
 * Generate full circle gauge data
 */
export function generateCircleGaugeData(
	value: number,
	options: {
		title?: string;
		min?: number;
		max?: number;
		seriesName?: string;
		color?: string;
	} = {},
): ChartData {
	const {
		title,
		min = 0,
		max = 100,
		seriesName = "Circle Gauge",
		color,
	} = options;

	return generateGaugeData(value, {
		...options,
		title,
		min,
		max,
		seriesName,
		color,
	});
}


