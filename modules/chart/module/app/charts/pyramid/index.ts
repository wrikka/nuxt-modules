import type { PyramidData, ChartData } from '../../types/chart-basic';
import { getSeriesColor } from '../../utils/chart-utils';

/**
 * Pyramid chart utilities and data generation
 */

/**
 * Generate pyramid chart data from segments
 */
export function generatePyramidData(
	segments: Array<{ name: string; value: number; color?: string }>,
	options: {
		title?: string;
		orientation?: "up" | "down";
		showValues?: boolean;
		sortByValue?: boolean;
	} = {},
): PyramidData {
	const {
		title,
		orientation = "up",
		showValues = true,
		sortByValue = true,
	} = options;

	// Sort segments by value if requested
	let sortedSegments = segments;
	if (sortByValue) {
		sortedSegments = [...segments].sort((a, b) => b.value - a.value);
	}

	// Create chart data
	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Pyramid",
				data: sortedSegments.map((segment, index) => ({
					x: segment.name,
					y: segment.value,
					label: showValues ? segment.value.toString() : undefined,
					color: segment.color || getSeriesColor(index),
				})),
				type: "pyramid",
			},
		],
	};

	return {
		...chartData,
		segments: sortedSegments,
	};
}

/**
 * Generate pyramid chart from simple arrays
 */
export function generatePyramidFromArrays(
	names: string[],
	values: number[],
	options: {
		title?: string;
		colors?: string[];
		orientation?: "up" | "down";
		showValues?: boolean;
		sortByValue?: boolean;
	} = {},
): PyramidData {
	const { colors, ...otherOptions } = options;

	const segments = names.map((name, index) => ({
		name,
		value: values[index],
		color: colors?.[index],
	}));

	return generatePyramidData(segments, otherOptions);
}

/**
 * Generate population pyramid (age distribution)
 */
export function generatePopulationPyramid(
	maleData: Array<{ age: string; value: number }>,
	femaleData: Array<{ age: string; value: number }>,
	options: {
		title?: string;
		maleColor?: string;
		femaleColor?: string;
		showValues?: boolean;
	} = {},
): ChartData {
	const {
		title,
		maleColor = "#4CAF50",
		femaleColor = "#2196F3",
		showValues = false,
	} = options;

	// Reverse female data for left side
	const femaleReversed = [...femaleData].reverse();

	const series = [
		{
			name: "Male",
			data: maleData.map((item) => ({
				x: item.age,
				y: item.value,
				color: maleColor,
				label: showValues ? item.value.toString() : undefined,
			})),
			type: "pyramid" as const,
		},
		{
			name: "Female",
			data: femaleReversed.map((item) => ({
				x: item.age,
				y: -item.value, // Negative for left side
				color: femaleColor,
				label: showValues ? item.value.toString() : undefined,
			})),
			type: "pyramid" as const,
		},
	];

	return {
		title,
		series,
	};
}

/**
 * Generate organizational hierarchy pyramid
 */
export function generateOrgPyramid(
	hierarchy: Array<{
		level: string;
		count: number;
		color?: string;
	}>,
	options: {
		title?: string;
		showValues?: boolean;
	} = {},
): PyramidData {
	const { title, showValues = true } = options;

	return generatePyramidData(
		hierarchy.map((item) => ({
			name: item.level,
			value: item.count,
			color: item.color,
		})),
		{ title, showValues, sortByValue: false },
	);
}

/**
 * Calculate pyramid dimensions
 */
export function calculatePyramidDimensions(
	segments: Array<{ value: number }>,
	baseWidth: number = 200,
): Array<{ width: number; height: number; y: number }> {
	const _totalHeight = segments.length * 30; // 30px per segment
	const maxValue = Math.max(...segments.map((s) => s.value));

	return segments.map((segment, index) => {
		const width = (segment.value / maxValue) * baseWidth;
		const height = 25;
		const y = index * 30;

		return { width, height, y };
	});
}


