import type { RangeData, ChartData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Range chart utilities - show min/max ranges for data
 */

/**
 * Generate range chart data
 */
export function generateRangeData(
	ranges: Array<{
		category: string;
		min: number;
		max: number;
		average?: number;
		median?: number;
		color?: string;
	}>,
	options: {
		title?: string;
		orientation?: "horizontal" | "vertical";
		showAverage?: boolean;
		showMedian?: boolean;
		rangeColor?: string;
		averageColor?: string;
		medianColor?: string;
		showLabels?: boolean;
		rangeOpacity?: number;
	} = {},
): RangeData {
	const {
		title,
		orientation = "vertical",
		showAverage = false,
		showMedian = false,
		rangeColor,
		averageColor = "#ff6b6b",
		medianColor = "#4ecdc4",
		showLabels = true,
		rangeOpacity = 0.7,
	} = options;

	// Create range bars (min to max)
	const rangeBars = ranges.map((range, index) => ({
		category: range.category,
		min: range.min,
		max: range.max,
		color: range.color || rangeColor || getSeriesColor(index),
		average: range.average,
		median: range.median,
	}));

	// Create average points if requested
	const averagePoints = showAverage
		? ranges
				.filter((r) => r.average !== undefined)
				.map((range, index) => ({
					x: range.category,
					y: range.average!,
					label: showLabels ? `Avg: ${range.average!.toFixed(2)}` : undefined,
					color: averageColor,
					size: 6,
				}))
		: [];

	// Create median points if requested
	const medianPoints = showMedian
		? ranges
				.filter((r) => r.median !== undefined)
				.map((range, index) => ({
					x: range.category,
					y: range.median!,
					label: showLabels ? `Med: ${range.median!.toFixed(2)}` : undefined,
					color: medianColor,
					size: 4,
				}))
		: [];

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Ranges",
				data: rangeBars.map((range) => ({
					x: range.category,
					y: [range.min, range.max],
					label: showLabels
						? `${range.min.toFixed(1)} - ${range.max.toFixed(1)}`
						: undefined,
					color: range.color,
				})),
				type: "range",
			},
		],
		orientation,
	};

	// Add average and median series if they exist
	if (averagePoints.length > 0) {
		chartData.series.push({
			name: "Average",
			data: averagePoints,
			type: "scatter",
		});
	}

	if (medianPoints.length > 0) {
		chartData.series.push({
			name: "Median",
			data: medianPoints,
			type: "scatter",
		});
	}

	return {
		...chartData,
		ranges: rangeBars,
	};
}

/**
 * Generate range chart from arrays
 */
export function generateRangeFromArrays(
	categories: string[],
	minValues: number[],
	maxValues: number[],
	options: {
		title?: string;
		averageValues?: number[];
		medianValues?: number[];
		colors?: string[];
		orientation?: "horizontal" | "vertical";
		showAverage?: boolean;
		showMedian?: boolean;
	} = {},
): RangeData {
	const { averageValues, medianValues, colors, ...otherOptions } = options;

	const ranges = categories.map((category, index) => ({
		category,
		min: minValues[index],
		max: maxValues[index],
		average: averageValues?.[index],
		median: medianValues?.[index],
		color: colors?.[index],
	}));

	return generateRangeData(ranges, otherOptions);
}

/**
 * Generate range chart from statistical data
 */
