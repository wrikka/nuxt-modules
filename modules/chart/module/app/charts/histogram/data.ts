import type { ChartData, DataPoint, ChartSeries } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate histogram data from numeric values
 */
export function generateHistogramData(
	values: number[],
	options: {
		title?: string;
		bins?: number;
		min?: number;
		max?: number;
		seriesName?: string;
		color?: string;
		normalize?: boolean;
	} = {},
): ChartData {
	const {
		title,
		bins = 10,
		min,
		max,
		seriesName = "Frequency",
		color,
		normalize = false,
	} = options;

	const dataMin = min ?? Math.min(...values);
	const dataMax = max ?? Math.max(...values);
	const range = dataMax - dataMin;
	const binWidth = range / bins;

	const binCounts: number[] = new Array(bins).fill(0);
	const binLabels: string[] = [];

	// Calculate bin edges and counts
	for (let i = 0; i < bins; i++) {
		const binStart = dataMin + i * binWidth;
		const binEnd = dataMin + (i + 1) * binWidth;
		binLabels.push(`${binStart.toFixed(2)}-${binEnd.toFixed(2)}`);

		values.forEach((value) => {
			if (
				value >= binStart &&
				(i === bins - 1 ? value <= binEnd : value < binEnd)
			) {
				binCounts[i]++;
			}
		});
	}

	// Normalize if requested
	let finalCounts = binCounts;
	if (normalize) {
		const total = binCounts.reduce((sum, count) => sum + count, 0);
		finalCounts = binCounts.map((count) => count / total);
	}

	const data: DataPoint[] = binLabels.map((label, index) => ({
		x: label,
		y: finalCounts[index],
		color: color || getSeriesColor(0),
	}));

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "histogram",
			},
		],
	};
}

/**
 * Generate multiple histograms for comparison
 */
export function generateMultiHistogramData(
	datasets: Array<{
		name: string;
		values: number[];
		color?: string;
	}>,
	options: {
		bins?: number;
		min?: number;
		max?: number;
		normalize?: boolean;
		stacked?: boolean;
	} = {},
): ChartData {
	const { bins = 10, min, max, normalize = false, stacked = false } = options;

	// Find global min/max
	const allValues = datasets.flatMap((d) => d.values);
	const dataMin = min ?? Math.min(...allValues);
	const dataMax = max ?? Math.max(...allValues);
	const range = dataMax - dataMin;
	const binWidth = range / bins;

	const series: ChartSeries[] = [];

	datasets.forEach((dataset, datasetIndex) => {
		const binCounts: number[] = new Array(bins).fill(0);
		const binLabels: string[] = [];

		// Calculate bin edges
		for (let i = 0; i < bins; i++) {
			const binStart = dataMin + i * binWidth;
			const binEnd = dataMin + (i + 1) * binWidth;
			if (datasetIndex === 0) {
				binLabels.push(`${binStart.toFixed(2)}-${binEnd.toFixed(2)}`);
			}

			dataset.values.forEach((value) => {
				if (
					value >= binStart &&
					(i === bins - 1 ? value <= binEnd : value < binEnd)
				) {
					binCounts[i]++;
				}
			});
		}

		// Normalize if requested
		let finalCounts = binCounts;
		if (normalize) {
			const total = binCounts.reduce((sum, count) => sum + count, 0);
			finalCounts =
				total > 0 ? binCounts.map((count) => count / total) : binCounts;
		}

		const data: DataPoint[] = binLabels.map((label, index) => ({
			x: label,
			y: finalCounts[index],
			color: dataset.color || getSeriesColor(datasetIndex),
		}));

		series.push({
			name: dataset.name,
			data,
			type: "histogram",
			color: dataset.color || getSeriesColor(datasetIndex),
		});
	});

	return {
		series,
	};
}

/**
 * Generate cumulative histogram data
 */
export function generateCumulativeHistogramData(
	values: number[],
	options: {
		title?: string;
		bins?: number;
		seriesName?: string;
		color?: string;
	} = {},
): ChartData {
	const {
		title,
		bins = 10,
		seriesName = "Cumulative Frequency",
		color,
	} = options;

	const dataMin = Math.min(...values);
	const dataMax = Math.max(...values);
	const range = dataMax - dataMin;
	const binWidth = range / bins;

	const binLabels: string[] = [];
	const cumulativeCounts: number[] = [];

	let cumulative = 0;

	for (let i = 0; i < bins; i++) {
		const binStart = dataMin + i * binWidth;
		const binEnd = dataMin + (i + 1) * binWidth;
		binLabels.push(`${binStart.toFixed(2)}-${binEnd.toFixed(2)}`);

		const binCount = values.filter(
			(value) =>
				value >= binStart &&
				(i === bins - 1 ? value <= binEnd : value < binEnd),
		).length;

		cumulative += binCount;
		cumulativeCounts.push(cumulative);
	}

	const data: DataPoint[] = binLabels.map((label, index) => ({
		x: label,
		y: cumulativeCounts[index],
		color: color || getSeriesColor(0),
	}));

	return {
		title,
		series: [
			{
				name: seriesName,
				data,
				type: "histogram",
			},
		],
	};
}


