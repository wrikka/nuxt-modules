import type { ParetoData, ChartData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Pareto chart utilities - 80/20 rule visualization with cumulative percentages
 */

/**
 * Generate Pareto chart data
 */
export function generateParetoData(
	data: Array<{ category: string; value: number; color?: string }>,
	options: {
		title?: string;
		sortByValue?: boolean;
		sortOrder?: "asc" | "desc";
		showCumulativeLine?: boolean;
		cumulativeLineColor?: string;
		showParetoLine?: boolean;
		paretoThreshold?: number; // 80% by default
		showPercentages?: boolean;
	} = {},
): ParetoData {
	const {
		title,
		sortByValue = true,
		sortOrder = "desc",
		showCumulativeLine = true,
		cumulativeLineColor = "#ff6b6b",
		showParetoLine = true,
		paretoThreshold = 80,
		showPercentages = true,
	} = options;

	// Sort data if requested
	let sortedData = data;
	if (sortByValue) {
		sortedData = [...data].sort((a, b) => {
			const comparison = a.value - b.value;
			return sortOrder === "desc" ? -comparison : comparison;
		});
	}

	// Calculate total and cumulative values
	const total = sortedData.reduce((sum, item) => sum + item.value, 0);
	let cumulativeSum = 0;
	let cumulativePercentage = 0;

	const processedData = sortedData.map((item, index) => {
		cumulativeSum += item.value;
		const previousCumulative = cumulativePercentage;
		cumulativePercentage = (cumulativeSum / total) * 100;

		return {
			...item,
			cumulativeValue: cumulativeSum,
			cumulativePercentage,
			individualPercentage: (item.value / total) * 100,
			color: item.color || getSeriesColor(index),
			rank: index + 1,
		};
	});

	// Create bar series (individual values)
	const barSeries = {
		name: "Individual Values",
		data: processedData.map((item) => ({
			x: item.category,
			y: item.value,
			label: showPercentages
				? `${item.value.toFixed(1)} (${item.individualPercentage.toFixed(1)}%)`
				: item.value.toString(),
			color: item.color,
		})),
		type: "bar" as const,
	};

	// Create cumulative line series
	const cumulativeSeries = showCumulativeLine
		? {
				name: "Cumulative Percentage",
				data: processedData.map((item) => ({
					x: item.category,
					y: item.cumulativePercentage,
					label: showPercentages
						? `${item.cumulativePercentage.toFixed(1)}%`
						: undefined,
					color: cumulativeLineColor,
				})),
				type: "line" as const,
			}
		: null;

	// Find Pareto point (where cumulative reaches threshold)
	const paretoPoint = showParetoLine
		? processedData.findIndex(
				(item) => item.cumulativePercentage >= paretoThreshold,
			)
		: -1;

	const chartData: ChartData = {
		title,
		series: cumulativeSeries ? [barSeries, cumulativeSeries] : [barSeries],
	};

	return {
		...chartData,
		cumulativeLine: showCumulativeLine,
	};
}

/**
 * Generate Pareto chart from arrays
 */
export function generateParetoFromArrays(
	categories: string[],
	values: number[],
	options: {
		title?: string;
		colors?: string[];
		sortByValue?: boolean;
		sortOrder?: "asc" | "desc";
		showCumulativeLine?: boolean;
		cumulativeLineColor?: string;
		showParetoLine?: boolean;
		paretoThreshold?: number;
		showPercentages?: boolean;
	} = {},
): ParetoData {
	const { colors, ...otherOptions } = options;

	const data = categories.map((category, index) => ({
		category,
		value: values[index],
		color: colors?.[index],
	}));

	return generateParetoData(data, otherOptions);
}

/**
 * Calculate Pareto analysis statistics
 */
export function calculateParetoStatistics(
	data: Array<{ category: string; value: number }>,
): {
	totalItems: number;
	totalValue: number;
	paretoItems: number;
	paretoValue: number;
	paretoPercentage: number;
	paretoItemPercentage: number;
} {
	const sortedData = [...data].sort((a, b) => b.value - a.value);
	const totalValue = sortedData.reduce((sum, item) => sum + item.value, 0);

	let cumulativeSum = 0;
	let paretoItems = 0;
	let paretoValue = 0;

	for (let i = 0; i < sortedData.length; i++) {
		cumulativeSum += sortedData[i].value;
		const cumulativePercentage = (cumulativeSum / totalValue) * 100;

		if (cumulativePercentage <= 80) {
			paretoItems = i + 1;
			paretoValue = cumulativeSum;
		} else {
			break;
		}
	}

	return {
		totalItems: data.length,
		totalValue,
		paretoItems,
		paretoValue,
		paretoPercentage: (paretoValue / totalValue) * 100,
		paretoItemPercentage: (paretoItems / data.length) * 100,
	};
}

/**
 * Generate ABC analysis (extension of Pareto for inventory management)
 */
export function generateABCAnalysis(
	data: Array<{ category: string; value: number }>,
	options: {
		title?: string;
		aThreshold?: number; // 80%
		bThreshold?: number; // 95%
		colors?: { a: string; b: string; c: string };
	} = {},
): ParetoData {
	const {
		title = "ABC Analysis",
		aThreshold = 80,
		bThreshold = 95,
		colors = { a: "#4CAF50", b: "#FF9800", c: "#F44336" },
	} = options;

	const sortedData = [...data].sort((a, b) => b.value - a.value);
	const total = sortedData.reduce((sum, item) => sum + item.value, 0);

	let cumulativeSum = 0;
	const categorizedData = sortedData.map((item, index) => {
		cumulativeSum += item.value;
		const cumulativePercentage = (cumulativeSum / total) * 100;

		let category: "A" | "B" | "C";
		let color: string;

		if (cumulativePercentage <= aThreshold) {
			category = "A";
			color = colors.a;
		} else if (cumulativePercentage <= bThreshold) {
			category = "B";
			color = colors.b;
		} else {
			category = "C";
			color = colors.c;
		}

		return {
			category: `${category}: ${item.category}`,
			value: item.value,
			color,
			abcCategory: category,
		};
	});

	return generateParetoData(categorizedData, {
		title,
		showCumulativeLine: true,
		showParetoLine: false,
	});
}


