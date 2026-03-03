import type { ChartSeries, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Get color for comparison series
 */
export function getComparisonColor(chartIndex: number, seriesIndex: number): string {
	const colors = [
		"#4a90e2",
		"#7ed321",
		"#f5a623",
		"#d0021b",
		"#9013fe",
		"#50e3c2",
		"#b8e986",
		"#f8e71c",
		"#ff6b6b",
		"#bd10e0",
	];
	return colors[(chartIndex * 2 + seriesIndex) % colors.length];
}

/**
 * Get color for difference series
 */
export function getDifferenceColor(index: number): string {
	const colors = ["#ff6b6b", "#4a90e2", "#7ed321", "#f5a623", "#d0021b"];
	return colors[index % colors.length];
}

/**
 * Get color for ratio series
 */
export function getRatioColor(index: number): string {
	const colors = ["#50e3c2", "#b8e986", "#f8e71c", "#bd10e0", "#9013fe"];
	return colors[index % colors.length];
}

/**
 * Calculate correlation between two data series
 */
export function calculateCorrelation(
	data1: DataPoint[],
	data2: DataPoint[],
	method: "pearson" | "spearman",
): number {
	if (data1.length !== data2.length || data1.length < 2) return 0;

	const values1 = data1.map((p) => (typeof p.y === "number" ? p.y : 0));
	const values2 = data2.map((p) => (typeof p.y === "number" ? p.y : 0));

	if (method === "spearman") {
		// Convert to ranks
		const ranked1 = getRanks(values1);
		const ranked2 = getRanks(values2);
		return pearsonCorrelation(ranked1, ranked2);
	}

	return pearsonCorrelation(values1, values2);
}

/**
 * Calculate Pearson correlation coefficient
 */
function pearsonCorrelation(values1: number[], values2: number[]): number {
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

/**
 * Get ranks for values (for Spearman correlation)
 */
function getRanks(values: number[]): number[] {
	const sorted = [...values].sort((a, b) => a - b);
	return values.map((v) => sorted.indexOf(v) + 1);
}

/**
 * Calculate comparison statistics
 */
export function calculateComparisonStatistics(
	series: ChartSeries[],
	correlations: Record<string, number>,
): {
	maxDifference: number;
	avgDifference: number;
	correlationStrength: "weak" | "moderate" | "strong" | "very-strong";
} {
	let maxDifference = 0;
	let totalDifference = 0;
	let differenceCount = 0;

	series.forEach((s) => {
		s.data.forEach((point) => {
			if (typeof point.y === "number") {
				const absValue = Math.abs(point.y);
				maxDifference = Math.max(maxDifference, absValue);
				totalDifference += absValue;
				differenceCount++;
			}
		});
	});

	const avgDifference =
		differenceCount > 0 ? totalDifference / differenceCount : 0;

	// Calculate average correlation strength
	const correlationValues = Object.values(correlations);
	const avgCorrelation =
		correlationValues.length > 0
			? correlationValues.reduce((a, b) => a + b, 0) / correlationValues.length
			: 0;

	let correlationStrength: "weak" | "moderate" | "strong" | "very-strong" =
		"weak";
	if (Math.abs(avgCorrelation) >= 0.8) correlationStrength = "very-strong";
	else if (Math.abs(avgCorrelation) >= 0.6) correlationStrength = "strong";
	else if (Math.abs(avgCorrelation) >= 0.3) correlationStrength = "moderate";

	return {
		maxDifference,
		avgDifference,
		correlationStrength,
	};
}
