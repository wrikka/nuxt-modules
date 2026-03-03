/**
 * K-means clustering implementation
 */
import { calculateDistance } from "../utils/cluster-utils";

export function kMeansClustering(
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

	// Initialize centroids randomly
	let centroids: Array<{ x: number; y: number }> = [];
	for (let i = 0; i < k; i++) {
		const randomIndex = Math.floor(Math.random() * points.length);
		centroids.push({ x: points[randomIndex].x, y: points[randomIndex].y });
	}

	let assignments: number[] = new Array(points.length).fill(0);
	let changed = true;
	let iterations = 0;
	const maxIterations = 100;

	while (changed && iterations < maxIterations) {
		changed = false;
		iterations++;

		// Assign points to nearest centroid
		for (let i = 0; i < points.length; i++) {
			let minDistance = Infinity;
			let nearestCentroid = 0;

			for (let j = 0; j < k; j++) {
				const distance = calculateDistance(
					points[i],
					centroids[j],
					distanceMetric,
				);
				if (distance < minDistance) {
					minDistance = distance;
					nearestCentroid = j;
				}
			}

			if (assignments[i] !== nearestCentroid) {
				assignments[i] = nearestCentroid;
				changed = true;
			}
		}

		// Update centroids
		for (let j = 0; j < k; j++) {
			const clusterPoints = points.filter((_, i) => assignments[i] === j);
			if (clusterPoints.length > 0) {
				centroids[j] = {
					x:
						clusterPoints.reduce((sum, p) => sum + p.x, 0) /
						clusterPoints.length,
					y:
						clusterPoints.reduce((sum, p) => sum + p.y, 0) /
						clusterPoints.length,
				};
			}
		}
	}

	return points.map((point, index) => ({
		id: point.id,
		x: point.x,
		y: point.y,
		cluster: assignments[index],
	}));
}


