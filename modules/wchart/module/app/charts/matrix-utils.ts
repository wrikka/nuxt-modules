/**
 * Calculate distance between points
 */
export function calculateDistance(
	point1: { x: number; y: number; z?: number },
	point2: { x: number; y: number; z?: number },
	metric: "euclidean" | "manhattan" | "cosine" = "euclidean",
): number {
	switch (metric) {
		case "euclidean":
			const dx = point1.x - point2.x;
			const dy = point1.y - point2.y;
			const dz = (point1.z || 0) - (point2.z || 0);
			return Math.sqrt(dx * dx + dy * dy + dz * dz);

		case "manhattan":
			return (
				Math.abs(point1.x - point2.x) +
				Math.abs(point1.y - point2.y) +
				Math.abs((point1.z || 0) - (point2.z || 0))
			);

		case "cosine":
			const dotProduct =
				point1.x * point2.x +
				point1.y * point2.y +
				(point1.z || 0) * (point2.z || 0);
			const mag1 = Math.sqrt(
				point1.x * point1.x +
					point1.y * point1.y +
					(point1.z || 0) * (point1.z || 0),
			);
			const mag2 = Math.sqrt(
				point2.x * point2.x +
					point2.y * point2.y +
					(point2.z || 0) * (point2.z || 0),
			);
			return mag1 && mag2 ? 1 - dotProduct / (mag1 * mag2) : 0;

		default:
			return 0;
	}
}

/**
 * Calculate correlation coefficient
 */
export function calculateCorrelation(
	array1: number[],
	array2: number[],
	method: "pearson" | "spearman" = "pearson",
): number {
	if (array1.length !== array2.length || array1.length < 2) return 0;

	if (method === "spearman") {
		const ranked1 = getRanks(array1);
		const ranked2 = getRanks(array2);
		return calculatePearsonCorrelation(ranked1, ranked2);
	} else {
		return calculatePearsonCorrelation(array1, array2);
	}
}

/**
 * Calculate Pearson correlation
 */
export function calculatePearsonCorrelation(
	array1: number[],
	array2: number[],
): number {
	const n = array1.length;

	let sum1 = 0,
		sum2 = 0,
		sum1Sq = 0,
		sum2Sq = 0,
		sum12 = 0;

	for (let i = 0; i < n; i++) {
		sum1 += array1[i];
		sum2 += array2[i];
		sum1Sq += array1[i] * array1[i];
		sum2Sq += array2[i] * array2[i];
		sum12 += array1[i] * array2[i];
	}

	const numerator = n * sum12 - sum1 * sum2;
	const denominator = Math.sqrt(
		(n * sum1Sq - sum1 * sum1) * (n * sum2Sq - sum2 * sum2),
	);

	return denominator !== 0 ? numerator / denominator : 0;
}

/**
 * Convert array to ranks for Spearman correlation
 */
export function getRanks(array: number[]): number[] {
	const sorted = array
		.map((val, index) => ({ val, index }))
		.sort((a, b) => a.val - b.val);

	const ranks: number[] = new Array(array.length);
	let currentRank = 1;

	for (let i = 0; i < sorted.length; ) {
		let j = i;
		while (j < sorted.length && sorted[j].val === sorted[i].val) {
			j++;
		}

		const averageRank = (i + j - 1) / 2 + 1;
		for (let k = i; k < j; k++) {
			ranks[sorted[k].index] = averageRank;
		}

		i = j;
	}

	return ranks;
}


