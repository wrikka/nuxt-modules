import {
	calculatePearsonCorrelation,
	performSimpleClustering,
} from './parallel-coordinates-utils';

/**
 * Calculate parallel coordinates statistics
 */
export function calculateParallelCoordinatesStatistics(
	dimensions: string[],
	data: Array<Record<string, number>>,
): {
	dimensionStats: Array<{
		name: string;
		count: number;
		mean: number;
		std: number;
		min: number;
		max: number;
		missing: number;
		outliers: number;
	}>;
	correlations: Array<Array<number>>;
	dimensionImportance: Array<{
		dimension: string;
		variance: number;
		rank: number;
	}>;
	clusters?: Array<{
		centroid: Record<string, number>;
		size: number;
		variance: number;
	}>;
} {
	const dimensionStats = dimensions.map((dim) => {
		const values = data
			.map((record) => record[dim])
			.filter((val) => !isNaN(val) && val !== null);
		const missing = data.length - values.length;

		if (values.length === 0) {
			return {
				name: dim,
				count: 0,
				mean: 0,
				std: 0,
				min: 0,
				max: 0,
				missing,
				outliers: 0,
			};
		}

		const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
		const variance =
			values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
			values.length;
		const std = Math.sqrt(variance);

		// Detect outliers using IQR method
		const sorted = [...values].sort((a, b) => a - b);
		const q1 = sorted[Math.floor(sorted.length * 0.25)];
		const q3 = sorted[Math.floor(sorted.length * 0.75)];
		const iqr = q3 - q1;
		const lowerFence = q1 - 1.5 * iqr;
		const upperFence = q3 + 1.5 * iqr;

		const outliers = values.filter(
			(val) => val < lowerFence || val > upperFence,
		).length;

		return {
			name: dim,
			count: values.length,
			mean,
			std,
			min: Math.min(...values),
			max: Math.max(...values),
			missing,
			outliers,
		};
	});

	// Calculate correlations
	const correlations: Array<Array<number>> = [];
	for (let i = 0; i < dimensions.length; i++) {
		correlations[i] = [];
		for (let j = 0; j < dimensions.length; j++) {
			const values1 = data.map((record) => record[dimensions[i]]);
			const values2 = data.map((record) => record[dimensions[j]]);
			correlations[i][j] = calculatePearsonCorrelation(values1, values2);
		}
	}

	// Calculate dimension importance based on variance
	const dimensionImportance = dimensionStats
		.map((stat) => ({
			dimension: stat.name,
			variance: stat.std * stat.std,
			rank: 0,
		}))
		.sort((a, b) => b.variance - a.variance)
		.map((item, index) => ({ ...item, rank: index + 1 }));

	return {
		dimensionStats,
		correlations,
		dimensionImportance,
	};
}

/**
 * Detect patterns in parallel coordinates
 */
export function detectParallelCoordinatesPatterns(
	dimensions: string[],
	data: Array<Record<string, number>>,
): {
	trends: Array<{
		dimension: string;
		trend: "increasing" | "decreasing" | "stable" | "mixed";
		strength: number;
	}>;
	clusters: Array<{
		centroid: Record<string, number>;
		size: number;
		members: number[];
	}>;
	anomalies: Array<{
		recordIndex: number;
		score: number;
		reason: string;
	}>;
} {
	const trends = dimensions.map((dim) => {
		const values = data
			.map((record) => record[dim])
			.filter((val) => !isNaN(val));
		if (values.length < 2) {
			return {
				dimension: dim,
				trend: "stable" as const,
				strength: 0,
			};
		}

		// Simple trend detection using linear regression slope
		const n = values.length;
		const xMean = (n - 1) / 2;
		const yMean = values.reduce((sum, val) => sum + val, 0) / n;

		let numerator = 0;
		let denominator = 0;

		values.forEach((val, i) => {
			const xDiff = i - xMean;
			const yDiff = val - yMean;
			numerator += xDiff * yDiff;
			denominator += xDiff * xDiff;
		});

		const slope = denominator !== 0 ? numerator / denominator : 0;
		const strength =
			Math.abs(slope) / (values[values.length - 1] - values[0] || 1);

		let trend: "increasing" | "decreasing" | "stable" | "mixed";
		if (Math.abs(slope) < 0.01) trend = "stable";
		else if (slope > 0) trend = "increasing";
		else trend = "decreasing";

		return {
			dimension: dim,
			trend,
			strength,
		};
	});

	// Simple clustering using k-means (k=3)
	const clusters = performSimpleClustering(data, 3);

	// Anomaly detection using distance from centroid
	const anomalies = data
		.map((record, index) => {
			const distances = clusters.map((cluster) => {
				let distance = 0;
				dimensions.forEach((dim) => {
					const diff = record[dim] - cluster.centroid[dim];
					distance += diff * diff;
				});
				return Math.sqrt(distance);
			});

			const minDistance = Math.min(...distances);
			const avgDistance =
				distances.reduce((sum, d) => sum + d, 0) / distances.length;
			const score = minDistance / (avgDistance || 1);

			let reason = "";
			if (score > 2) reason = "Far from all cluster centroids";
			else if (score > 1.5) reason = "Moderate distance from clusters";

			return {
				recordIndex: index,
				score,
				reason,
			};
		})
		.filter((anomaly) => anomaly.reason !== "")
		.sort((a, b) => b.score - a.score);

	return {
		trends,
		clusters,
		anomalies: anomalies.slice(0, 10), // Top 10 anomalies
	};
}


