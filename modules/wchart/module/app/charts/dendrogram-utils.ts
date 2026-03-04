/**
 * Calculate distance between two vectors
 */
export function calculateVectorDistance(
	v1: number[],
	v2: number[],
	metric: "euclidean" | "manhattan" | "cosine",
): number {
	switch (metric) {
		case "euclidean":
			return Math.sqrt(
				v1.reduce((sum, val, i) => sum + Math.pow(val - v2[i], 2), 0),
			);
		case "manhattan":
			return v1.reduce((sum, val, i) => sum + Math.abs(val - v2[i]), 0);
		case "cosine":
			const dotProduct = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
			const mag1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
			const mag2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));
			return mag1 && mag2 ? 1 - dotProduct / (mag1 * mag2) : 0;
		default:
			return 0;
	}
}

/**
 * Calculate distance between clusters based on linkage method
 */
export function calculateClusterDistance(
	cluster1: { items: Array<{ values: number[] }> },
	cluster2: { items: Array<{ values: number[] }> },
	distanceMatrix: number[][],
	linkage: "single" | "complete" | "average" | "centroid",
): number {
	const distances: number[] = [];

	cluster1.items.forEach((item1) => {
		cluster2.items.forEach((item2) => {
			// In practice, you'd look up precomputed distances
			const distance = calculateVectorDistance(
				item1.values,
				item2.values,
				"euclidean",
			);
			distances.push(distance);
		});
	});

	switch (linkage) {
		case "single":
			return Math.min(...distances);
		case "complete":
			return Math.max(...distances);
		case "average":
			return distances.reduce((sum, d) => sum + d, 0) / distances.length;
		case "centroid":
			// Simplified centroid distance
			return calculateVectorDistance(
				calculateCentroid(cluster1.items),
				calculateCentroid(cluster2.items),
				"euclidean",
			);
		default:
			return Math.min(...distances);
	}
}

/**
 * Calculate centroid of cluster
 */
export function calculateCentroid(
	items: Array<{ values: number[] }>,
): number[] {
	if (items.length === 0) return [];

	const dimensions = items[0].values.length;
	const centroid = new Array(dimensions).fill(0);

	items.forEach((item) => {
		item.values.forEach((val, i) => {
			centroid[i] += val;
		});
	});

	return centroid.map((val) => val / items.length);
}


