import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Calculate waterfall chart statistics
 */
export function calculateWaterfallStats(
	steps: Array<{
		name: string;
		value: number;
	}>,
): {
	totalChange: number;
	largestIncrease: { name: string; value: number };
	largestDecrease: { name: string; value: number };
	averageStep: number;
	volatility: number;
} {
	const values = steps.map((step) => step.value);
	const totalChange = values.reduce((sum, val) => sum + val, 0);

	const positiveSteps = steps.filter((step) => step.value > 0);
	const negativeSteps = steps.filter((step) => step.value < 0);

	const largestIncrease =
		positiveSteps.length > 0
			? positiveSteps.reduce((max, step) =>
				step.value > max.value ? step : max,
			)
			: { name: "", value: 0 };

	const largestDecrease =
		negativeSteps.length > 0
			? negativeSteps.reduce((min, step) =>
				step.value < min.value ? step : min,
			)
			: { name: "", value: 0 };

	const averageStep = values.length > 0 ? totalChange / values.length : 0;

	// Calculate volatility (standard deviation of step values)
	const mean = averageStep;
	const variance =
		values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
		values.length;
	const volatility = Math.sqrt(variance);

	return {
		totalChange,
		largestIncrease,
		largestDecrease,
		averageStep,
		volatility,
	};
}

/**
 * Normalize waterfall values to percentages
 */
export function normalizeWaterfallData(
	steps: Array<{
		name: string;
		value: number;
		color?: string;
	}>,
): Array<{
	name: string;
	value: number;
	percentage: number;
	color?: string;
}> {
	const total = Math.abs(steps.reduce((sum, step) => sum + step.value, 0));

	if (total === 0) {
		return steps.map((step) => ({
			...step,
			percentage: 0,
		}));
	}

	return steps.map((step) => ({
		...step,
		percentage: (step.value / total) * 100,
	}));
}

/**
 * Find inflection points in waterfall chart
 */
export function findWaterfallInflectionPoints(
	steps: Array<{
		name: string;
		value: number;
	}>,
): Array<{
	index: number;
	name: string;
	value: number;
	direction: "peak" | "valley";
}> {
	const inflectionPoints: Array<{
		index: number;
		name: string;
		value: number;
		direction: "peak" | "valley";
	}> = [];

	for (let i = 1; i < steps.length - 1; i++) {
		const prev = steps[i - 1].value;
		const current = steps[i].value;
		const next = steps[i + 1].value;

		// Peak: positive then negative change
		if (prev > 0 && current > 0 && next < 0) {
			inflectionPoints.push({
				index: i,
				name: steps[i].name,
				value: current,
				direction: "peak",
			});
		}

		// Valley: negative then positive change
		if (prev < 0 && current < 0 && next > 0) {
			inflectionPoints.push({
				index: i,
				name: steps[i].name,
				value: current,
				direction: "valley",
			});
		}
	}

	return inflectionPoints;
}

/**
 * Merge small steps in waterfall chart
 */
export function mergeSmallWaterfallSteps(
	steps: Array<{
		name: string;
		value: number;
		color?: string;
	}>,
	threshold: number = 0.05, // 5% of total
): Array<{
	name: string;
	value: number;
	color?: string;
	isMerged?: boolean;
}> {
	const total = Math.abs(steps.reduce((sum, step) => sum + step.value, 0));
	const thresholdValue = total * threshold;

	const largeSteps: Array<{
		name: string;
		value: number;
		color?: string;
		isMerged?: boolean;
	}> = [];

	let mergedValue = 0;
	let mergedCount = 0;

	steps.forEach((step) => {
		if (Math.abs(step.value) >= thresholdValue) {
			largeSteps.push(step);
		} else {
			mergedValue += step.value;
			mergedCount++;
		}
	});

	if (mergedCount > 0) {
		largeSteps.push({
			name: `Other (${mergedCount} items)`,
			value: mergedValue,
			color: getSeriesColor(largeSteps.length),
			isMerged: true,
		});
	}

	return largeSteps;
}

/**
 * Calculate waterfall efficiency (ratio of positive to total change)
 */
export function calculateWaterfallEfficiency(
	steps: Array<{
		value: number;
	}>,
): number {
	const totalChange = steps.reduce(
		(sum, step) => sum + Math.abs(step.value),
		0,
	);
	const positiveChange = steps.reduce(
		(sum, step) => sum + Math.max(0, step.value),
		0,
	);

	return totalChange === 0 ? 0 : positiveChange / totalChange;
}


