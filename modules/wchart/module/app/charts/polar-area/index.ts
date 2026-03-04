import type { ChartData, DataPoint, ChartSeries } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Polar area chart utilities and data generation
 */

/**
 * Generate polar area chart data from categories and values
 */
export function generatePolarAreaData(
	categories: string[],
	values: number[],
	options: {
		title?: string;
		seriesName?: string;
		color?: string;
		maxValue?: number;
		startAngle?: number;
	} = {},
): ChartData {
	const {
		title,
		seriesName = "Data",
		color,
		maxValue,
		startAngle = 0,
	} = options;

	const data: DataPoint[] = categories.map((category, index) => ({
		x: category,
		y: values[index],
		color: color || getSeriesColor(index),
	}));

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "polarArea",
			},
		],
	};
}

/**
 * Generate multi-series polar area chart data
 */
export function generateMultiPolarAreaData(
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
			type: "polarArea",
			color: seriesItem.color || getSeriesColor(index),
		};
	});

	return {
		series,
	};
}

/**
 * Normalize polar area chart data
 */
export function normalizePolarAreaData(data: ChartData): ChartData {
	const allValues: number[] = [];

	data.series.forEach((series: ChartSeries) => {
		series.data.forEach((point: DataPoint) => {
			if (typeof point.y === "number") {
				allValues.push(point.y);
			}
		});
	});

	const min = Math.min(...allValues);
	const max = Math.max(...allValues);
	const range = max - min;

	const normalizedSeries = data.series.map((series: ChartSeries) => ({
		...series,
		data: series.data.map((point: DataPoint) => ({
			...point,
			y:
				range === 0
					? 0
					: (((typeof point.y === "number" ? point.y : 0) - min) / range) * 100,
		})),
	}));

	return {
		...data,
		series: normalizedSeries,
	};
}

/**
 * Calculate polar area chart statistics
 */
export function calculatePolarAreaStats(data: ChartData) {
	const categoryStats: Record<
		string,
		{
			total: number;
			percentage: number;
			count: number;
			values: number[];
		}
	> = {};

	let totalValue = 0;

	// Calculate totals
	data.series.forEach((series: ChartSeries) => {
		series.data.forEach((point: DataPoint) => {
			const category = point.x as string;
			const value = typeof point.y === "number" ? point.y : 0;
			totalValue += value;

			if (!categoryStats[category]) {
				categoryStats[category] = {
					total: 0,
					percentage: 0,
					count: 0,
					values: [],
				};
			}

			categoryStats[category].total += value;
			categoryStats[category].values.push(value);
			categoryStats[category].count++;
		});
	});

	// Calculate percentages
	Object.keys(categoryStats).forEach((category) => {
		categoryStats[category].percentage =
			(categoryStats[category].total / totalValue) * 100;
	});

	return categoryStats;
}

/**
 * Calculate polar area angles for each category
 */
export function calculatePolarAreaAngles(
	data: ChartSeries,
	startAngle: number = 0,
): Array<{
	category: string;
	angle: number;
	value: number;
}> {
	const points = data.data.filter((p) => typeof p.y === "number") as Array<{
		x: string;
		y: number;
	}>;
	const total = points.reduce((sum, p) => sum + p.y, 0);

	let currentAngle = startAngle;

	return points.map((point) => {
		const angle = (point.y / total) * 360;
		const result = {
			category: point.x,
			angle,
			value: point.y,
		};
		currentAngle += angle;
		return result;
	});
}


