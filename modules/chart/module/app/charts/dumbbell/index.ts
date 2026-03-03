import type { DumbbellData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Dumbbell chart utilities and data generation
 */

/**
 * Generate dumbbell chart data from pairs
 */
export function generateDumbbellData(
	pairs: Array<{
		category: string;
		start: number;
		end: number;
		color?: string;
		startLabel?: string;
		endLabel?: string;
	}>,
	options: {
		title?: string;
		showLabels?: boolean;
		showValues?: boolean;
		lineWidth?: number;
		dotSize?: number;
		sortByDifference?: boolean;
		sortOrder?: "asc" | "desc";
	} = {},
): DumbbellData {
	const {
		title,
		showLabels = true,
		showValues = false,
		lineWidth = 2,
		dotSize = 8,
		sortByDifference = false,
		sortOrder = "desc",
	} = options;

	// Sort pairs if requested
	let sortedPairs = pairs;
	if (sortByDifference) {
		sortedPairs = [...pairs].sort((a, b) => {
			const diffA = Math.abs(a.end - a.start);
			const diffB = Math.abs(b.end - b.start);
			const comparison = diffA - diffB;
			return sortOrder === "desc" ? -comparison : comparison;
		});
	}

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Dumbbell",
				data: sortedPairs.map((pair, index) => ({
					x: pair.category,
					y: [pair.start, pair.end],
					color: pair.color || getSeriesColor(index),
				})),
				type: "dumbbell",
			},
		],
	};

	return {
		...chartData,
		pairs: sortedPairs,
	};
}

/**
 * Generate dumbbell chart from arrays
 */
export function generateDumbbellFromArrays(
	categories: string[],
	startValues: number[],
	endValues: number[],
	options: {
		title?: string;
		colors?: string[];
		showLabels?: boolean;
		showValues?: boolean;
		labels?: [string, string];
		sortByDifference?: boolean;
		sortOrder?: "asc" | "desc";
	} = {},
): DumbbellData {
	const { colors, labels, ...otherOptions } = options;

	const pairs = categories.map((category, index) => ({
		category,
		start: startValues[index],
		end: endValues[index],
		color: colors?.[index],
		startLabel: labels?.[0],
		endLabel: labels?.[1],
	}));

	return generateDumbbellData(pairs, otherOptions);
}

/**
 * Generate before/after dumbbell chart
 */
export function generateBeforeAfterDumbbell(
	data: Array<{
		category: string;
		before: number;
		after: number;
		color?: string;
	}>,
	options: {
		title?: string;
		beforeLabel?: string;
		afterLabel?: string;
		showImprovement?: boolean;
	} = {},
): DumbbellData {
	const {
		title,
		beforeLabel = "Before",
		afterLabel = "After",
		showImprovement = false,
	} = options;

	// Add improvement calculation if requested
	const pairs = data.map((item) => ({
		category: showImprovement
			? `${item.category} (${(((item.after - item.before) / item.before) * 100).toFixed(1)}%)`
			: item.category,
		start: item.before,
		end: item.after,
		color: item.color,
		startLabel: beforeLabel,
		endLabel: afterLabel,
	}));

	return generateDumbbellData(pairs, { title, showLabels: true });
}

/**
 * Generate range dumbbell chart (min/max values)
 */
export function generateRangeDumbbell(
	data: Array<{
		category: string;
		min: number;
		max: number;
		current?: number;
		color?: string;
	}>,
	options: {
		title?: string;
		showCurrent?: boolean;
		currentColor?: string;
	} = {},
): ChartData {
	const { title, showCurrent = false, currentColor = "#FF5722" } = options;

	const series = [
		{
			name: "Range",
			data: data.map((item) => ({
				x: item.category,
				y: [item.min, item.max],
				color: item.color || getSeriesColor(0),
			})),
			type: "dumbbell" as const,
		},
	];

	// Add current value series if requested
	if (showCurrent) {
		series.push({
			name: "Current",
			data: data.map((item) => ({
				x: item.category,
				y: item.current || 0,
				color: currentColor,
			})),
			type: "dumbbell" as const,
		});
	}

	return {
		title,
		series,
	};
}

/**
 * Calculate dumbbell statistics
 */
export function calculateDumbbellStats(
	pairs: Array<{ start: number; end: number }>,
): {
	averageStart: number;
	averageEnd: number;
	averageDifference: number;
	maxDifference: number;
	minDifference: number;
	improvementCount: number;
	declineCount: number;
} {
	const differences = pairs.map((pair) => pair.end - pair.start);
	const averageStart =
		pairs.reduce((sum, pair) => sum + pair.start, 0) / pairs.length;
	const averageEnd =
		pairs.reduce((sum, pair) => sum + pair.end, 0) / pairs.length;
	const averageDifference =
		differences.reduce((a, b) => a + b, 0) / differences.length;

	const maxDifference = Math.max(...differences);
	const minDifference = Math.min(...differences);
	const improvementCount = differences.filter((d) => d > 0).length;
	const declineCount = differences.filter((d) => d < 0).length;

	return {
		averageStart,
		averageEnd,
		averageDifference,
		maxDifference,
		minDifference,
		improvementCount,
		declineCount,
	};
}


