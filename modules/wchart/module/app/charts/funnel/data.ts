import type { ChartData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate funnel chart data from stages and values
 */
export function generateFunnelData(
	stages: string[],
	values: number[],
	options: {
		title?: string;
		seriesName?: string;
		colors?: string[];
		neckRatio?: number;
	} = {},
): ChartData {
	const { title, seriesName = "Funnel", colors, neckRatio = 0.3 } = options;

	const data: DataPoint[] = stages.map((stage, index) => ({
		x: stage,
		y: values[index],
		color: colors?.[index] || getSeriesColor(index),
	}));

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "funnel",
			},
		],
	};
}

/**
 * Generate funnel chart from conversion data
 */
export function generateFunnelFromConversions(
	initialValue: number,
	conversions: Array<{ stage: string; rate: number; color?: string }>,
): ChartData {
	let currentValue = initialValue;
	const values: number[] = [currentValue];
	const stages: string[] = ["Initial"];

	conversions.forEach((conversion) => {
		currentValue *= conversion.rate;
		values.push(currentValue);
		stages.push(conversion.stage);
	});

	const data: DataPoint[] = stages.map((stage, index) => ({
		x: stage,
		y: values[index],
		color: conversions[index - 1]?.color || getSeriesColor(index),
	}));

	return {
		series: [
			{
				name: "Conversion Funnel",
				data,
				type: "funnel",
			},
		],
	};
}

/**
 * Generate inverted funnel (for sales qualification etc.)
 */
export function generateInvertedFunnelData(
	stages: string[],
	values: number[],
	options: {
		title?: string;
		seriesName?: string;
		colors?: string[];
	} = {},
): ChartData {
	const { title, seriesName = "Inverted Funnel", colors } = options;

	// Sort stages by value (smallest first for inverted funnel)
	const sortedData = stages
		.map((stage, index) => ({
			stage,
			value: values[index],
			index,
		}))
		.sort((a, b) => a.value - b.value);

	const data: DataPoint[] = sortedData.map((item, sortIndex) => ({
		x: item.stage,
		y: item.value,
		color: colors?.[item.index] || getSeriesColor(sortIndex),
	}));

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "funnel",
			},
		],
	};
}

/**
 * Generate cumulative funnel data
 */
export function generateCumulativeFunnelData(
	stages: string[],
	values: number[],
): ChartData {
	const cumulativeValues: number[] = [];
	let sum = 0;

	values.forEach((value) => {
		sum += value;
		cumulativeValues.push(sum);
	});

	const data: DataPoint[] = stages.map((stage, index) => ({
		x: stage,
		y: cumulativeValues[index],
		color: getSeriesColor(index),
	}));

	return {
		series: [
			{
				name: "Cumulative Funnel",
				data,
				type: "funnel",
			},
		],
	};
}


