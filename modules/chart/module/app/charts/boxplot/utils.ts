import { calculateBoxplotStatistics } from './boxplot-calculations';

/**
 * Normalize box plot data to 0-1 range
 */
export function normalizeBoxplotData(
	datasets: Array<{
		name: string;
		values: number[];
	}>,
): Array<{
	name: string;
	values: number[];
	originalMin: number;
	originalMax: number;
}> {
	// Find global min and max
	const allValues = datasets.flatMap((d) => d.values);
	const globalMin = Math.min(...allValues);
	const globalMax = Math.max(...allValues);
	const range = globalMax - globalMin;

	return datasets.map((dataset) => ({
		name: dataset.name,
		values: dataset.values.map((val) =>
			range === 0 ? 0 : (val - globalMin) / range,
		),
		originalMin: globalMin,
		originalMax: globalMax,
	}));
}

/**
 * Detect outliers in multiple datasets
 */
export function detectOutliersInMultipleDatasets(
	datasets: Array<{
		name: string;
		values: number[];
	}>,
): Array<{
	datasetName: string;
	outliers: number[];
	outlierIndices: number[];
}> {
	return datasets.map((dataset) => {
		const stats = calculateBoxplotStatistics(dataset.values);
		const outlierIndices: number[] = [];

		dataset.values.forEach((value, index) => {
			if (stats.outliers.includes(value)) {
				outlierIndices.push(index);
			}
		});

		return {
			datasetName: dataset.name,
			outliers: stats.outliers,
			outlierIndices,
		};
	});
}

/**
 * Compare box plot distributions statistically
 */
export function compareBoxplotDistributions(
	dataset1: { name: string; values: number[] },
	dataset2: { name: string; values: number[] },
): {
	dataset1Stats: ReturnType<typeof calculateBoxplotStatistics>;
	dataset2Stats: ReturnType<typeof calculateBoxplotStatistics>;
	differences: {
		medianDiff: number;
		iqrDiff: number;
		rangeDiff: number;
	};
	similarity: number; // 0-1 scale, higher = more similar
} {
	const dataset1Stats = calculateBoxplotStatistics(dataset1.values);
	const dataset2Stats = calculateBoxplotStatistics(dataset2.values);

	const differences = {
		medianDiff: Math.abs(dataset1Stats.median - dataset2Stats.median),
		iqrDiff: Math.abs(dataset1Stats.iqr - dataset2Stats.iqr),
		rangeDiff: Math.abs(
			dataset1Stats.max -
				dataset1Stats.min -
				(dataset2Stats.max - dataset2Stats.min),
		),
	};

	// Simple similarity score based on overlapping ranges
	const range1 = dataset1Stats.max - dataset1Stats.min;
	const range2 = dataset2Stats.max - dataset2Stats.min;
	const overlap = Math.max(
		0,
		Math.min(dataset1Stats.max, dataset2Stats.max) -
			Math.max(dataset1Stats.min, dataset2Stats.min),
	);
	const union =
		Math.max(dataset1Stats.max, dataset2Stats.max) -
		Math.min(dataset1Stats.min, dataset2Stats.min);

	const similarity = union === 0 ? 1 : overlap / union;

	return {
		dataset1Stats,
		dataset2Stats,
		differences,
		similarity,
	};
}


