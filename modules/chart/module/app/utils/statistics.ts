/**
 * Normalize data to 0-100 range
 */
export function normalizeData(data: number[]): number[] {
	const min = Math.min(...data);
	const max = Math.max(...data);
	const range = max - min;
	return data.map((value) => (range === 0 ? 0 : ((value - min) / range) * 100));
}

/**
 * Calculate basic statistics for data
 */
export function calculateStatistics(data: number[]) {
	const sorted = [...data].sort((a, b) => a - b);
	const n = data.length;
	return {
		min: Math.min(...data),
		max: Math.max(...data),
		sum: data.reduce((a, b) => a + b, 0),
		mean: data.reduce((a, b) => a + b, 0) / n,
		median:
			n % 2 === 0
				? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
				: sorted[Math.floor(n / 2)],
		standardDeviation: Math.sqrt(
			data.reduce(
				(sum, value) =>
					sum + Math.pow(value - data.reduce((a, b) => a + b, 0) / n, 2),
				0,
			) / n,
		),
	};
}
