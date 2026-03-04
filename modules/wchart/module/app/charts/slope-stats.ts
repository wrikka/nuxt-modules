/**
 * Calculate slope chart statistics
 */
export function calculateSlopeStatistics(
	slopes: Array<{
		start: { y: number };
		end: { y: number };
		label: string;
	}>,
): {
	totalSlopes: number;
	averageSlope: number;
	medianSlope: number;
	slopeRange: { min: number; max: number };
	directions: {
		up: number;
		down: number;
		flat: number;
		percentages: { up: number; down: number; flat: number };
	};
	changes: {
		averageChange: number;
		totalChange: number;
		largestIncrease: { label: string; change: number };
		largestDecrease: { label: string; change: number };
	};
	percentChanges: {
		averagePercentChange: number;
		largestPercentIncrease: { label: string; percent: number };
		largestPercentDecrease: { label: string; percent: number };
	};
} {
	const slopeValues = slopes.map((slope) => {
		const dx = 1; // Assume unit distance between start and end
		return (slope.end.y - slope.start.y) / dx;
	});

	const changes = slopes.map((slope) => slope.end.y - slope.start.y);
	const percentChanges = slopes.map((slope) =>
		slope.start.y !== 0
			? (changes[changes.length - 1] / slope.start.y) * 100
			: 0,
	);

	const directions = {
		up: changes.filter((c) => c > 0).length,
		down: changes.filter((c) => c < 0).length,
		flat: changes.filter((c) => c === 0).length,
		percentages: {
			up: 0,
			down: 0,
			flat: 0,
		},
	};

	directions.percentages.up = (directions.up / slopes.length) * 100;
	directions.percentages.down = (directions.down / slopes.length) * 100;
	directions.percentages.flat = (directions.flat / slopes.length) * 100;

	// Find largest changes
	let largestIncrease = { label: "", change: -Infinity };
	let largestDecrease = { label: "", change: Infinity };

	slopes.forEach((slope, index) => {
		const change = changes[index];
		if (change > largestIncrease.change) {
			largestIncrease = { label: slope.label, change };
		}
		if (change < largestDecrease.change) {
			largestDecrease = { label: slope.label, change };
		}
	});

	// Find largest percent changes
	let largestPercentIncrease = { label: "", percent: -Infinity };
	let largestPercentDecrease = { label: "", percent: Infinity };

	slopes.forEach((slope, index) => {
		const percent = percentChanges[index];
		if (percent > largestPercentIncrease.percent) {
			largestPercentIncrease = { label: slope.label, percent };
		}
		if (percent < largestPercentDecrease.percent) {
			largestPercentDecrease = { label: slope.label, percent };
		}
	});

	return {
		totalSlopes: slopes.length,
		averageSlope:
			slopeValues.reduce((sum, s) => sum + s, 0) / slopeValues.length,
		medianSlope: slopeValues.sort((a, b) => a - b)[
			Math.floor(slopeValues.length / 2)
		],
		slopeRange: {
			min: Math.min(...slopeValues),
			max: Math.max(...slopeValues),
		},
		directions,
		changes: {
			averageChange: changes.reduce((sum, c) => sum + c, 0) / changes.length,
			totalChange: changes.reduce((sum, c) => sum + c, 0),
			largestIncrease,
			largestDecrease,
		},
		percentChanges: {
			averagePercentChange:
				percentChanges.reduce((sum, p) => sum + p, 0) / percentChanges.length,
			largestPercentIncrease,
			largestPercentDecrease,
		},
	};
}
