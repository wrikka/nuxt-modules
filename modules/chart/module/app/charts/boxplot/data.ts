import type { ChartData, ChartSeries } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { calculateBoxplotStatistics } from './boxplot-calculations';

/**
 * Generate box plot data from datasets
 */
export function generateBoxplotData(
	datasets: Array<{
		name: string;
		values: number[];
		color?: string;
	}>,
	options: {
		title?: string;
		showOutliers?: boolean;
	} = {},
): ChartData {
	const { title, showOutliers = true } = options;

	const series: ChartSeries[] = datasets.map((dataset, index) => {
		const stats = calculateBoxplotStatistics(dataset.values);
		const data: any[] = [];

		// Add main box plot point (could represent median or full box data)
		data.push({
			x: dataset.name,
			y: stats.median,
			label: `Median: ${stats.median.toFixed(2)}`,
			color: dataset.color || getSeriesColor(index),
		});

		// Add additional points for quartiles if needed
		if (showOutliers && stats.outliers.length > 0) {
			stats.outliers.forEach((outlier) => {
				data.push({
					x: dataset.name,
					y: outlier,
					label: `Outlier: ${outlier.toFixed(2)}`,
					color: "#FF0000", // Red for outliers
				});
			});
		}

		return {
			name: dataset.name,
			data,
			type: "boxplot",
			color: dataset.color || getSeriesColor(index),
		};
	});

	return {
		title,
		series,
	};
}

/**
 * Generate comparative box plot data
 */
export function generateComparativeBoxplotData(
	categories: string[],
	datasets: Array<{
		name: string;
		values: Array<number[]>;
		color?: string;
	}>,
): ChartData {
	const series: ChartSeries[] = [];

	datasets.forEach((dataset, datasetIndex) => {
		dataset.values.forEach((values, categoryIndex) => {
			const stats = calculateBoxplotStatistics(values);

			series.push({
				name: `${dataset.name} - ${categories[categoryIndex]}`,
				data: [
					{
						x: categories[categoryIndex],
						y: stats.median,
						label: `Median: ${stats.median.toFixed(2)}`,
						color: dataset.color || getSeriesColor(datasetIndex),
					},
				],
				type: "boxplot",
				color: dataset.color || getSeriesColor(datasetIndex),
			});
		});
	});

	return {
		series,
	};
}

/**
 * Generate notched box plot data (for confidence intervals)
 */
export function generateNotchedBoxplotData(
	datasets: Array<{
		name: string;
		values: number[];
		color?: string;
	}>,
	options: {
		title?: string;
		notchSize?: number;
	} = {},
): ChartData {
	const { title, notchSize = 1.58 } = options; // 1.58 ≈ t(0.95, ∞)

	const series: ChartSeries[] = datasets.map((dataset, index) => {
		const n = dataset.values.length;
		const stats = calculateBoxplotStatistics(dataset.values);

		// Calculate notch size (confidence interval for median)
		const medianCI = (notchSize * stats.iqr) / Math.sqrt(n);
		const notchUpper = Math.min(stats.q3, stats.median + medianCI);
		const notchLower = Math.max(stats.q1, stats.median - medianCI);

		const data: any[] = [
			{
				x: dataset.name,
				y: stats.median,
				label: `Median: ${stats.median.toFixed(2)} (${notchLower.toFixed(2)} - ${notchUpper.toFixed(2)})`,
				color: dataset.color || getSeriesColor(index),
			},
		];

		return {
			name: dataset.name,
			data,
			type: "boxplot",
			color: dataset.color || getSeriesColor(index),
		};
	});

	return {
		title,
		series,
	};
}

/**
 * Generate box plot from grouped data
 */
export function generateGroupedBoxplotData(
	groups: Array<{
		groupName: string;
		datasets: Array<{
			name: string;
			values: number[];
			color?: string;
		}>;
	}>,
): ChartData {
	const series: ChartSeries[] = [];

	groups.forEach((group) => {
		group.datasets.forEach((dataset, datasetIndex) => {
			const stats = calculateBoxplotStatistics(dataset.values);

			series.push({
				name: `${group.groupName} - ${dataset.name}`,
				data: [
					{
						x: group.groupName,
						y: stats.median,
						label: `Median: ${stats.median.toFixed(2)}`,
						color: dataset.color || getSeriesColor(datasetIndex),
					},
				],
				type: "boxplot",
				color: dataset.color || getSeriesColor(datasetIndex),
			});
		});
	});

	return {
		series,
	};
}


