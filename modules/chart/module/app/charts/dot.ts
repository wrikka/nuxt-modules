import type { DotData, ChartData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Dot plot utilities - Cleveland dot plot for single values
 */

/**
 * Generate dot plot data
 */
export function generateDotData(
	dots: Array<{
		category: string;
		value: number;
		color?: string;
		size?: number;
		label?: string;
		group?: string;
	}>,
	options: {
		title?: string;
		orientation?: "horizontal" | "vertical";
		showValues?: boolean;
		showGrid?: boolean;
		sortByValue?: boolean;
		sortOrder?: "asc" | "desc";
		dotSize?: number;
		showConnectingLines?: boolean;
		lineColor?: string;
	} = {},
): DotData {
	const {
		title,
		orientation = "horizontal",
		showValues = true,
		showGrid = true,
		sortByValue = false,
		sortOrder = "desc",
		dotSize = 8,
		showConnectingLines = false,
		lineColor = "#ccc",
	} = options;

	// Sort dots if requested
	let sortedDots = dots;
	if (sortByValue) {
		sortedDots = [...dots].sort((a, b) => {
			const comparison = a.value - b.value;
			return sortOrder === "desc" ? -comparison : comparison;
		});
	}

	// Create data points
	const dataPoints: DataPoint[] = sortedDots.map((dot, index) => ({
		x: dot.category,
		y: dot.value,
		label: showValues ? dot.label || dot.value.toString() : undefined,
		color: dot.color || getSeriesColor(index),
		size: dot.size || dotSize,
	}));

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Dot Plot",
				data: dataPoints,
				type: "dot",
			},
		],
		orientation,
	};

	// Add connecting line series if requested
	if (showConnectingLines && sortedDots.length > 1) {
		const lineSeries = {
			name: "Connecting Lines",
			data: sortedDots.map((dot, index) => ({
				x: dot.category,
				y: dot.value,
				color: lineColor,
			})),
			type: "line",
		};
		chartData.series.push(lineSeries);
	}

	return {
		...chartData,
		dots: sortedDots,
	};
}

/**
 * Generate dot plot from arrays
 */
export function generateDotFromArrays(
	categories: string[],
	values: number[],
	options: {
		title?: string;
		colors?: string[];
		sizes?: number[];
		labels?: string[];
		groups?: string[];
	} = {},
): DotData {
	const { colors, sizes, labels, groups, ...otherOptions } = options;

	const dots = categories.map((category, index) => ({
		category,
		value: values[index],
		color: colors?.[index],
		size: sizes?.[index],
		label: labels?.[index],
		group: groups?.[index],
	}));

	return generateDotData(dots, otherOptions);
}

/**
 * Generate comparison dot plot (multiple series)
 */
export function generateComparisonDotData(
	series: Array<{
		name: string;
		data: Array<{
			category: string;
			value: number;
			color?: string;
			size?: number;
		}>;
		color?: string;
	}>,
	options: {
		title?: string;
		orientation?: "horizontal" | "vertical";
		showLegend?: boolean;
		connectWithinSeries?: boolean;
		connectBetweenSeries?: boolean;
	} = {},
): DotData {
	const {
		title,
		orientation = "horizontal",
		showLegend = true,
		connectWithinSeries = false,
		connectBetweenSeries = false,
	} = options;

	// Create combined data structure
	const allDots: Array<{
		category: string;
		value: number;
		color?: string;
		size?: number;
		seriesName: string;
	}> = [];

	series.forEach((s, seriesIndex) => {
		s.data.forEach((point, pointIndex) => {
			allDots.push({
				category: point.category,
				value: point.value,
				color: point.color || s.color || getSeriesColor(seriesIndex),
				size: point.size || 6,
				seriesName: s.name,
			});
		});
	});

	// Group by category for multi-series display
	const categoryGroups = new Map<
		string,
		Array<{
			category: string;
			value: number;
			color: string;
			size: number;
			seriesName: string;
		}>
	>();

	allDots.forEach((dot) => {
		if (!categoryGroups.has(dot.category)) {
			categoryGroups.set(dot.category, []);
		}
		categoryGroups.get(dot.category)!.push(dot);
	});

	// Create series for each comparison group
	const chartSeries = Array.from(categoryGroups.entries()).map(
		([category, dots]) => ({
			name: category,
			data: dots.map((dot, index) => ({
				x: `${category}-${dot.seriesName}`,
				y: dot.value,
				label: dot.value.toString(),
				color: dot.color,
				size: dot.size,
			})),
			type: "dot" as const,
		}),
	);

	const chartData: ChartData = {
		title,
		series: chartSeries,
		orientation,
	};

	return {
		...chartData,
		dots: allDots,
	};
}

/**
 * Generate ranked dot plot
 */
