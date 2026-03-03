import type { ScatterData, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Find outliers using statistical methods (IQR method)
 */
export function findOutliers(data: ScatterData): {
	outliers: DataPoint[];
	inliers: DataPoint[];
} {
	const series = data.series[0];
	if (!series) return { outliers: [], inliers: [] };

	const yValues = series.data
		.filter((p) => typeof p.y === "number")
		.map((p) => p.y as number)
		.sort((a, b) => a - b);

	const q1 = yValues[Math.floor(yValues.length * 0.25)];
	const q3 = yValues[Math.floor(yValues.length * 0.75)];
	const iqr = q3 - q1;
	const lowerBound = q1 - 1.5 * iqr;
	const upperBound = q3 + 1.5 * iqr;

	const outliers: DataPoint[] = [];
	const inliers: DataPoint[] = [];

	series.data.forEach((point) => {
		const y = typeof point.y === "number" ? point.y : 0;
		if (y < lowerBound || y > upperBound) {
			outliers.push(point);
		} else {
			inliers.push(point);
		}
	});

	return { outliers, inliers };
}

/**
 * Perform simple k-means clustering on scatter plot data
 */
export function performKMeansClustering(
	data: ScatterData,
	k: number = 3,
	maxIterations: number = 100,
): Array<{ centroid: { x: number; y: number }; points: DataPoint[] }> {
	const series = data.series[0];
	if (!series || series.data.length < k) return [];

	const points = series.data.filter(
		(p) => typeof p.x === "number" && typeof p.y === "number",
	) as Array<{ x: number; y: number; label?: string; color?: string }>;

	// Initialize centroids randomly
	let centroids = points.slice(0, k).map((p) => ({ x: p.x, y: p.y }));
	let clusters: DataPoint[][];

	for (let iteration = 0; iteration < maxIterations; iteration++) {
		// Assign points to nearest centroid
		clusters = Array.from({ length: k }, () => []);

		points.forEach((point) => {
			let minDistance = Infinity;
			let closestCentroidIndex = 0;

			centroids.forEach((centroid, index) => {
				const distance = Math.sqrt(
					Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2),
				);
				if (distance < minDistance) {
					minDistance = distance;
					closestCentroidIndex = index;
				}
			});

			clusters[closestCentroidIndex].push(point);
		});

		// Update centroids
		const newCentroids = centroids.map((_, index) => {
			const cluster = clusters[index];
			if (cluster.length === 0) return centroids[index];

			const sumX = cluster.reduce((sum, p) => sum + (p.x as number), 0);
			const sumY = cluster.reduce((sum, p) => sum + (p.y as number), 0);

			return {
				x: sumX / cluster.length,
				y: sumY / cluster.length,
			};
		});

		// Check for convergence
		const converged = centroids.every(
			(centroid, index) =>
				Math.abs(centroid.x - newCentroids[index].x) < 0.001 &&
				Math.abs(centroid.y - newCentroids[index].y) < 0.001,
		);

		centroids = newCentroids;

		if (converged) break;
	}

	return centroids.map((centroid, index) => ({
		centroid,
		points: clusters[index],
	}));
}


