import type { ScatterMatrixData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Scatter matrix utilities - correlation matrix visualization
 */

/**
 * Generate scatter matrix data
 */
export function generateScatterMatrixData(
	variables: string[],
	data: Array<Record<string, number>>,
	options: {
		title?: string;
		showCorrelations?: boolean;
		correlationMethod?: "pearson" | "spearman";
		showHistograms?: boolean;
		pointSize?: number;
		colors?: string[];
	} = {},
): ScatterMatrixData {
	const {
		title,
		showCorrelations = true,
		correlationMethod = "pearson",
		showHistograms = false,
		pointSize = 4,
		colors,
	} = options;

	// Calculate correlations if requested
	let correlations: Array<Array<number>> | undefined;

	if (showCorrelations) {
		correlations = calculateCorrelations(variables, data, correlationMethod);
	}

	return {
		title: title || "Scatter Matrix",
		variables,
		data,
		correlations,
	};
}

/**
 * Generate scatter matrix from arrays
 */
export function generateScatterMatrixFromArrays(
	variableNames: string[],
	datasets: Array<number[]>,
	options: {
		title?: string;
		showCorrelations?: boolean;
	} = {},
): ScatterMatrixData {
	// Convert arrays to records
	const data: Array<Record<string, number>> = [];
	const maxLength = Math.max(...datasets.map((arr) => arr.length));

	for (let i = 0; i < maxLength; i++) {
		const record: Record<string, number> = {};
		variableNames.forEach((name, j) => {
			record[name] = datasets[j][i] || 0;
		});
		data.push(record);
	}

	return generateScatterMatrixData(variableNames, data, options);
}

/**
 * Calculate correlations between variables
 */
function calculateCorrelations(
	variables: string[],
	data: Array<Record<string, number>>,
	method: "pearson" | "spearman" = "pearson",
): Array<Array<number>> {
	const n = variables.length;
	const correlations: Array<Array<number>> = [];

	for (let i = 0; i < n; i++) {
		correlations[i] = [];
		for (let j = 0; j < n; j++) {
			if (i === j) {
				correlations[i][j] = 1; // Perfect correlation with itself
			} else {
				const values1 = data.map((record) => record[variables[i]]);
				const values2 = data.map((record) => record[variables[j]]);
				correlations[i][j] = calculateCorrelation(values1, values2, method);
			}
		}
	}

	return correlations;
}

/**
 * Calculate correlation between two arrays
 */
function calculateCorrelation(
	array1: number[],
	array2: number[],
	method: "pearson" | "spearman" = "pearson",
): number {
	if (array1.length !== array2.length || array1.length < 2) {
		return 0;
	}

	if (method === "spearman") {
		// Convert to ranks
		const ranked1 = getRanks(array1);
		const ranked2 = getRanks(array2);
		return calculatePearsonCorrelation(ranked1, ranked2);
	} else {
		return calculatePearsonCorrelation(array1, array2);
	}
}

/**
 * Calculate Pearson correlation coefficient
 */
function calculatePearsonCorrelation(
	array1: number[],
	array2: number[],
): number {
	const n = array1.length;

	// Calculate means
	const mean1 = array1.reduce((sum, val) => sum + val, 0) / n;
	const mean2 = array2.reduce((sum, val) => sum + val, 0) / n;

	// Calculate covariance and variances
	let covariance = 0;
	let variance1 = 0;
	let variance2 = 0;

	for (let i = 0; i < n; i++) {
		const diff1 = array1[i] - mean1;
		const diff2 = array2[i] - mean2;

		covariance += diff1 * diff2;
		variance1 += diff1 * diff1;
		variance2 += diff2 * diff2;
	}

	const std1 = Math.sqrt(variance1);
	const std2 = Math.sqrt(variance2);

	if (std1 === 0 || std2 === 0) {
		return 0; // No variation
	}

	return covariance / (std1 * std2);
}

/**
 * Convert array to ranks for Spearman correlation
 */
function getRanks(array: number[]): number[] {
	const sorted = [...array]
		.map((val, index) => ({ val, index }))
		.sort((a, b) => a.val - b.val);

	const ranks: number[] = new Array(array.length);

	let currentRank = 1;
	let i = 0;

	while (i < sorted.length) {
		let j = i;
		while (j < sorted.length && sorted[j].val === sorted[i].val) {
			j++;
		}

		// Average rank for tied values
		const averageRank = (i + j - 1) / 2 + 1;

		for (let k = i; k < j; k++) {
			ranks[sorted[k].index] = averageRank;
		}

		i = j;
		currentRank = j + 1;
	}

	return ranks;
}

/**
 * Generate scatter matrix with filtering
 */
export function generateFilteredScatterMatrix(
	variables: string[],
	data: Array<Record<string, number>>,
	filters: {
		variable?: string;
		min?: number;
		max?: number;
	}[],
	options: {
		title?: string;
		showCorrelations?: boolean;
	} = {},
): ScatterMatrixData {
	// Apply filters
	let filteredData = data;

	filters.forEach((filter) => {
		if (
			filter.variable &&
			(filter.min !== undefined || filter.max !== undefined)
		) {
			filteredData = filteredData.filter((record) => {
				const value = record[filter.variable!];
				if (filter.min !== undefined && value < filter.min) return false;
				if (filter.max !== undefined && value > filter.max) return false;
				return true;
			});
		}
	});

	return generateScatterMatrixData(variables, filteredData, options);
}

/**
 * Calculate scatter matrix statistics
 */
export function calculateScatterMatrixStatistics(
	variables: string[],
	data: Array<Record<string, number>>,
): {
	variableStats: Array<{
		name: string;
		count: number;
		mean: number;
		std: number;
		min: number;
		max: number;
		missing: number;
	}>;
	correlations: Array<Array<number>>;
	strongestCorrelations: Array<{
		var1: string;
		var2: string;
		correlation: number;
		strength: "very weak" | "weak" | "moderate" | "strong" | "very strong";
	}>;
} {
	const variableStats = variables.map((varName) => {
		const values = data
			.map((record) => record[varName])
			.filter((val) => !isNaN(val));
		const missing = data.length - values.length;

		if (values.length === 0) {
			return {
				name: varName,
				count: 0,
				mean: 0,
				std: 0,
				min: 0,
				max: 0,
				missing,
			};
		}

		const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
		const variance =
			values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
			values.length;
		const std = Math.sqrt(variance);

		return {
			name: varName,
			count: values.length,
			mean,
			std,
			min: Math.min(...values),
			max: Math.max(...values),
			missing,
		};
	});

	const correlations = calculateCorrelations(variables, data);

	// Find strongest correlations (excluding self-correlations)
	const correlationPairs: Array<{
		var1: string;
		var2: string;
		correlation: number;
	}> = [];

	for (let i = 0; i < variables.length; i++) {
		for (let j = i + 1; j < variables.length; j++) {
			const corr = Math.abs(correlations[i][j]);
			if (!isNaN(corr)) {
				correlationPairs.push({
					var1: variables[i],
					var2: variables[j],
					correlation: correlations[i][j],
				});
			}
		}
	}

	correlationPairs.sort(
		(a, b) => Math.abs(b.correlation) - Math.abs(a.correlation),
	);

	const strongestCorrelations = correlationPairs.slice(0, 10).map((pair) => ({
		...pair,
		strength: getCorrelationStrength(Math.abs(pair.correlation)),
	}));

	return {
		variableStats,
		correlations,
		strongestCorrelations,
	};
}

/**
 * Get correlation strength description
 */
function getCorrelationStrength(
	correlation: number,
): "very weak" | "weak" | "moderate" | "strong" | "very strong" {
	const absCorr = Math.abs(correlation);

	if (absCorr < 0.2) return "very weak";
	if (absCorr < 0.4) return "weak";
	if (absCorr < 0.6) return "moderate";
	if (absCorr < 0.8) return "strong";
	return "very strong";
}

/**
 * Detect multicollinearity in scatter matrix
 */
export function detectMulticollinearity(
	variables: string[],
	data: Array<Record<string, number>>,
	threshold: number = 0.8,
): {
	hasMulticollinearity: boolean;
	highlyCorrelatedPairs: Array<{
		var1: string;
		var2: string;
		correlation: number;
		severity: "moderate" | "high" | "severe";
	}>;
	vif: Array<{ variable: string; vif: number }>;
} {
	const correlations = calculateCorrelations(variables, data);
	const highlyCorrelatedPairs: Array<{
		var1: string;
		var2: string;
		correlation: number;
		severity: "moderate" | "high" | "severe";
	}> = [];

	// Find highly correlated pairs
	for (let i = 0; i < variables.length; i++) {
		for (let j = i + 1; j < variables.length; j++) {
			const corr = Math.abs(correlations[i][j]);
			if (corr >= threshold) {
				let severity: "moderate" | "high" | "severe";
				if (corr >= 0.9) severity = "severe";
				else if (corr >= 0.85) severity = "high";
				else severity = "moderate";

				highlyCorrelatedPairs.push({
					var1: variables[i],
					var2: variables[j],
					correlation: correlations[i][j],
					severity,
				});
			}
		}
	}

	// Calculate VIF (Variance Inflation Factor) - simplified
	const vif = variables.map((varName) => {
		// This is a simplified VIF calculation
		// In practice, you'd use multiple regression
		const otherVars = variables.filter((v) => v !== varName);
		const avgCorrelation =
			otherVars.reduce((sum, otherVar) => {
				const index1 = variables.indexOf(varName);
				const index2 = variables.indexOf(otherVar);
				return sum + Math.abs(correlations[index1][index2]);
			}, 0) / otherVars.length;

		const vif = 1 / (1 - avgCorrelation * avgCorrelation);
		return { variable: varName, vif };
	});

	return {
		hasMulticollinearity: highlyCorrelatedPairs.length > 0,
		highlyCorrelatedPairs,
		vif,
	};
}