export function generateRankedDotData(
	data: Array<{ name: string; value: number; color?: string; group?: string }>,
	options: {
		title?: string;
		maxItems?: number;
		showRankNumbers?: boolean;
		sortOrder?: "asc" | "desc";
		colorByGroup?: boolean;
	} = {},
): DotData {
	const {
		title,
		maxItems,
		showRankNumbers = true,
		sortOrder = "desc",
		colorByGroup = false,
	} = options;

	// Sort by value
	const sortedData = [...data].sort((a, b) => {
		const comparison = a.value - b.value;
		return sortOrder === "desc" ? -comparison : comparison;
	});

	// Limit items if specified
	const limitedData = maxItems ? sortedData.slice(0, maxItems) : sortedData;

	// Assign colors based on groups if requested
	const groupColors = new Map<string, string>();
	let colorIndex = 0;

	const dots = limitedData.map((item, index) => {
		let color = item.color;

		if (colorByGroup && item.group) {
			if (!groupColors.has(item.group)) {
				groupColors.set(item.group, getSeriesColor(colorIndex++));
			}
			color = groupColors.get(item.group);
		} else if (!color) {
			color = getSeriesColor(index);
		}

		const displayName = showRankNumbers
			? `${index + 1}. ${item.name}`
			: item.name;

		return {
			category: displayName,
			value: item.value,
			color,
			label: item.value.toString(),
			group: item.group,
		};
	});

	return generateDotData(dots, {
		title,
		orientation: "horizontal",
		showValues: true,
		sortByValue: false, // already sorted
	});
}

/**
 * Generate Likert scale dot plot
 */
export function generateLikertDotData(
	responses: Array<{
		statement: string;
		stronglyDisagree: number;
		disagree: number;
		neutral: number;
		agree: number;
		stronglyAgree: number;
	}>,
	options: {
		title?: string;
		colors?: {
			stronglyDisagree: string;
			disagree: string;
			neutral: string;
			agree: string;
			stronglyAgree: string;
		};
		showPercentages?: boolean;
	} = {},
): ChartData {
	const {
		title,
		colors = {
			stronglyDisagree: "#e74c3c",
			disagree: "#f39c12",
			neutral: "#95a5a6",
			agree: "#27ae60",
			stronglyAgree: "#2ecc71",
		},
		showPercentages = true,
	} = options;

	const series = responses.map((response, index) => {
		const categories = [
			"Strongly Disagree",
			"Disagree",
			"Neutral",
			"Agree",
			"Strongly Agree",
		];
		const values = [
			response.stronglyDisagree,
			response.disagree,
			response.neutral,
			response.agree,
			response.stronglyAgree,
		];

		return {
			name: response.statement,
			data: categories.map((category, catIndex) => ({
				x: category,
				y: values[catIndex],
				label: showPercentages
					? `${values[catIndex]}%`
					: values[catIndex].toString(),
				color:
					colors[
						categories[catIndex]
							.toLowerCase()
							.replace(" ", "") as keyof typeof colors
					],
			})),
			type: "dot" as const,
		};
	});

	return {
		title: title || "Likert Scale Responses",
		series,
	};
}

/**
 * Calculate dot plot statistics
 */
export function calculateDotStatistics(dots: Array<{ value: number }>): {
	totalDots: number;
	mean: number;
	median: number;
	mode: number[];
	range: number;
	standardDeviation: number;
	quartiles: { q1: number; q3: number };
	outliers: { low: number[]; high: number[] };
} {
	if (dots.length === 0) {
		return {
			totalDots: 0,
			mean: 0,
			median: 0,
			mode: [],
			range: 0,
			standardDeviation: 0,
			quartiles: { q1: 0, q3: 0 },
			outliers: { low: [], high: [] },
		};
	}

	const values = dots.map((d) => d.value).sort((a, b) => a - b);
	const n = values.length;

	const mean = values.reduce((sum, val) => sum + val, 0) / n;
	const median =
		n % 2 === 0
			? (values[n / 2 - 1] + values[n / 2]) / 2
			: values[Math.floor(n / 2)];

	// Calculate mode
	const frequency = new Map<number, number>();
	values.forEach((val) => frequency.set(val, (frequency.get(val) || 0) + 1));
	const maxFreq = Math.max(...frequency.values());
	const mode = Array.from(frequency.entries())
		.filter(([_, freq]) => freq === maxFreq)
		.map(([val, _]) => val);

	const range = values[n - 1] - values[0];

	const variance =
		values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
	const standardDeviation = Math.sqrt(variance);

	// Calculate quartiles
	const q1Index = Math.floor(n / 4);
	const q3Index = Math.floor((3 * n) / 4);
	const q1 = values[q1Index];
	const q3 = values[q3Index];

	// Identify outliers (1.5 * IQR rule)
	const iqr = q3 - q1;
	const lowerFence = q1 - 1.5 * iqr;
	const upperFence = q3 + 1.5 * iqr;
	const outliers = {
		low: values.filter((val) => val < lowerFence),
		high: values.filter((val) => val > upperFence),
	};

	return {
		totalDots: n,
		mean,
		median,
		mode,
		range,
		standardDeviation,
		quartiles: { q1, q3 },
		outliers,
	};
}


