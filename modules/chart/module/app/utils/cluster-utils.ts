/**
 * Cluster utility functions
 */

/**
 * Calculate distance between two points
 */
export function calculateDistance(
	p1: { x: number; y: number },
	p2: { x: number; y: number },
	metric: "euclidean" | "manhattan" = "euclidean",
): number {
	const dx = p1.x - p2.x;
	const dy = p1.y - p2.y;

	switch (metric) {
		case "euclidean":
			return Math.sqrt(dx * dx + dy * dy);
		case "manhattan":
			return Math.abs(dx) + Math.abs(dy);
		default:
			return Math.sqrt(dx * dx + dy * dy);
	}
}

/**
 * Calculate distance between two clusters (centroid distance)
 */
export function clusterDistance(
	cluster1: Array<{ x: number; y: number }>,
	cluster2: Array<{ x: number; y: number }>,
	metric: "euclidean" | "manhattan" = "euclidean",
): number {
	const centroid1 = {
		x: cluster1.reduce((sum, p) => sum + p.x, 0) / cluster1.length,
		y: cluster1.reduce((sum, p) => sum + p.y, 0) / cluster1.length,
	};

	const centroid2 = {
		x: cluster2.reduce((sum, p) => sum + p.x, 0) / cluster2.length,
		y: cluster2.reduce((sum, p) => sum + p.y, 0) / cluster2.length,
	};

	return calculateDistance(centroid1, centroid2, metric);
}

/**
 * Calculate cluster statistics
 */
export function calculateClusterStatistics(
	points: Array<{ x: number; y: number; cluster: number }>,
): {
	clusters: number;
	clusterSizes: Array<{ cluster: number; size: number; percentage: number }>;
	centroids: Array<{ cluster: number; x: number; y: number }>;
	quality: {
		silhouetteScore: number;
		calinskiHarabaszIndex: number;
		daviesBouldinIndex: number;
	};
	separation: {
		interClusterDistance: number;
		intraClusterDistance: number;
		dunnIndex: number;
	};
} {
	const clusters = [...new Set(points.map((p) => p.cluster))];

	// Calculate cluster sizes
	const clusterSizes = clusters.map((cluster) => {
		const clusterPoints = points.filter((p) => p.cluster === cluster);
		return {
			cluster,
			size: clusterPoints.length,
			percentage: (clusterPoints.length / points.length) * 100,
		};
	});

	// Calculate centroids
	const centroids = clusters.map((cluster) => {
		const clusterPoints = points.filter((p) => p.cluster === cluster);
		const centroid = {
			cluster,
			x: clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length,
			y: clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length,
		};
		return centroid;
	});

	// Calculate quality metrics (simplified)
	const silhouetteScore = calculateSilhouetteScore(points, clusters);
	const calinskiHarabaszIndex = calculateCalinskiHarabaszIndex(
		points,
		clusters,
	);
	const daviesBouldinIndex = calculateDaviesBouldinIndex(points, centroids);

	// Calculate separation metrics
	let totalInterDistance = 0;
	let interPairs = 0;

	for (let i = 0; i < centroids.length; i++) {
		for (let j = i + 1; j < centroids.length; j++) {
			totalInterDistance += calculateDistance(centroids[i], centroids[j]);
			interPairs++;
		}
	}

	const interClusterDistance =
		interPairs > 0 ? totalInterDistance / interPairs : 0;

	let totalIntraDistance = 0;
	clusters.forEach((cluster) => {
		const clusterPoints = points.filter((p) => p.cluster === cluster);
		const centroid = centroids.find((c) => c.cluster === cluster)!;

		clusterPoints.forEach((point) => {
			totalIntraDistance += calculateDistance(point, centroid);
		});
	});

	const intraClusterDistance = totalIntraDistance / points.length;
	const dunnIndex =
		interClusterDistance > 0 ? interClusterDistance / intraClusterDistance : 0;

	return {
		clusters: clusters.length,
		clusterSizes,
		centroids,
		quality: {
			silhouetteScore,
			calinskiHarabaszIndex,
			daviesBouldinIndex,
		},
		separation: {
			interClusterDistance,
			intraClusterDistance,
			dunnIndex,
		},
	};
}

