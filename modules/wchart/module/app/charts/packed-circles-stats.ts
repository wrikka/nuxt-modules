/**
 * Packed circles statistics utilities
 */

/**
 * Calculate packed circles statistics
 */
export function calculatePackedCirclesStatistics(
	circles: Array<{ name: string; value: number; group?: string }>,
): {
	totalCircles: number;
	totalValue: number;
	averageValue: number;
	valueDistribution: {
		min: number;
		max: number;
		median: number;
		standardDeviation: number;
	};
	groups: Array<{
		name: string;
		count: number;
		totalValue: number;
		averageValue: number;
		percentage: number;
	}>;
	packingEfficiency: number;
} {
	const values = circles.map((c) => c.value);
	const totalValue = values.reduce((sum, val) => sum + val, 0);
	const averageValue = totalValue / circles.length;

	const sortedValues = [...values].sort((a, b) => a - b);
	const min = sortedValues[0];
	const max = sortedValues[sortedValues.length - 1];
	const median = sortedValues[Math.floor(sortedValues.length / 2)];

	const variance =
		values.reduce((sum, val) => sum + Math.pow(val - averageValue, 2), 0) /
		values.length;
	const standardDeviation = Math.sqrt(variance);

	// Group statistics
	const groupMap = new Map<string, Array<{ name: string; value: number }>>();
	circles.forEach((circle) => {
		const groupName = circle.group || "ungrouped";
		if (!groupMap.has(groupName)) {
			groupMap.set(groupName, []);
		}
		groupMap.get(groupName)!.push(circle);
	});

	const groups = Array.from(groupMap.entries()).map(([name, groupCircles]) => {
		const groupValues = groupCircles.map((c) => c.value);
		const groupTotal = groupValues.reduce((sum, val) => sum + val, 0);
		const groupAverage = groupTotal / groupCircles.length;

		return {
			name,
			count: groupCircles.length,
			totalValue: groupTotal,
			averageValue: groupAverage,
			percentage: (groupTotal / totalValue) * 100,
		};
	});

	// Simplified packing efficiency (would need actual layout to calculate properly)
	const packingEfficiency = 0.7; // Placeholder

	return {
		totalCircles: circles.length,
		totalValue,
		averageValue,
		valueDistribution: {
			min,
			max,
			median,
			standardDeviation,
		},
		groups,
		packingEfficiency,
	};
}


