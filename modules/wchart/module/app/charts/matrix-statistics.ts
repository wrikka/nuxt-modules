/**
 * Calculate matrix statistics
 */
export function calculateMatrixStatistics(values: number[][]): {
	dimensions: { rows: number; columns: number };
	statistics: {
		min: number;
		max: number;
		mean: number;
		median: number;
		standardDeviation: number;
		zeros: number;
		sparsity: number;
	};
	distribution: {
		histogram: Array<{ range: string; count: number }>;
		quartiles: { q1: number; q2: number; q3: number };
	};
	structure: {
		isSymmetric: boolean;
		bandwidth: number;
		conditionNumber: number;
	};
} {
	const rows = values.length;
	const columns = values[0]?.length || 0;
	const allValues = values.flat();

	const min = Math.min(...allValues);
	const max = Math.max(...allValues);
	const mean = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
	const sortedValues = [...allValues].sort((a, b) => a - b);
	const median = sortedValues[Math.floor(sortedValues.length / 2)];

	const variance =
		allValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
		allValues.length;
	const standardDeviation = Math.sqrt(variance);

	const zeros = allValues.filter((val) => val === 0).length;
	const sparsity = zeros / allValues.length;

	// Create histogram
	const binCount = 10;
	const binSize = (max - min) / binCount;
	const histogram = Array.from({ length: binCount }, (_, i) => {
		const binMin = min + i * binSize;
		const binMax = min + (i + 1) * binSize;
		const count = allValues.filter(
			(val) => val >= binMin && val < binMax,
		).length;
		return {
			range: `${binMin.toFixed(2)}-${binMax.toFixed(2)}`,
			count,
		};
	});

	const q1 = sortedValues[Math.floor(sortedValues.length / 4)];
	const q3 = sortedValues[Math.floor((3 * sortedValues.length) / 4)];

	// Check symmetry
	let isSymmetric = rows === columns;
	if (isSymmetric) {
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				if (Math.abs(values[i][j] - values[j][i]) > 1e-10) {
					isSymmetric = false;
					break;
				}
			}
			if (!isSymmetric) break;
		}
	}

	// Calculate bandwidth (simplified)
	let bandwidth = 0;
	if (rows === columns) {
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				if (values[i][j] !== 0) {
					bandwidth = Math.max(bandwidth, Math.abs(i - j));
				}
			}
		}
	}

	// Simplified condition number (would need proper linear algebra)
	const conditionNumber = max > 0 ? max / Math.max(min, 1e-10) : 0;

	return {
		dimensions: { rows, columns },
		statistics: {
			min,
			max,
			mean,
			median,
			standardDeviation,
			zeros,
			sparsity,
		},
		distribution: {
			histogram,
			quartiles: { q1, q2: median, q3 },
		},
		structure: {
			isSymmetric,
			bandwidth,
			conditionNumber,
		},
	};
}


