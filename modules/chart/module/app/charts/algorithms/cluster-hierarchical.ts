/**
 * Hierarchical clustering (simplified agglomerative)
 */
import { clusterDistance } from "../utils/cluster-utils";

export function hierarchicalClustering(
	points: Array<{ id: string; x: number; y: number }>,
	k: number,
	distanceMetric: "euclidean" | "manhattan" = "euclidean",
): Array<{
	id: string;
	x: number;
	y: number;
	cluster: number;
}> {
	if (points.length === 0) return [];

	// Start with each point as its own cluster
	let clusters: Array<Array<{ id: string; x: number; y: number }>> = points.map(
		(p) => [p],
	);

	// Merge clusters until we have k clusters
	while (clusters.length > k) {
		let minDistance = Infinity;
		let mergeIndices = [0, 1];

		// Find closest pair of clusters
		for (let i = 0; i < clusters.length; i++) {
			for (let j = i + 1; j < clusters.length; j++) {
				const distance = clusterDistance(
					clusters[i],
					clusters[j],
					distanceMetric,
				);
				if (distance < minDistance) {
					minDistance = distance;
					mergeIndices = [i, j];
				}
			}
		}

		// Merge the closest clusters
		const [i, j] = mergeIndices;
		clusters[i] = [...clusters[i], ...clusters[j]];
		clusters.splice(j, 1);
	}

	// Assign cluster numbers
	const result: Array<{
		id: string;
		x: number;
		y: number;
		cluster: number;
	}> = [];

	clusters.forEach((cluster, clusterIndex) => {
		cluster.forEach((point) => {
			result.push({
				id: point.id,
				x: point.x,
				y: point.y,
				cluster: clusterIndex,
			});
		});
	});

	return result;
}


