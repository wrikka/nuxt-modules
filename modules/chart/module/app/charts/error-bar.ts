import type { ErrorBarData, ChartData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Error bar chart utilities - scatter/bar charts with error bars
 */

/**
 * Generate error bar chart data
 */
export function generateErrorBarData(
	errorBars: Array<{
		x: string | number;
		y: number;
		errorMin: number;
		errorMax: number;
		color?: string;
		label?: string;
		size?: number;
	}>,
	options: {
		title?: string;
		showBars?: boolean;
		showPoints?: boolean;
		barWidth?: number;
		pointSize?: number;
		errorBarWidth?: number;
		errorBarColor?: string;
		errorBarOpacity?: number;
		orientation?: "vertical" | "horizontal";
	} = {},
): ErrorBarData {
	const {
		title,
		showBars = false,
		showPoints = true,
		barWidth = 0.8,
		pointSize = 6,
		errorBarWidth = 0.3,
		errorBarColor,
		errorBarOpacity = 0.8,
		orientation = "vertical",
	} = options;

	// Create main data series (bars or points)
	const mainSeries = {
		name: showBars ? "Bars" : "Points",
		data: errorBars.map((bar, index) => ({
			x: bar.x,
			y: bar.y,
			label: bar.label || bar.y.toString(),
			color: bar.color || getSeriesColor(index),
			size: bar.size || pointSize,
		})),
		type: showBars ? "bar" : "scatter",
	};

	// Create error bar series (visual representation of error ranges)
	const errorSeries = {
		name: "Error Bars",
		data: errorBars.map((bar, index) => ({
			x: bar.x,
			y: [bar.errorMin, bar.errorMax],
			color: errorBarColor || bar.color || getSeriesColor(index),
			opacity: errorBarOpacity,
		})),
		type: "errorBar",
	};

	const chartData: ChartData = {
		title,
		series: [mainSeries, errorSeries],
		orientation,
	};

	return {
		...chartData,
		errorBars,
	};
}

/**
 * Generate error bar chart from arrays
 */
export function generateErrorBarFromArrays(
	xValues: Array<string | number>,
	yValues: number[],
	errorMins: number[],
	errorMaxs: number[],
	options: {
		title?: string;
		colors?: string[];
		labels?: string[];
		showBars?: boolean;
		showPoints?: boolean;
	} = {},
): ErrorBarData {
	const { colors, labels, ...otherOptions } = options;

	const errorBars = xValues.map((x, index) => ({
		x,
		y: yValues[index],
		errorMin: errorMins[index],
		errorMax: errorMaxs[index],
		color: colors?.[index],
		label: labels?.[index],
	}));

	return generateErrorBarData(errorBars, otherOptions);
}

/**
 * Generate error bars from statistical data (mean ± standard deviation)
 */
export function generateErrorBarFromStats(
	stats: Array<{
		category: string | number;
		mean: number;
		stdDev: number;
		n?: number; // sample size for confidence intervals
		color?: string;
		label?: string;
	}>,
	options: {
		title?: string;
		confidenceLevel?: number; // 95% default
		useConfidenceInterval?: boolean;
		showBars?: boolean;
		showPoints?: boolean;
	} = {},
): ErrorBarData {
	const {
		title,
		confidenceLevel = 0.95,
		useConfidenceInterval = false,
		...otherOptions
	} = options;

	const errorBars = stats.map((stat) => {
		let errorMargin = stat.stdDev;

		// Calculate confidence interval if requested
		if (useConfidenceInterval && stat.n && stat.n > 1) {
			// t-distribution approximation for confidence interval
			// For simplicity, using normal approximation for large n
			const zScore =
				confidenceLevel === 0.95
					? 1.96
					: confidenceLevel === 0.99
						? 2.576
						: 1.96;
			const standardError = stat.stdDev / Math.sqrt(stat.n);
			errorMargin = zScore * standardError;
		}

		return {
			x: stat.category,
			y: stat.mean,
			errorMin: stat.mean - errorMargin,
			errorMax: stat.mean + errorMargin,
			color: stat.color,
			label:
				stat.label || `${stat.mean.toFixed(2)} ± ${errorMargin.toFixed(2)}`,
		};
	});

	return generateErrorBarData(errorBars, { title, ...otherOptions });
}

/**
 * Generate asymmetric error bars
 */
export function generateAsymmetricErrorBarData(
	errorBars: Array<{
		x: string | number;
		y: number;
		errorLow: number; // error below the point
		errorHigh: number; // error above the point
		color?: string;
		label?: string;
	}>,
	options: {
		title?: string;
		showBars?: boolean;
		showPoints?: boolean;
	} = {},
): ErrorBarData {
	const { title, ...otherOptions } = options;

	const symmetricErrorBars = errorBars.map((bar) => ({
		x: bar.x,
		y: bar.y,
		errorMin: bar.y - bar.errorLow,
		errorMax: bar.y + bar.errorHigh,
		color: bar.color,
		label: bar.label,
	}));

	return generateErrorBarData(symmetricErrorBars, { title, ...otherOptions });
}

/**
 * Calculate error bar statistics
 */
export function calculateErrorBarStatistics(
	errorBars: Array<{ y: number; errorMin: number; errorMax: number }>,
): {
	totalPoints: number;
	averageValue: number;
	averageError: number;
	maxError: number;
	minError: number;
	coefficientOfVariation: number;
	errorRange: number;
} {
	if (errorBars.length === 0) {
		return {
			totalPoints: 0,
			averageValue: 0,
			averageError: 0,
			maxError: 0,
			minError: 0,
			coefficientOfVariation: 0,
			errorRange: 0,
		};
	}

	const values = errorBars.map((bar) => bar.y);
	const errors = errorBars.map((bar) => (bar.errorMax - bar.errorMin) / 2);

	const averageValue =
		values.reduce((sum, val) => sum + val, 0) / values.length;
	const averageError =
		errors.reduce((sum, err) => sum + err, 0) / errors.length;
	const maxError = Math.max(...errors);
	const minError = Math.min(...errors);

	// Coefficient of variation (relative variability)
	const valueVariance =
		values.reduce((sum, val) => sum + Math.pow(val - averageValue, 2), 0) /
		values.length;
	const valueStdDev = Math.sqrt(valueVariance);
	const coefficientOfVariation =
		averageValue !== 0 ? valueStdDev / averageValue : 0;

	const errorRange = maxError - minError;

	return {
		totalPoints: errorBars.length,
		averageValue,
		averageError,
		maxError,
		minError,
		coefficientOfVariation,
		errorRange,
	};
}

/**
 * Generate error bars for experimental data
 */
export function generateExperimentalErrorBarData(
	experiments: Array<{
		name: string;
		replicates: number[];
		color?: string;
	}>,
	options: {
		title?: string;
		showStandardDeviation?: boolean;
		showStandardError?: boolean;
		showConfidenceInterval?: boolean;
		confidenceLevel?: number;
	} = {},
): ErrorBarData {
	const {
		title,
		showStandardDeviation = true,
		showStandardError = false,
		showConfidenceInterval = false,
		confidenceLevel = 0.95,
	} = options;

	const errorBars = experiments.map((exp) => {
		const n = exp.replicates.length;
		const mean = exp.replicates.reduce((sum, val) => sum + val, 0) / n;

		// Calculate standard deviation
		const variance =
			exp.replicates.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
			(n - 1);
		const stdDev = Math.sqrt(variance);

		let errorMargin = stdDev;

		if (showStandardError) {
			errorMargin = stdDev / Math.sqrt(n);
		} else if (showConfidenceInterval) {
			// Simplified confidence interval calculation
			const tValue = confidenceLevel === 0.95 ? 2.0 : 2.576; // approximation
			errorMargin = tValue * (stdDev / Math.sqrt(n));
		}

		return {
			x: exp.name,
			y: mean,
			errorMin: mean - errorMargin,
			errorMax: mean + errorMargin,
			color: exp.color,
			label: `${mean.toFixed(2)} ± ${errorMargin.toFixed(2)}`,
		};
	});

	return generateErrorBarData(errorBars, {
		title: title || "Experimental Results",
		showPoints: true,
	});
}


