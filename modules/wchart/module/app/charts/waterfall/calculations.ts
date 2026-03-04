/**
 * Calculate waterfall chart running totals
 */
export function calculateWaterfallRunningTotals(
	steps: Array<{
		name: string;
		value: number;
	}>,
): Array<{ name: string; value: number; runningTotal: number }> {
	let runningTotal = 0;

	return steps.map((step) => {
		runningTotal += step.value;
		return {
			name: step.name,
			value: step.value,
			runningTotal,
		};
	});
}

/**
 * Identify positive and negative contributions in waterfall
 */
export function categorizeWaterfallContributions(
	steps: Array<{
		name: string;
		value: number;
	}>,
): {
	positive: Array<{ name: string; value: number }>;
	negative: Array<{ name: string; value: number }>;
	totalPositive: number;
	totalNegative: number;
} {
	const positive = steps.filter((step) => step.value > 0);
	const negative = steps.filter((step) => step.value < 0);

	const totalPositive = positive.reduce((sum, step) => sum + step.value, 0);
	const totalNegative = negative.reduce(
		(sum, step) => sum + Math.abs(step.value),
		0,
	);

	return {
		positive,
		negative: negative.map((step) => ({
			name: step.name,
			value: Math.abs(step.value),
		})),
		totalPositive,
		totalNegative,
	};
}