/**
 * Calculate silhouette score (simplified)
 */
function calculateSilhouetteScore(
	points: Array<{ x: number; y: number; cluster: number }>,
	clusters: number[],
): number {
	if (clusters.length <= 1) return 0;

	let totalSilhouette = 0;

	points.forEach((point) => {
		const sameCluster = points.filter(
			(p) => p.cluster === point.cluster && p !== point,
		);
		const otherClusters = clusters.filter((c) => c !== point.cluster);

		// Calculate average distance to same cluster
		const a =
			sameCluster.length > 0
				? sameCluster.reduce((sum, p) => sum + calculateDistance(point, p), 0) /
					sameCluster.length
				: 0;

		// Calculate average distance to nearest other cluster
		let minB = Infinity;
		otherClusters.forEach((cluster) => {
			const clusterPoints = points.filter((p) => p.cluster === cluster);
			if (clusterPoints.length > 0) {
				const avgDistance =
					clusterPoints.reduce(
						(sum, p) => sum + calculateDistance(point, p),
						0,
					) / clusterPoints.length;
				minB = Math.min(minB, avgDistance);
			}
		});

		const b = minB < Infinity ? minB : a;
		const silhouette = (b - a) / Math.max(a, b);
		totalSilhouette += isNaN(silhouette) ? 0 : silhouette;
	});

	return totalSilhouette / points.length;
}

/**
 * Calculate Calinski-Harabasz index (simplified)
 */
function calculateCalinskiHarabaszIndex(
	points: Array<{ x: number; y: number; cluster: number }>,
	clusters: number[],
): number {
	if (clusters.length <= 1) return 0;

	const overallCentroid = {
		x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
		y: points.reduce((sum, p) => sum + p.y, 0) / points.length,
	};

	let betweenClusterSum = 0;
	let withinClusterSum = 0;

	clusters.forEach((cluster) => {
		const clusterPoints = points.filter((p) => p.cluster === cluster);
		const clusterCentroid = {
			x: clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length,
			y: clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length,
		};

		// Between-cluster sum of squares
		betweenClusterSum +=
			clusterPoints.length *
			(Math.pow(clusterCentroid.x - overallCentroid.x, 2) +
				Math.pow(clusterCentroid.y - overallCentroid.y, 2));

		// Within-cluster sum of squares
		clusterPoints.forEach((point) => {
			withinClusterSum +=
				Math.pow(point.x - clusterCentroid.x, 2) +
				Math.pow(point.y - clusterCentroid.y, 2);
		});
	});

	const k = clusters.length;
	const n = points.length;

	return withinClusterSum > 0
		? betweenClusterSum / (k - 1) / (withinClusterSum / (n - k))
		: 0;
}

/**
 * Calculate Davies-Bouldin index (simplified)
 */
function calculateDaviesBouldinIndex(
	points: Array<{ x: number; y: number; cluster: number }>,
	centroids: Array<{ cluster: number; x: number; y: number }>,
): number {
	if (centroids.length <= 1) return 0;

	let totalRatio = 0;

	centroids.forEach((centroid, i) => {
		let maxRatio = 0;

		centroids.forEach((otherCentroid, j) => {
			if (i !== j) {
				const clusterPoints = points.filter(
					(p) => p.cluster === centroid.cluster,
				);
				const otherPoints = points.filter(
					(p) => p.cluster === otherCentroid.cluster,
				);

				// Average distance within clusters
				const avgWithinI =
					clusterPoints.reduce(
						(sum, p) => sum + calculateDistance(p, centroid),
						0,
					) / clusterPoints.length;

				const avgWithinJ =
					otherPoints.reduce(
						(sum, p) => sum + calculateDistance(p, otherCentroid),
						0,
					) / otherPoints.length;

				// Distance between centroids
				const centroidDistance = calculateDistance(centroid, otherCentroid);

				const ratio = (avgWithinI + avgWithinJ) / centroidDistance;
				maxRatio = Math.max(maxRatio, ratio);
			}
		});

		totalRatio += maxRatio;
	});

	return totalRatio / centroids.length;
}
