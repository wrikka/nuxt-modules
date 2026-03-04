/**
 * Calculate skewness of a dataset
 */
export function calculateSkewness(values: number[], mean: number): number {
	const n = values.length;
	const std = Math.sqrt(
		values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / n,
	);
	if (std === 0) return 0;
	return (
		values.reduce((sum, value) => sum + Math.pow((value - mean) / std, 3), 0) /
		n
	);
}

/**
 * Calculate kurtosis of a dataset
 */
export function calculateKurtosis(values: number[], mean: number): number {
	const n = values.length;
	const std = Math.sqrt(
		values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / n,
	);
	if (std === 0) return 0;
	return (
		values.reduce((sum, value) => sum + Math.pow((value - mean) / std, 4), 0) /
			n -
		3
	);
}

/**
 * Calculate Pearson correlation coefficient between two datasets
 */
export function calculateCorrelation(
	values1: number[],
	values2: number[],
): number {
	const n = values1.length;
	const sum1 = values1.reduce((a, b) => a + b, 0);
	const sum2 = values2.reduce((a, b) => a + b, 0);
	const sum1Sq = values1.reduce((a, b) => a + b * b, 0);
	const sum2Sq = values2.reduce((a, b) => a + b * b, 0);
	const sumProd = values1.reduce((a, b, i) => a + b * values2[i], 0);

	const numerator = n * sumProd - sum1 * sum2;
	const denominator = Math.sqrt(
		(n * sum1Sq - sum1 * sum1) * (n * sum2Sq - sum2 * sum2),
	);

	return denominator === 0 ? 0 : numerator / denominator;
}
