import type { LollipopData, ChartData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Lollipop chart utilities and data generation
 */

/**
 * Generate lollipop chart data
 */
export function generateLollipopData(
	data: Array<{ x: string; y: number; color?: string }>,
	options: {
		title?: string;
		orientation?: "horizontal" | "vertical";
		showValues?: boolean;
		dotSize?: number;
		lineWidth?: number;
		sortByValue?: boolean;
		sortOrder?: "asc" | "desc";
	} = {},
): LollipopData {
	const {
		title,
		orientation = "vertical",
		showValues = false,
		dotSize = 8,
		lineWidth = 2,
		sortByValue = false,
		sortOrder = "desc",
	} = options;

	// Sort data if requested
	let sortedData = data;
	if (sortByValue) {
		sortedData = [...data].sort((a, b) => {
			const comparison = a.y - b.y;
			return sortOrder === "desc" ? -comparison : comparison;
		});
	}

	// Create data points with enhanced properties for lollipop rendering
	const points: DataPoint[] = sortedData.map((item, index) => ({
		x: item.x,
		y: item.y,
		label: showValues ? item.y.toString() : undefined,
		color: item.color || getSeriesColor(index),
	}));

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Lollipop",
				data: points,
				type: "lollipop",
			},
		],
		orientation,
	};

	return {
		...chartData,
		orientation,
		showValues,
	};
}

/**
 * Generate lollipop chart from arrays
 */
export function generateLollipopFromArrays(
	labels: string[],
	values: number[],
	options: {
		title?: string;
		colors?: string[];
		orientation?: "horizontal" | "vertical";
		showValues?: boolean;
		dotSize?: number;
		lineWidth?: number;
		sortByValue?: boolean;
		sortOrder?: "asc" | "desc";
	} = {},
): LollipopData {
	const { colors, ...otherOptions } = options;

	const data = labels.map((label, index) => ({
		x: label,
		y: values[index],
		color: colors?.[index],
	}));

	return generateLollipopData(data, otherOptions);
}

/**
 * Generate comparison lollipop chart (dumbbell style but with single values)
 */
export function generateComparisonLollipopData(
	categories: string[],
	values1: number[],
	values2: number[],
	options: {
		title?: string;
		labels?: [string, string];
		colors?: [string, string];
		orientation?: "horizontal" | "vertical";
		showValues?: boolean;
	} = {},
): ChartData {
	const {
		title,
		labels = ["Series 1", "Series 2"],
		colors = [getSeriesColor(0), getSeriesColor(1)],
		orientation = "vertical",
		showValues = false,
	} = options;

	const series = [
		{
			name: labels[0],
			data: categories.map((category, index) => ({
				x: category,
				y: values1[index],
				label: showValues ? values1[index].toString() : undefined,
				color: colors[0],
			})),
			type: "lollipop" as const,
		},
		{
			name: labels[1],
			data: categories.map((category, index) => ({
				x: category,
				y: values2[index],
				label: showValues ? values2[index].toString() : undefined,
				color: colors[1],
			})),
			type: "lollipop" as const,
		},
	];

	return {
		title,
		series,
		orientation,
	};
}

/**
 * Generate ranked lollipop chart (with ranking numbers)
 */
export function generateRankedLollipopData(
	data: Array<{ name: string; value: number; color?: string }>,
	options: {
		title?: string;
		orientation?: "horizontal" | "vertical";
		showRank?: boolean;
		showValues?: boolean;
		sortOrder?: "asc" | "desc";
	} = {},
): LollipopData {
	const {
		title,
		orientation = "horizontal",
		showRank = true,
		showValues = true,
		sortOrder = "desc",
	} = options;

	// Sort by value
	const sortedData = [...data].sort((a, b) => {
		const comparison = a.value - b.value;
		return sortOrder === "desc" ? -comparison : comparison;
	});

	// Add ranking
	const rankedData = sortedData.map((item, index) => ({
		x: showRank ? `${index + 1}. ${item.name}` : item.name,
		y: item.value,
		label: showValues ? item.value.toString() : undefined,
		color: item.color || getSeriesColor(index),
	}));

	return generateLollipopData(rankedData, {
		title,
		orientation,
		showValues: false,
	});
}

/**
 * Calculate optimal lollipop dimensions
 */
export function calculateLollipopDimensions(
	data: Array<{ y: number }>,
	containerWidth: number,
	containerHeight: number,
	orientation: "horizontal" | "vertical" = "vertical",
): {
	dotSpacing: number;
	maxValue: number;
	scale: number;
} {
	const count = data.length;
	const maxValue = Math.max(...data.map((d) => d.y));

	let dotSpacing: number;
	let scale: number;

	if (orientation === "vertical") {
		dotSpacing = containerWidth / (count + 1);
		scale = containerHeight / maxValue;
	} else {
		dotSpacing = containerHeight / (count + 1);
		scale = containerWidth / maxValue;
	}

	return { dotSpacing, maxValue, scale };
}


