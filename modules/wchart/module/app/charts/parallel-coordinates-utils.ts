/**
 * Calculate Pearson correlation (helper function)
 */
export function calculatePearsonCorrelation(
	array1: number[],
	array2: number[],
): number {
	const validPairs: Array<[number, number]> = [];

	for (let i = 0; i < Math.min(array1.length, array2.length); i++) {
		const val1 = array1[i];
		const val2 = array2[i];
		if (!isNaN(val1) && !isNaN(val2) && val1 !== null && val2 !== null) {
			validPairs.push([val1, val2]);
		}
	}

	if (validPairs.length < 2) return 0;

	const n = validPairs.length;
	const mean1 = validPairs.reduce((sum, [val1]) => sum + val1, 0) / n;
	const mean2 = validPairs.reduce((sum, [, val2]) => sum + val2, 0) / n;

	let covariance = 0;
	let variance1 = 0;
	let variance2 = 0;

	for (const [val1, val2] of validPairs) {
		const diff1 = val1 - mean1;
		const diff2 = val2 - mean2;
		covariance += diff1 * diff2;
		variance1 += diff1 * diff1;
		variance2 += diff2 * diff2;
	}

	const std1 = Math.sqrt(variance1);
	const std2 = Math.sqrt(variance2);

	if (std1 === 0 || std2 === 0) return 0;

	return covariance / (std1 * std2);
}

/**
 * Simple k-means clustering
 */
export function performSimpleClustering(
	data: Array<Record<string, number>>,
	k: number,
): Array<{
	centroid: Record<string, number>;
	size: number;
	members: number[];
}> {
	if (data.length === 0 || k <= 0) return [];

	const dimensions = Object.keys(data[0]);
	let centroids: Array<Record<string, number>> = [];

	// Initialize centroids randomly
	for (let i = 0; i < k; i++) {
		const randomIndex = Math.floor(Math.random() * data.length);
		centroids.push({ ...data[randomIndex] });
	}

	// Simple k-means (limited iterations for performance)
	for (let iter = 0; iter < 10; iter++) {
		const clusters: Array<{
			centroid: Record<string, number>;
			members: number[];
			size: number;
		}> = centroids.map((centroid) => ({
			centroid: { ...centroid },
			members: [],
			size: 0,
		}));

		// Assign points to nearest centroid
		data.forEach((record, index) => {
			let minDistance = Infinity;
			let nearestCluster = 0;

			clusters.forEach((cluster, clusterIndex) => {
				let distance = 0;
				dimensions.forEach((dim) => {
					const diff = record[dim] - cluster.centroid[dim];
					distance += diff * diff;
				});
				distance = Math.sqrt(distance);

				if (distance < minDistance) {
					minDistance = distance;
					nearestCluster = clusterIndex;
				}
			});

			clusters[nearestCluster].members.push(index);
		});

		// Update centroids
		clusters.forEach((cluster) => {
			cluster.size = cluster.members.length;
			if (cluster.size > 0) {
				dimensions.forEach((dim) => {
					const sum = cluster.members.reduce(
						(total, memberIndex) => total + data[memberIndex][dim],
						0,
					);
					cluster.centroid[dim] = sum / cluster.size;
				});
			}
		});

		centroids = clusters.map((c) => c.centroid);

		// Return final clusters
		if (iter === 9) {
			return clusters;
		}
	}

	return [];
}


