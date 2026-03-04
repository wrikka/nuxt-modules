import type { ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import type { DendrogramData } from './dendrogram-types';
import {
	performHierarchicalClustering,
	cutTreeAtHeight,
} from './dendrogram-data';
import { calculateDendrogramPositions } from './dendrogram-layout';

// Re-export types
export type { DendrogramData } from './dendrogram-types';

/**
 * Generate dendrogram data from hierarchical clustering
 */
export function generateDendrogramData(
	data: Array<{
		id: string;
		name: string;
		values: number[];
	}>,
	options: {
		title?: string;
		linkage?: "single" | "complete" | "average" | "centroid";
		distanceMetric?: "euclidean" | "manhattan" | "cosine";
		orientation?: "top" | "bottom" | "left" | "right";
		showLabels?: boolean;
		colorByCluster?: boolean;
		maxClusters?: number;
	} = {},
): DendrogramData {
	const {
		title,
		linkage = "average",
		distanceMetric = "euclidean",
		orientation = "top",
		showLabels = true,
		colorByCluster = true,
		maxClusters = 5,
	} = options;

	// Perform hierarchical clustering
	const clustering = performHierarchicalClustering(
		data,
		linkage,
		distanceMetric,
	);

	// Cut the tree to get clusters
	const clusters = cutTreeAtHeight(clustering.tree, maxClusters);

	// Calculate positions for visualization
	const positions = calculateDendrogramPositions(clustering.tree, orientation);

	// Create nodes and links
	const nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		level: number;
		cluster?: number;
		color?: string;
	}> = [];

	const links: Array<{
		source: string;
		target: string;
		distance: number;
		color?: string;
	}> = [];

	// Process tree nodes
	function processTreeNode(node: any, level: number = 0): void {
		const nodeId = `node_${node.id}`;

		nodes.push({
			id: nodeId,
			name: node.name || `Cluster ${node.id}`,
			x: positions.get(nodeId)?.x || 0,
			y: positions.get(nodeId)?.y || 0,
			level,
			cluster: node.cluster,
			color:
				colorByCluster && node.cluster !== undefined
					? getSeriesColor(node.cluster)
					: getSeriesColor(level),
		});

		if (node.left) {
			const leftId = `node_${node.left.id}`;
			links.push({
				source: nodeId,
				target: leftId,
				distance: node.leftDistance || 0,
				color: getSeriesColor(level),
			});
			processTreeNode(node.left, level + 1);
		}

		if (node.right) {
			const rightId = `node_${node.right.id}`;
			links.push({
				source: nodeId,
				target: rightId,
				distance: node.rightDistance || 0,
				color: getSeriesColor(level),
			});
			processTreeNode(node.right, level + 1);
		}
	}

	processTreeNode(clustering.tree);

	// Get leaf nodes (original data points)
	const leafNodes = data.map((item, index) => ({
		id: item.id,
		name: item.name,
		cluster: clusters[index] || 0,
	}));

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Dendrogram",
				data: nodes.map((node) => ({
					x: node.x,
					y: node.y,
					label: showLabels ? node.name : undefined,
					color: node.color,
				})),
				type: "dendrogram" as const,
			},
		],
	};

	return {
		...chartData,
		nodes,
		links,
		height: clustering.height,
		leafNodes,
	};
}

/**
 * Generate dendrogram from distance matrix
 */
export function generateDendrogramFromDistances(
	distanceMatrix: number[][],
	labels: string[],
	options: {
		title?: string;
		linkage?: "single" | "complete" | "average";
	} = {},
): DendrogramData {
	const { title, linkage = "average" } = options;

	// Convert distance matrix to data format
	const data = labels.map((label, index) => ({
		id: `item_${index}`,
		name: label,
		values: distanceMatrix[index] || [],
	}));

	return generateDendrogramData(data, { title, linkage });
}

/**
 * Prune dendrogram to specific height
 */
export function pruneDendrogram(
	dendrogram: DendrogramData,
	height: number,
): DendrogramData {
	// Simplified pruning - remove nodes above height
	const prunedNodes = dendrogram.nodes.filter((node) => node.level <= height);
	const prunedLinks = dendrogram.links.filter((link) => {
		const sourceNode = prunedNodes.find((n) => n.id === link.source);
		const targetNode = prunedNodes.find((n) => n.id === link.target);
		return sourceNode && targetNode && link.distance <= height;
	});

	return {
		...dendrogram,
		nodes: prunedNodes,
		links: prunedLinks,
	};
}

// Re-export statistics function
export { calculateDendrogramStatistics } from './dendrogram-statistics';


