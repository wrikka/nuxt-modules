import type { ChartData } from '@/module/app/types/chart-basic';
import type { ClusterData } from "../types/cluster";
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { calculateClusterStatistics } from "../utils/cluster-utils";
import { kMeansClustering } from './algorithms/cluster-kmeans';
import { hierarchicalClustering } from './algorithms/cluster-hierarchical';
import { dbscanClustering } from './algorithms/cluster-dbscan';

/**
 * Cluster utilities - Cluster analysis visualizations
 */

/**
 * Generate cluster visualization data
 */
export function generateClusterData(
	points: Array<{
		id: string;
		x: number;
		y: number;
		cluster?: number;
		color?: string;
	}>,
	options: {
		title?: string;
		algorithm?: "kmeans" | "hierarchical" | "dbscan" | "manual";
		clusters?: number;
		showCentroids?: boolean;
		centroidSize?: number;
		pointSize?: number;
		colorByCluster?: boolean;
		distanceMetric?: "euclidean" | "manhattan";
	} = {},
): ClusterData {
	const {
		title,
		algorithm = "kmeans",
		clusters: requestedClusters,
		showCentroids = true,
		centroidSize = 12,
		pointSize = 6,
		colorByCluster = true,
		distanceMetric = "euclidean",
	} = options;

	// Perform clustering if not already clustered
	let clusteredPoints = points.map((p) => ({
		id: p.id,
		x: p.x,
		y: p.y,
		cluster: p.cluster || 0,
		color: p.color,
	}));

	if (algorithm !== "manual" && !points.every((p) => p.cluster !== undefined)) {
		clusteredPoints = performClustering(points, {
			algorithm,
			clusters: requestedClusters || 3,
			distanceMetric,
		});
	}

	// Assign colors based on clusters
	const uniqueClusters = [...new Set(clusteredPoints.map((p) => p.cluster))];
	const clusterColors = new Map<number, string>();

	uniqueClusters.forEach((cluster, index) => {
		clusterColors.set(cluster, getSeriesColor(index));
	});

	const coloredPoints = clusteredPoints.map((point) => ({
		...point,
		color: colorByCluster
			? clusterColors.get(point.cluster)
			: point.color || getSeriesColor(0),
		size: pointSize,
	}));

	// Calculate centroids
	const centroids: Array<{
		cluster: number;
		x: number;
		y: number;
		color: string;
		size: number;
	}> = [];

	if (showCentroids) {
		uniqueClusters.forEach((cluster) => {
			const clusterPoints = coloredPoints.filter((p) => p.cluster === cluster);
			if (clusterPoints.length > 0) {
				const centroidX =
					clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
				const centroidY =
					clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;

				centroids.push({
					cluster,
					x: centroidX,
					y: centroidY,
					color: clusterColors.get(cluster)!,
					size: centroidSize,
				});
			}
		});
	}

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Data Points",
				data: coloredPoints.map((point) => ({
					x: point.x,
					y: point.y,
					label: point.id,
					color: point.color,
					size: point.size,
				})),
				type: "cluster" as const,
			},
		],
	};

	// Add centroids series
	if (centroids.length > 0) {
		chartData.series.push({
			name: "Centroids",
			data: centroids.map((centroid) => ({
				x: centroid.x,
				y: centroid.y,
				label: `Cluster ${centroid.cluster}`,
				color: centroid.color,
				size: centroid.size,
			})),
			type: "scatter",
		});
	}

	return {
		...chartData,
		points: coloredPoints,
		centroids,
		clusters: uniqueClusters.length,
		algorithm,
	};
}

/**
 * Perform clustering algorithm
 */
function performClustering(
	points: Array<{ id: string; x: number; y: number; cluster?: number }>,
	options: {
		algorithm: "kmeans" | "hierarchical" | "dbscan";
		clusters?: number;
		distanceMetric: "euclidean" | "manhattan";
	},
): Array<{
	id: string;
	x: number;
	y: number;
	cluster: number;
	color?: string;
}> {
	switch (options.algorithm) {
		case "kmeans":
			return kMeansClustering(
				points,
				options.clusters || 3,
				options.distanceMetric,
			);
		case "hierarchical":
			return hierarchicalClustering(
				points,
				options.clusters || 3,
				options.distanceMetric,
			);
		case "dbscan":
			return dbscanClustering(points, options.distanceMetric);
		default:
			return points.map((p) => ({
				id: p.id,
				x: p.x,
				y: p.y,
				cluster: p.cluster || 0,
			}));
	}
}


