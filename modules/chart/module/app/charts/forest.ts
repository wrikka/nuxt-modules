import type { ForestData, ChartData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Forest plot utilities - confidence intervals for meta-analysis
 */

/**
 * Generate forest plot data
 */
export function generateForestData(
	studies: Array<{
		name: string;
		effect: number;
		ciLow: number;
		ciHigh: number;
		weight?: number;
		color?: string;
		group?: string;
	}>,
	options: {
		title?: string;
		showWeights?: boolean;
		showOverallEffect?: boolean;
		overallEffect?: number;
		overallCI?: { low: number; high: number };
		zeroLine?: boolean;
		zeroLineColor?: string;
		ciLineWidth?: number;
		diamondSize?: number;
		sortByEffect?: boolean;
		sortByWeight?: boolean;
	} = {},
): ForestData {
	const {
		title,
		showWeights = false,
		showOverallEffect = false,
		overallEffect,
		overallCI,
		zeroLine = true,
		zeroLineColor = "#666",
		ciLineWidth = 2,
		diamondSize = 8,
		sortByEffect = false,
		sortByWeight = false,
	} = options;

	// Sort studies if requested
	let sortedStudies = studies;
	if (sortByEffect) {
		sortedStudies = [...studies].sort((a, b) => a.effect - b.effect);
	} else if (sortByWeight) {
		sortedStudies = [...studies].sort(
			(a, b) => (b.weight || 0) - (a.weight || 0),
		);
	}

	// Create study data points
	const studyPoints = sortedStudies.map((study, index) => ({
		name: study.name,
		effect: study.effect,
		ciLow: study.ciLow,
		ciHigh: study.ciHigh,
		weight: study.weight,
		color: study.color || getSeriesColor(index % 10),
		group: study.group,
	}));

	// Create series for confidence intervals
	const ciSeries = {
		name: "Confidence Intervals",
		data: studyPoints.map((study, index) => ({
			x: study.name,
			y: [study.ciLow, study.ciHigh],
			label: `${study.effect.toFixed(2)} [${study.ciLow.toFixed(2)}, ${study.ciHigh.toFixed(2)}]`,
			color: study.color,
		})),
		type: "range",
	};

	// Create series for effect sizes (diamonds or points)
	const effectSeries = {
		name: "Effect Sizes",
		data: studyPoints.map((study, index) => ({
			x: study.name,
			y: study.effect,
			label:
				showWeights && study.weight
					? `${study.effect.toFixed(2)} (w: ${study.weight.toFixed(1)})`
					: study.effect.toFixed(2),
			color: study.color,
			size: diamondSize,
		})),
		type: "scatter",
	};

	// Create overall effect series if requested
	let overallSeries;
	if (showOverallEffect && overallEffect !== undefined) {
		const overallLabel = overallCI
			? `${overallEffect.toFixed(2)} [${overallCI.low.toFixed(2)}, ${overallCI.high.toFixed(2)}]`
			: overallEffect.toFixed(2);

		overallSeries = {
			name: "Overall Effect",
			data: [
				{
					x: "Overall",
					y: overallEffect,
					label: overallLabel,
					color: "#ff6b6b",
					size: diamondSize * 1.5,
				},
			],
			type: "scatter",
		};

		// Add overall CI if provided
		if (overallCI) {
			const overallCISeries = {
				name: "Overall CI",
				data: [
					{
						x: "Overall",
						y: [overallCI.low, overallCI.high],
						color: "#ff6b6b",
						label: overallLabel,
					},
				],
				type: "range",
			};
			ciSeries.data.push(overallCISeries.data[0]);
		}
	}

	const chartData: ChartData = {
		title,
		series: overallSeries
			? [ciSeries, effectSeries, overallSeries]
			: [ciSeries, effectSeries],
	};

	return {
		...chartData,
		studies: studyPoints,
	};
}

/**
 * Generate forest plot from statistical data
 */
export function generateForestFromStats(
	stats: Array<{
		name: string;
		mean: number;
		confidenceInterval: { low: number; high: number };
		weight?: number;
		color?: string;
		group?: string;
	}>,
	options: {
		title?: string;
		showOverallEffect?: boolean;
		calculateOverall?: boolean;
	} = {},
): ForestData {
	const {
		title,
		showOverallEffect = false,
		calculateOverall = false,
	} = options;

	const studies = stats.map((stat) => ({
		name: stat.name,
		effect: stat.mean,
		ciLow: stat.confidenceInterval.low,
		ciHigh: stat.confidenceInterval.high,
		weight: stat.weight,
		color: stat.color,
		group: stat.group,
	}));

	let overallEffect, overallCI;

	if (calculateOverall) {
		// Simple fixed-effect meta-analysis calculation
		const totalWeight = studies.reduce(
			(sum, study) => sum + (study.weight || 1),
			0,
		);
		const weightedSum = studies.reduce(
			(sum, study) => sum + study.effect * (study.weight || 1),
			0,
		);
		overallEffect = weightedSum / totalWeight;

		// Simplified CI calculation
		const variances = studies.map((study) =>
			Math.pow((study.ciHigh - study.ciLow) / 3.92, 2),
		); // Approximate
		const totalVariance = variances.reduce((sum, v) => sum + v, 0);
		const overallSE = Math.sqrt(totalVariance);
		overallCI = {
			low: overallEffect - 1.96 * overallSE,
			high: overallEffect + 1.96 * overallSE,
		};
	}

	return generateForestData(studies, {
		title,
		showOverallEffect: showOverallEffect || calculateOverall,
		overallEffect,
		overallCI,
	});
}

/**
 * Generate subgroup forest plot
 */
export function generateSubgroupForestData(
	subgroups: Array<{
		name: string;
		studies: Array<{
			name: string;
			effect: number;
			ciLow: number;
			ciHigh: number;
			weight?: number;
		}>;
		color?: string;
	}>,
	options: {
		title?: string;
		showSubgroupEffects?: boolean;
		spacing?: number;
	} = {},
): ForestData {
	const { title, showSubgroupEffects = true, spacing = 1 } = options;

	let allStudies: Array<{
		name: string;
		effect: number;
		ciLow: number;
		ciHigh: number;
		weight?: number;
		color?: string;
		group: string;
	}> = [];

	subgroups.forEach((subgroup, subgroupIndex) => {
		// Add subgroup studies
		subgroup.studies.forEach((study) => {
			allStudies.push({
				...study,
				color: subgroup.color || getSeriesColor(subgroupIndex),
				group: subgroup.name,
			});
		});

		// Add spacing/placeholder for subgroup effect
		if (showSubgroupEffects && subgroup.studies.length > 0) {
			// Calculate subgroup effect (simplified)
			const totalWeight = subgroup.studies.reduce(
				(sum, s) => sum + (s.weight || 1),
				0,
			);
			const weightedSum = subgroup.studies.reduce(
				(sum, s) => sum + s.effect * (s.weight || 1),
				0,
			);
			const subgroupEffect = weightedSum / totalWeight;

			// Simplified CI calculation for subgroup
			const effects = subgroup.studies.map((s) => s.effect);
			const mean = effects.reduce((sum, e) => sum + e, 0) / effects.length;
			const variance =
				effects.reduce((sum, e) => sum + Math.pow(e - mean, 2), 0) /
				effects.length;
			const se = Math.sqrt(variance / effects.length);
			const ciLow = subgroupEffect - 1.96 * se;
			const ciHigh = subgroupEffect + 1.96 * se;

			allStudies.push({
				name: `Subgroup: ${subgroup.name}`,
				effect: subgroupEffect,
				ciLow,
				ciHigh,
				weight: totalWeight,
				color: subgroup.color || getSeriesColor(subgroupIndex),
				group: subgroup.name,
			});
		}
	});

	return generateForestData(allStudies, { title });
}

/**
 * Calculate forest plot statistics
 */
export function calculateForestStatistics(
	studies: Array<{
		effect: number;
		ciLow: number;
		ciHigh: number;
		weight?: number;
	}>,
): {
	totalStudies: number;
	heterogeneity: {
		q: number;
		df: number;
		p: number;
		i2: number;
	};
	overallEffect: number;
	overallCI: { low: number; high: number };
	publicationBias: {
		eggersTest: number;
		beggTest: number;
	};
} {
	const n = studies.length;
	if (n < 2) {
		return {
			totalStudies: n,
			heterogeneity: { q: 0, df: 0, p: 1, i2: 0 },
			overallEffect: studies[0]?.effect || 0,
			overallCI: { low: studies[0]?.ciLow || 0, high: studies[0]?.ciHigh || 0 },
			publicationBias: { eggersTest: 0, beggTest: 0 },
		};
	}

	// Calculate overall effect (fixed effect model)
	const weights = studies.map((s) => s.weight || 1);
	const totalWeight = weights.reduce((sum, w) => sum + w, 0);
	const weightedSum = studies.reduce(
		(sum, s, i) => sum + s.effect * weights[i],
		0,
	);
	const overallEffect = weightedSum / totalWeight;

	// Calculate heterogeneity (Cochran's Q test)
	const weightedVarianceSum = studies.reduce((sum, s, i) => {
		const weight = weights[i];
		return sum + weight * Math.pow(s.effect - overallEffect, 2);
	}, 0);
	const q = weightedVarianceSum;
	const df = n - 1;
	const p = 1 - chiSquareCDF(q, df);

	// Calculate I² statistic
	const i2 = Math.max(0, (q - df) / q) * 100;

	// Calculate overall CI
	const se = Math.sqrt(weightedVarianceSum / (totalWeight * totalWeight));
	const overallCI = {
		low: overallEffect - 1.96 * se,
		high: overallEffect + 1.96 * se,
	};

	// Simplified publication bias tests (placeholders)
	const eggersTest = 0; // Would need regression analysis
	const beggTest = 0; // Would need rank correlation

	return {
		totalStudies: n,
		heterogeneity: { q, df, p, i2 },
		overallEffect,
		overallCI,
		publicationBias: { eggersTest, beggTest },
	};
}

// Helper function for chi-square CDF (simplified approximation)
function chiSquareCDF(x: number, df: number): number {
	// Simplified approximation - in real implementation, use proper statistical library
	return Math.min(1, x / (df + x));
}


