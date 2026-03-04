import type { SparklineData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Sparkline utilities and data generation
 */

/**
 * Generate sparkline data from number array
 */
export function generateSparklineData(
	data: number[],
	options: {
		title?: string;
		color?: string;
		lineWidth?: number;
		showPoints?: boolean;
		fill?: boolean;
		minValue?: number;
		maxValue?: number;
	} = {},
): SparklineData {
	const {
		title,
		color = getSeriesColor(0),
		lineWidth = 1,
		showPoints = false,
		fill = false,
		minValue,
		maxValue,
	} = options;

	// Create data points with indices as x values
	const points = data.map((value, index) => ({
		x: index,
		y: value,
	}));

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Sparkline",
				data: points,
				type: "sparkline",
				color,
			},
		],
	};

	return {
		...chartData,
		data,
		lineWidth,
		showPoints,
		fill,
	};
}

/**
 * Generate sparkline from data with custom x values
 */
export function generateSparklineFromPoints(
	points: Array<{ x: number | string; y: number }>,
	options: {
		title?: string;
		color?: string;
		lineWidth?: number;
		showPoints?: boolean;
		fill?: boolean;
	} = {},
): SparklineData {
	const {
		title,
		color = getSeriesColor(0),
		lineWidth = 1,
		showPoints = false,
		fill = false,
	} = options;

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Sparkline",
				data: points,
				type: "sparkline",
				color,
			},
		],
	};

	return {
		...chartData,
		data: points.map((p) => p.y),
		lineWidth,
		showPoints,
		fill,
	};
}

/**
 * Generate multiple sparklines for comparison
 */
export function generateMultiSparklineData(
	seriesData: Array<{
		name: string;
		data: number[];
		color?: string;
	}>,
	options: {
		title?: string;
		lineWidth?: number;
		showPoints?: boolean;
		fill?: boolean;
	} = {},
): ChartData {
	const { title, lineWidth = 1, showPoints = false, fill = false } = options;

	const series = seriesData.map((item, index) => ({
		name: item.name,
		data: item.data.map((value, dataIndex) => ({
			x: dataIndex,
			y: value,
		})),
		type: "sparkline" as const,
		color: item.color || getSeriesColor(index),
	}));

	return {
		title,
		series,
	};
}

/**
 * Calculate sparkline statistics
 */
export function getSparklineStats(data: number[]): {
	min: number;
	max: number;
	average: number;
	trend: "up" | "down" | "stable";
	change: number;
} {
	if (data.length === 0) {
		return { min: 0, max: 0, average: 0, trend: "stable", change: 0 };
	}

	const min = Math.min(...data);
	const max = Math.max(...data);
	const average = data.reduce((a, b) => a + b, 0) / data.length;

	const first = data[0];
	const last = data[data.length - 1];
	const change = last - first;

	let trend: "up" | "down" | "stable" = "stable";
	if (change > 0.01) trend = "up";
	else if (change < -0.01) trend = "down";

	return { min, max, average, trend, change };
}

/**
 * Normalize sparkline data to 0-1 range
 */
export function normalizeSparklineData(data: number[]): number[] {
	if (data.length === 0) return [];

	const min = Math.min(...data);
	const max = Math.max(...data);
	const range = max - min;

	if (range === 0) return data.map(() => 0.5); // All values are the same

	return data.map((value) => (value - min) / range);
}

/**
 * Generate sparkline with trend indicators
 */
export function generateSparklineWithTrend(
	data: number[],
	options: {
		title?: string;
		color?: string;
		showTrend?: boolean;
		trendColor?: string;
	} = {},
): SparklineData {
	const sparkline = generateSparklineData(data, options);

	// Add trend calculation
	const stats = getSparklineStats(data);

	// You can extend this to add trend line or indicators
	return {
		...sparkline,
		// Add trend information to the data
	};
}


