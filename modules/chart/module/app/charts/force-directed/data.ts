import type { ForceDirectedData, ChartData } from '@/module/app/types/chart-basic';
import { calculateNodeSize, calculateNodeColor } from './utils';

/**
 * Generate force-directed network data
 */
export function generateForceDirectedData(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
	}>,
	links: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
		strength?: number;
	}>,
	options: {
		title?: string;
		nodeSize?: "fixed" | "value" | "degree";
		linkWidth?: "fixed" | "value";
		colorBy?: "group" | "value" | "degree" | "none";
		showLabels?: boolean;
		labelSize?: number;
		physics?: {
			repulsion?: number;
			attraction?: number;
			gravity?: number;
			damping?: number;
			maxVelocity?: number;
		};
	} = {},
): ForceDirectedData {
	const {
		title,
		nodeSize = "degree",
		linkWidth = "value",
		colorBy = "group",
		showLabels = true,
		labelSize = 12,
		physics = {},
	} = options;

	// Process nodes
	const processedNodes = nodes.map((node, index) => {
		// Calculate degree for sizing/coloring
		const degree = links.filter(
			(link) => link.source === node.id || link.target === node.id,
		).length;

		const size = calculateNodeSize(nodeSize, node, degree);
		const color = calculateNodeColor(colorBy, node, degree, index);

		return {
			id: node.id,
			name: node.name,
			group: node.group,
			value: node.value,
			color,
			size,
			degree,
		};
	});

	// Process links
	const processedLinks = links.map((link) => {
		let width = 1;

		switch (linkWidth) {
			case "value":
				width = link.value ? Math.sqrt(link.value) + 1 : 1;
				break;
			case "fixed":
			default:
				width = 1;
		}

		return {
			source: link.source,
			target: link.target,
			value: link.value,
			color: link.color || "#999",
			strength: link.strength || 1,
			width,
		};
	});

	return {
		title: title || "Force-Directed Network",
		series: [],
		nodes: processedNodes,
		links: processedLinks,
	};
}

/**
 * Generate force-directed network from adjacency matrix
 */
export function generateForceDirectedFromMatrix(
	nodeNames: string[],
	adjacencyMatrix: number[][],
	options: {
		title?: string;
		nodeGroups?: string[];
		nodeValues?: number[];
		threshold?: number; // Minimum link strength to include
	} = {},
): ForceDirectedData {
	const { nodeGroups, nodeValues, threshold = 0, ...otherOptions } = options;

	const nodes = nodeNames.map((name, index) => ({
		id: name,
		name,
		group: nodeGroups?.[index],
		value: nodeValues?.[index],
		size: undefined,
		color: undefined,
	}));

	const links: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
		strength?: number;
	}> = [];

	for (let i = 0; i < adjacencyMatrix.length; i++) {
		for (let j = i + 1; j < adjacencyMatrix[i].length; j++) {
			const strength = adjacencyMatrix[i][j];
			if (strength > threshold) {
				links.push({
					source: nodeNames[i],
					target: nodeNames[j],
					value: strength,
					strength,
				});
			}
		}
	}

	return generateForceDirectedData(nodes, links, otherOptions);
}

/**
 * Generate clustered force-directed network
 */
export function generateClusteredForceDirected(
	clusters: Array<{
		name: string;
		nodes: Array<{
			id: string;
			name: string;
			value?: number;
			color?: string;
		}>;
		color?: string;
		centerX?: number;
		centerY?: number;
	}>,
	interClusterLinks: Array<{
		source: string;
		target: string;
		value?: number;
	}>,
	options: {
		title?: string;
		intraClusterRepulsion?: number;
		interClusterAttraction?: number;
	} = {},
): ForceDirectedData {
	const {
		title,
		intraClusterRepulsion = 50,
		interClusterAttraction = 0.005,
	} = options;

	// Flatten nodes with cluster information
	const allNodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
		clusterCenterX?: number;
		clusterCenterY?: number;
	}> = [];

	clusters.forEach((cluster) => {
		cluster.nodes.forEach((node) => {
			allNodes.push({
				...node,
				group: cluster.name,
				color: node.color || cluster.color,
				clusterCenterX: cluster.centerX,
				clusterCenterY: cluster.centerY,
			});
		});
	});

	// Create all links (intra-cluster and inter-cluster)
	const allLinks: Array<{
		source: string;
		target: string;
		value?: number;
		strength?: number;
	}> = [];

	// Add inter-cluster links
	interClusterLinks.forEach((link) => {
		allLinks.push({
			...link,
			strength: link.value,
		});
	});

	// Add intra-cluster links (simplified - connect nearby nodes)
	clusters.forEach((cluster) => {
		const clusterNodes = cluster.nodes;
		for (let i = 0; i < clusterNodes.length; i++) {
			for (let j = i + 1; j < clusterNodes.length; j++) {
				// Add weak intra-cluster links
				allLinks.push({
					source: clusterNodes[i].id,
					target: clusterNodes[j].id,
					value: 0.1,
					strength: 0.1,
				});
			}
		}
	});

	return generateForceDirectedData(allNodes, allLinks, { title });
}


