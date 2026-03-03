import { computed } from "vue";
import type { DataPoint, ChartData, ChartSeries } from '@/module/app/types/chart-basic';
import type {
	StatisticalMeasure,
	StatisticalSummary,
	CorrelationResult,
	OutlierMethod,
} from "../types/statistics";
import {
	getPercentile,
	getMode,
	calculateSkewness,
	calculateKurtosis,
	classifyDistribution,
	calculateMAD,
	pearsonCorrelation,
	getRanks,
	formatMeasureName,
	getMeasureColor,
} from "../utils/statistical-utils";

/**
 * Composable for statistical analysis
 */
export function useChartStatisticalAnalysis(data: DataPoint[]) {
	/**
	 * Calculate comprehensive statistical summary
	 */
	const statisticalSummary = computed<StatisticalSummary>(() => {
		const values = data
			.map((point) => Number(point.y))
			.filter((value) => !isNaN(value) && isFinite(value))
			.sort((a, b) => a - b);

		if (values.length === 0) {
			return {
				count: 0,
				mean: 0,
				median: 0,
				mode: [],
				standardDeviation: 0,
				variance: 0,
				min: 0,
				max: 0,
				range: 0,
				quartiles: { q1: 0, q2: 0, q3: 0 },
				percentiles: { p10: 0, p25: 0, p75: 0, p90: 0 },
				skewness: 0,
				kurtosis: 0,
				outliers: [],
				distribution: "unknown",
			};
		}

		const count = values.length;
		const mean = values.reduce((sum, value) => sum + value, 0) / count;
		const median = getPercentile(values, 50);
		const mode = getMode(values);
		const variance =
			values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / count;
		const standardDeviation = Math.sqrt(variance);
		const min = values[0];
		const max = values[count - 1];
		const range = max - min;

		const quartiles = {
			q1: getPercentile(values, 25),
			q2: median,
			q3: getPercentile(values, 75),
		};

		const percentiles = {
			p10: getPercentile(values, 10),
			p25: quartiles.q1,
			p75: quartiles.q3,
			p90: getPercentile(values, 90),
		};

		const skewness = calculateSkewness(values, mean, standardDeviation);
		const kurtosis = calculateKurtosis(values, mean, standardDeviation);
		const outliers = detectOutliers(values, "iqr");
		const distribution = classifyDistribution(skewness, kurtosis);

		return {
			count,
			mean,
			median,
			mode,
			standardDeviation,
			variance,
			min,
			max,
			range,
			quartiles,
			percentiles,
			skewness,
			kurtosis,
			outliers: outliers
				.map((value) => data.find((point) => Number(point.y) === value)!)
				.filter(Boolean),
			distribution,
		};
	});

	/**
	 * Calculate specific statistical measure
	 */
	const calculateMeasure = (
		measure: StatisticalMeasure,
		values?: DataPoint[],
	): number | number[] | any => {
		const points = values || data;
		const nums = points
			.map((point) => Number(point.y))
			.filter((value) => !isNaN(value) && isFinite(value));

		switch (measure) {
			case "mean":
				return nums.length > 0
					? nums.reduce((a, b) => a + b, 0) / nums.length
					: 0;

			case "median":
				return getPercentile(
					nums.sort((a, b) => a - b),
					50,
				);

			case "mode":
				return getMode(nums);

			case "standard-deviation":
				const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
				const variance =
					nums.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
					nums.length;
				return Math.sqrt(variance);

			case "variance":
				const mean2 = nums.reduce((a, b) => a + b, 0) / nums.length;
				return (
					nums.reduce((sum, value) => sum + Math.pow(value - mean2, 2), 0) /
					nums.length
				);

			case "min":
				return Math.min(...nums);

			case "max":
				return Math.max(...nums);

			case "range":
				return Math.max(...nums) - Math.min(...nums);

			case "quartiles":
				const sorted = nums.sort((a, b) => a - b);
				return {
					q1: getPercentile(sorted, 25),
					q2: getPercentile(sorted, 50),
					q3: getPercentile(sorted, 75),
				};

			case "percentiles":
				const sorted2 = nums.sort((a, b) => a - b);
				return {
					p10: getPercentile(sorted2, 10),
					p25: getPercentile(sorted2, 25),
					p50: getPercentile(sorted2, 50),
					p75: getPercentile(sorted2, 75),
					p90: getPercentile(sorted2, 90),
				};

			case "skewness":
				const mean3 = nums.reduce((a, b) => a + b, 0) / nums.length;
				const std3 = Math.sqrt(
					nums.reduce((sum, value) => sum + Math.pow(value - mean3, 2), 0) /
						nums.length,
				);
				return calculateSkewness(nums, mean3, std3);

			case "kurtosis":
				const mean4 = nums.reduce((a, b) => a + b, 0) / nums.length;
				const std4 = Math.sqrt(
					nums.reduce((sum, value) => sum + Math.pow(value - mean4, 2), 0) /
						nums.length,
				);
				return calculateKurtosis(nums, mean4, std4);

			default:
				return 0;
		}
	};

	/**
	 * Calculate correlation between two datasets
	 */
	const calculateCorrelation = (
		data1: DataPoint[],
		data2: DataPoint[],
		method: "pearson" | "spearman" = "pearson",
	): CorrelationResult => {
		const values1 = data1.map((p) => Number(p.y)).filter((v) => !isNaN(v));
		const values2 = data2.map((p) => Number(p.y)).filter((v) => !isNaN(v));

		if (values1.length !== values2.length || values1.length < 2) {
			return {
				coefficient: 0,
				strength: "very-weak",
				direction: "none",
			};
		}

		let coefficient: number;

		if (method === "spearman") {
			// Convert to ranks
			const ranks1 = getRanks(values1);
			const ranks2 = getRanks(values2);
			coefficient = pearsonCorrelation(ranks1, ranks2);
		} else {
			coefficient = pearsonCorrelation(values1, values2);
		}

		const absCoeff = Math.abs(coefficient);
		let strength: CorrelationResult["strength"];
		if (absCoeff >= 0.8) strength = "very-strong";
		else if (absCoeff >= 0.6) strength = "strong";
		else if (absCoeff >= 0.3) strength = "moderate";
		else if (absCoeff >= 0.1) strength = "weak";
		else strength = "very-weak";

		const direction: CorrelationResult["direction"] =
			coefficient > 0.1 ? "positive" : coefficient < -0.1 ? "negative" : "none";

		return {
			coefficient,
			strength,
			direction,
		};
	};

	/**
	 * Detect outliers
	 */
	const detectOutliers = (
		values: number[],
		method: OutlierMethod = "iqr",
	): number[] => {
		if (values.length < 4) return [];

		const sorted = [...values].sort((a, b) => a - b);

		switch (method) {
			case "iqr":
				const q1 = getPercentile(sorted, 25);
				const q3 = getPercentile(sorted, 75);
				const iqr = q3 - q1;
				const lowerBound = q1 - 1.5 * iqr;
				const upperBound = q3 + 1.5 * iqr;
				return values.filter(
					(value) => value < lowerBound || value > upperBound,
				);

			case "z-score":
				const mean = values.reduce((a, b) => a + b, 0) / values.length;
				const std = Math.sqrt(
					values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
						values.length,
				);
				return values.filter((value) => Math.abs((value - mean) / std) > 3);

			case "modified-z-score":
				const median = getPercentile(sorted, 50);
				const mad = calculateMAD(sorted, median);
				return values.filter(
					(value) => Math.abs((0.6745 * (value - median)) / mad) > 3.5,
				);

			default:
				return [];
		}
	};

	/**
	 * Create statistical overlay series
	 */
	const createStatisticalOverlay = (
		chartData: ChartData,
		measures: StatisticalMeasure[],
	): ChartData => {
		const overlaySeries: ChartSeries[] = [];

		measures.forEach((measure) => {
			const value = calculateMeasure(measure);

			if (typeof value === "number") {
				// Create horizontal line for the measure
				const lineData: DataPoint[] =
					chartData.series[0]?.data.map((point, index) => ({
						x: point.x,
						y: value,
						label: `${measure}: ${value.toFixed(2)}`,
					})) || [];

				overlaySeries.push({
					name: formatMeasureName(measure),
					data: lineData,
					type: "line",
					color: getMeasureColor(measure),
				});
			} else if (Array.isArray(value) && measure === "quartiles") {
				// Create quartile ranges
				const quartileData = value as unknown as {
					q1: number;
					q2: number;
					q3: number;
				};
				const rangeData: DataPoint[] =
					chartData.series[0]?.data.map((point) => ({
						x: point.x,
						y: quartileData.q2, // median line
						label: `Q2: ${quartileData.q2.toFixed(2)}`,
					})) || [];

				overlaySeries.push({
					name: "Median (Q2)",
					data: rangeData,
					type: "line",
					color: "#ff6b6b",
				});
			}
		});

		return {
			...chartData,
			series: [...chartData.series, ...overlaySeries],
		};
	};

	/**
	 * Create distribution chart
	 */
	const createDistributionChart = (bins: number = 10): ChartData => {
		const values = data
			.map((point) => Number(point.y))
			.filter((value) => !isNaN(value) && isFinite(value));

		if (values.length === 0) {
			return { series: [] };
		}

		const min = Math.min(...values);
		const max = Math.max(...values);
		const range = max - min || 1;
		const binWidth = range / bins;

		const histogram: { bin: number; count: number }[] = [];

		for (let i = 0; i < bins; i++) {
			const binStart = min + i * binWidth;
			const binEnd = binStart + binWidth;
			const count = values.filter(
				(value) => value >= binStart && value < binEnd,
			).length;
			histogram.push({ bin: binStart + binWidth / 2, count });
		}

		return {
			title: "Value Distribution",
			series: [
				{
					name: "Frequency",
					data: histogram.map((h) => ({
						x: h.bin,
						y: h.count,
						label: `Bin: ${h.bin.toFixed(2)}`,
					})),
					type: "bar",
				},
			],
		};
	};

	return {
		statisticalSummary,
		calculateMeasure,
		calculateCorrelation,
		detectOutliers,
		createStatisticalOverlay,
		createDistributionChart,
	};
}