export function generateRangeFromStats(
	stats: Array<{
		category: string;
		min: number;
		max: number;
		mean?: number;
		median?: number;
		q1?: number;
		q3?: number;
		outliers?: number[];
		color?: string;
	}>,
	options: {
		title?: string;
		showQuartiles?: boolean;
		showOutliers?: boolean;
		outlierColor?: string;
		quartileColor?: string;
	} = {},
): RangeData {
	const {
		title,
		showQuartiles = false,
		showOutliers = false,
		outlierColor = "#ff6b6b",
		quartileColor = "#ffa726",
	} = options;

	let series = [
		{
			name: "Ranges",
			data: stats.map((stat) => ({
				x: stat.category,
				y: [stat.min, stat.max],
				label: `${stat.min.toFixed(1)} - ${stat.max.toFixed(1)}`,
				color: stat.color || getSeriesColor(0),
			})),
			type: "range" as const,
		},
	];

	// Add quartile ranges if requested
	if (showQuartiles) {
		const quartileRanges = stats
			.filter((stat) => stat.q1 !== undefined && stat.q3 !== undefined)
			.map((stat) => ({
				category: stat.category,
				min: stat.q1!,
				max: stat.q3!,
				color: quartileColor,
			}));

		if (quartileRanges.length > 0) {
			series.push({
				name: "Quartiles (Q1-Q3)",
				data: quartileRanges.map((range) => ({
					x: range.category,
					y: [range.min, range.max],
					color: range.color,
				})),
				type: "range" as const,
			});
		}
	}

	// Add outliers if requested
	if (showOutliers) {
		const outlierPoints = stats
			.filter((stat) => stat.outliers && stat.outliers.length > 0)
			.flatMap((stat) =>
				stat.outliers!.map((outlier) => ({
					x: stat.category,
					y: outlier,
					color: outlierColor,
					size: 3,
				})),
			);

		if (outlierPoints.length > 0) {
			series.push({
				name: "Outliers",
				data: outlierPoints,
				type: "scatter" as const,
			});
		}
	}

	// Add mean/median points
	const statsWithMean = stats.filter((s) => s.mean !== undefined);
	const statsWithMedian = stats.filter((s) => s.median !== undefined);

	if (statsWithMean.length > 0) {
		series.push({
			name: "Mean",
			data: statsWithMean.map((stat) => ({
				x: stat.category,
				y: stat.mean!,
				label: `Mean: ${stat.mean!.toFixed(2)}`,
				color: "#4ecdc4",
			})),
			type: "scatter" as const,
		});
	}

	if (statsWithMedian.length > 0) {
		series.push({
			name: "Median",
			data: statsWithMedian.map((stat) => ({
				x: stat.category,
				y: stat.median!,
				label: `Median: ${stat.median!.toFixed(2)}`,
				color: "#45b7d1",
			})),
			type: "scatter" as const,
		});
	}

	const chartData: ChartData = {
		title,
		series,
	};

	return {
		...chartData,
		ranges: stats.map((stat) => ({
			category: stat.category,
			min: stat.min,
			max: stat.max,
			average: stat.mean,
			median: stat.median,
		})),
	};
}

/**
 * Calculate range statistics
 */
export function calculateRangeStatistics(
	ranges: Array<{ min: number; max: number }>,
): {
	totalRanges: number;
	averageRange: number;
	maxRange: number;
	minRange: number;
	overallMin: number;
	overallMax: number;
	overallRange: number;
	variability: number;
} {
	if (ranges.length === 0) {
		return {
			totalRanges: 0,
			averageRange: 0,
			maxRange: 0,
			minRange: 0,
			overallMin: 0,
			overallMax: 0,
			overallRange: 0,
			variability: 0,
		};
	}

	const rangeSizes = ranges.map((r) => r.max - r.min);
	const averageRange =
		rangeSizes.reduce((sum, r) => sum + r, 0) / rangeSizes.length;
	const maxRange = Math.max(...rangeSizes);
	const minRange = Math.min(...rangeSizes);

	const allValues = ranges.flatMap((r) => [r.min, r.max]);
	const overallMin = Math.min(...allValues);
	const overallMax = Math.max(...allValues);
	const overallRange = overallMax - overallMin;

	// Coefficient of variation for ranges
	const rangeVariance =
		rangeSizes.reduce((sum, r) => sum + Math.pow(r - averageRange, 2), 0) /
		rangeSizes.length;
	const variability =
		averageRange !== 0 ? Math.sqrt(rangeVariance) / averageRange : 0;

	return {
		totalRanges: ranges.length,
		averageRange,
		maxRange,
		minRange,
		overallMin,
		overallMax,
		overallRange,
		variability,
	};
}


