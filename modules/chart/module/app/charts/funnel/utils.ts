import type { ChartData } from '@/module/app/types/chart-basic';
import { calculateFunnelConversionRates } from './funnel-analysis';

/**
 * Find bottleneck stages in funnel (highest dropoff rates)
 */
export function findFunnelBottlenecks(
	data: ChartData,
	threshold: number = 0.2,
): Array<{ stage: string; dropoff: number; rate: number }> {
	const conversionRates = calculateFunnelConversionRates(data);

	return conversionRates
		.filter((r) => r.rate < 1 - threshold)
		.sort((a, b) => a.rate - b.rate)
		.map((r) => ({
			stage: r.from,
			dropoff: r.dropoff,
			rate: r.rate,
		}));
}

/**
 * Normalize funnel data to percentages
 */
export function normalizeFunnelData(data: ChartData): ChartData {
	const series = data.series[0];
	if (!series) return data;

	const maxValue = Math.max(
		...series.data.map((p) => (typeof p.y === "number" ? p.y : 0)),
	);

	if (maxValue === 0) return data;

	const normalizedData = series.data.map((point) => ({
		...point,
		y: typeof point.y === "number" ? (point.y / maxValue) * 100 : 0,
	}));

	return {
		...data,
		series: [
			{
				...series,
				data: normalizedData,
			},
		],
	};
}

/**
 * Compare two funnels
 */
export function compareFunnels(
	funnel1: ChartData,
	funnel2: ChartData,
): {
	stageComparison: Array<{
		stage: string;
		value1: number;
		value2: number;
		difference: number;
		percentageChange: number;
	}>;
	overallComparison: {
		total1: number;
		total2: number;
		difference: number;
		percentageChange: number;
	};
} {
	const series1 = funnel1.series[0];
	const series2 = funnel2.series[0];

	if (!series1 || !series2) {
		throw new Error("Both funnels must have data");
	}

	const stageMap1 = new Map(
		series1.data.map((p) => [p.x, typeof p.y === "number" ? p.y : 0]),
	);
	const stageMap2 = new Map(
		series2.data.map((p) => [p.x, typeof p.y === "number" ? p.y : 0]),
	);

	const allStages = new Set([...stageMap1.keys(), ...stageMap2.keys()]);

	const stageComparison = Array.from(allStages).map((stage) => {
		const value1 = stageMap1.get(stage) || 0;
		const value2 = stageMap2.get(stage) || 0;
		const difference = value2 - value1;
		const percentageChange = value1 > 0 ? (difference / value1) * 100 : 0;

		return {
			stage: stage as string,
			value1,
			value2,
			difference,
			percentageChange,
		};
	});

	const total1 = Array.from(stageMap1.values()).reduce(
		(sum, val) => sum + val,
		0,
	);
	const total2 = Array.from(stageMap2.values()).reduce(
		(sum, val) => sum + val,
		0,
	);
	const totalDifference = total2 - total1;
	const totalPercentageChange =
		total1 > 0 ? (totalDifference / total1) * 100 : 0;

	return {
		stageComparison,
		overallComparison: {
			total1,
			total2,
			difference: totalDifference,
			percentageChange: totalPercentageChange,
		},
	};
}


