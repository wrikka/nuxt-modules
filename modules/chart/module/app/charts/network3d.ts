import type { ChartData } from "../types/base-chart-types";
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { positionNodes3D, calculateNodeColor } from './network3d-positioning';
import { calculateNetwork3DStatistics } from './network3d-statistics';

/**
 * Network 3D utilities - 3D network graphs
 */

export interface Network3DData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		z: number;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
	}>;
	links: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
		width?: number;
	}>;
	bounds: {
		x: { min: number; max: number };
		y: { min: number; max: number };
		z: { min: number; max: number };
	};
}

/**
 * Generate 3D network data
 */
export function generateNetwork3DData(
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
	}>,
	options: {
		title?: string;
		layout?: "force" | "sphere" | "grid" | "random";
		nodeSize?: "fixed" | "value" | "degree";
		linkWidth?: "fixed" | "value";
		colorBy?: "group" | "value" | "degree" | "none";
		dimensions?: { width: number; height: number; depth: number };
	} = {},
): Network3DData {
	const {
		title,
		layout = "force",
		nodeSize = "degree",
		linkWidth = "value",
		colorBy = "group",
		dimensions = { width: 800, height: 600, depth: 400 },
	} = options;

	// Calculate node degrees for sizing/coloring
	const nodeDegrees = new Map<string, number>();
	nodes.forEach((node) => nodeDegrees.set(node.id, 0));

	links.forEach((link) => {
		nodeDegrees.set(link.source, (nodeDegrees.get(link.source) || 0) + 1);
		nodeDegrees.set(link.target, (nodeDegrees.get(link.target) || 0) + 1);
	});

	// Position nodes based on layout
	const positionedNodes = positionNodes3D(
		nodes,
		links,
		layout,
		dimensions,
		nodeSize,
		colorBy,
		nodeDegrees,
	);

	// Process links
	const processedLinks = links.map((link) => ({
		source: link.source,
		target: link.target,
		value: link.value,
		color: link.color || "#999",
		width: linkWidth === "value" ? Math.max(1, Math.sqrt(link.value || 1)) : 2,
	}));

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "3D Network",
				data: positionedNodes.map((node) => ({
					x: node.x,
					y: node.y,
					label: node.name,
					color: node.color,
					value: node.value,
				})),
				type: "network3d" as const,
			},
		],
	};

	// Calculate bounds
	const xCoords = positionedNodes.map((n) => n.x);
	const yCoords = positionedNodes.map((n) => n.y);
	const zCoords = positionedNodes.map((n) => n.z);

	const bounds = {
		x: { min: Math.min(...xCoords), max: Math.max(...xCoords) },
		y: { min: Math.min(...yCoords), max: Math.max(...yCoords) },
		z: { min: Math.min(...zCoords), max: Math.max(...zCoords) },
	};

	return {
		...chartData,
		nodes: positionedNodes,
		links: processedLinks,
		bounds,
	};
}

/**
 * Generate 3D network from adjacency matrix
 */
export function generateNetwork3DFromMatrix(
	nodeNames: string[],
	adjacencyMatrix: number[][],
	options: {
		title?: string;
		threshold?: number;
	} = {},
): Network3DData {
	const { title, threshold = 0 } = options;

	const nodes = nodeNames.map((name) => ({
		id: name,
		name,
		color: undefined,
		size: undefined,
	}));

	const links: Array<{
		source: string;
		target: string;
		value?: number;
	}> = [];

	for (let i = 0; i < adjacencyMatrix.length; i++) {
		for (let j = i + 1; j < adjacencyMatrix[i].length; j++) {
			const value = adjacencyMatrix[i][j];
			if (value > threshold) {
				links.push({
					source: nodeNames[i],
					target: nodeNames[j],
					value,
				});
			}
		}
	}

	return generateNetwork3DData(nodes, links, { title });
}

/**
 * Rotate 3D network view
 */
export function rotateNetwork3D(
	network: Network3DData,
	rotation: { x: number; y: number; z: number },
): Network3DData {
	// Simplified rotation - would need proper 3D transformation matrices
	const rotatedNodes = network.nodes.map((node) => {
		// Apply simple rotation (placeholder implementation)
		const cosX = Math.cos(rotation.x);
		const sinX = Math.sin(rotation.x);
		const cosY = Math.cos(rotation.y);
		const sinY = Math.sin(rotation.y);

		// Rotate around Y axis (simplified)
		const newY = node.y * cosX - node.z * sinX;
		const newZ = node.y * sinX + node.z * cosX;

		return {
			...node,
			y: newY,
			z: newZ,
		};
	});

	return {
		...network,
		nodes: rotatedNodes,
	};
}


