/**
 * Calculate ternary plot statistics
 */
export function calculateTernaryStatistics(
	points: Array<{ a: number; b: number; c: number; value?: number }>,
): {
	points: {
		count: number;
		validPoints: number;
		invalidPoints: number;
	};
	composition: {
		meanA: number;
		meanB: number;
		meanC: number;
		stdA: number;
		stdB: number;
		stdC: number;
		dominantComponent: "a" | "b" | "c";
	};
	value:
		| {
				mean: number;
				median: number;
				min: number;
				max: number;
				std: number;
		  }
		| undefined;
	distribution: {
		centroid: { a: number; b: number; c: number };
		spread: number;
		clusters: number;
	};
} {
	const n = points.length;

	// Check validity (components should sum to 1)
	const validPoints = points.filter((p) => {
		const sum = p.a + p.b + p.c;
		return Math.abs(sum - 1) < 0.01;
	});

	const invalidPoints = n - validPoints.length;

	// Calculate composition statistics
	const meanA =
		validPoints.reduce((sum, p) => sum + p.a, 0) / validPoints.length;
	const meanB =
		validPoints.reduce((sum, p) => sum + p.b, 0) / validPoints.length;
	const meanC =
		validPoints.reduce((sum, p) => sum + p.c, 0) / validPoints.length;

	const varianceA =
		validPoints.reduce((sum, p) => sum + Math.pow(p.a - meanA, 2), 0) /
		validPoints.length;
	const varianceB =
		validPoints.reduce((sum, p) => sum + Math.pow(p.b - meanB, 2), 0) /
		validPoints.length;
	const varianceC =
		validPoints.reduce((sum, p) => sum + Math.pow(p.c - meanC, 2), 0) /
		validPoints.length;

	const stdA = Math.sqrt(varianceA);
	const stdB = Math.sqrt(varianceB);
	const stdC = Math.sqrt(varianceC);

	// Determine dominant component
	const means = { a: meanA, b: meanB, c: meanC };
	const dominantComponent = Object.entries(means).reduce((a, b) =>
		a[1] > b[1] ? a : b,
	)[0] as "a" | "b" | "c";

	// Calculate centroid
	const centroid = { a: meanA, b: meanB, c: meanC };

	// Calculate spread (average distance from centroid)
	const spread =
		validPoints.reduce((sum, p) => {
			const distance = Math.sqrt(
				Math.pow(p.a - centroid.a, 2) +
					Math.pow(p.b - centroid.b, 2) +
					Math.pow(p.c - centroid.c, 2),
			);
			return sum + distance;
		}, 0) / validPoints.length;

	// Value statistics (if available)
	const pointsWithValues = validPoints.filter((p) => p.value !== undefined);
	let valueStats = undefined;

	if (pointsWithValues.length > 0) {
		const values = pointsWithValues.map((p) => p.value!);
		const sortedValues = [...values].sort((a, b) => a - b);

		valueStats = {
			mean: values.reduce((sum, v) => sum + v, 0) / values.length,
			median: sortedValues[Math.floor(sortedValues.length / 2)],
			min: sortedValues[0],
			max: sortedValues[sortedValues.length - 1],
			std: Math.sqrt(
				values.reduce((sum, v, _, arr) => {
					const mean = arr.reduce((s, val) => s + val, 0) / arr.length;
					return sum + Math.pow(v - mean, 2);
				}, 0) / values.length,
			),
		};
	}

	// Simplified cluster detection (count of distinct regions)
	// In practice, you'd use clustering algorithms
	const clusters = Math.max(1, Math.floor(validPoints.length / 10));

	return {
		points: {
			count: n,
			validPoints: validPoints.length,
			invalidPoints,
		},
		composition: {
			meanA,
			meanB,
			meanC,
			stdA,
			stdB,
			stdC,
			dominantComponent,
		},
		value: valueStats,
		distribution: {
			centroid,
			spread,
			clusters,
		},
	};
}


