import type { ParallelCoordinatesData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate parallel coordinates data
 */
export function generateParallelCoordinatesData(
	dimensions: string[],
	data: Array<Record<string, number>>,
	options: {
		title?: string;
		colorBy?: string;
		normalize?: boolean;
		showAxes?: boolean;
		lineWidth?: number;
		opacity?: number;
		colors?: string[];
	} = {},
): ParallelCoordinatesData {
	const {
		title,
		colorBy,
		normalize = false,
		showAxes = true,
		lineWidth = 1,
		opacity = 0.7,
		colors,
	} = options;

	// Normalize data if requested
	let processedData = data;
	let dimensionRanges: Record<string, { min: number; max: number }> | undefined;

	if (normalize) {
		dimensionRanges = {};
		dimensions.forEach((dim) => {
			const values = data
				.map((record) => record[dim])
				.filter((val) => !isNaN(val));
			dimensionRanges![dim] = {
				min: Math.min(...values),
				max: Math.max(...values),
			};
		});

		processedData = data.map((record) => {
			const normalized: Record<string, number> = {};
			dimensions.forEach((dim) => {
				const range = dimensionRanges![dim];
				const value = record[dim];
				normalized[dim] =
					range.max !== range.min
						? (value - range.min) / (range.max - range.min)
						: 0.5; // Default to middle if no range
			});
			return normalized;
		});
	}

	return {
		title: title || "Parallel Coordinates",
		dimensions,
		data: processedData,
		series: [], // ParallelCoordinatesData extends ChartData but series is optional
	};
}

/**
 * Generate parallel coordinates from arrays
 */
export function generateParallelCoordinatesFromArrays(
	dimensionNames: string[],
	datasets: Array<number[]>,
	options: {
		title?: string;
		normalize?: boolean;
	} = {},
): ParallelCoordinatesData {
	// Convert arrays to records
	const data: Array<Record<string, number>> = [];
	const maxLength = Math.max(...datasets.map((arr) => arr.length));

	for (let i = 0; i < maxLength; i++) {
		const record: Record<string, number> = {};
		dimensionNames.forEach((name, j) => {
			record[name] = datasets[j][i] || 0;
		});
		data.push(record);
	}

	return generateParallelCoordinatesData(dimensionNames, data, options);
}

/**
 * Generate clustered parallel coordinates
 */
export function generateClusteredParallelCoordinates(
	dimensions: string[],
	data: Array<Record<string, number> & { cluster?: string }>,
	options: {
		title?: string;
		normalize?: boolean;
		colors?: Record<string, string>;
	} = {},
): ChartData {
	const { title, normalize = true, colors = {} } = options;

	// Group data by clusters
	const clusters = new Map<string, Array<Record<string, number>>>();

	data.forEach((record) => {
		const cluster = record.cluster || "default";
		if (!clusters.has(cluster)) {
			clusters.set(cluster, []);
		}
		clusters.get(cluster)!.push(record);
	});

	// Create series for each cluster
	const series = Array.from(clusters.entries()).map(
		([clusterName, clusterData], index) => ({
			name: clusterName,
			data: clusterData.map((record) => {
				const point: Record<string, number> = {};
				dimensions.forEach((dim) => {
					point[dim] = record[dim];
				});
				return point;
			}),
			type: "parallelCoordinates" as const,
			color: colors[clusterName] || getSeriesColor(index),
		}),
	);

	return {
		title: title || "Clustered Parallel Coordinates",
		series,
	};
}

/**
 * Filter parallel coordinates data
 */
export function filterParallelCoordinatesData(
	dimensions: string[],
	data: Array<Record<string, number>>,
	filters: Array<{
		dimension: string;
		min?: number;
		max?: number;
	}>,
	options: {
		title?: string;
	} = {},
): ParallelCoordinatesData {
	// Apply filters
	let filteredData = data;

	filters.forEach((filter) => {
		if (filter.min !== undefined || filter.max !== undefined) {
			filteredData = filteredData.filter((record) => {
				const value = record[filter.dimension];
				if (filter.min !== undefined && value < filter.min) return false;
				if (filter.max !== undefined && value > filter.max) return false;
				return true;
			});
		}
	});

	return generateParallelCoordinatesData(dimensions, filteredData, options);
}


