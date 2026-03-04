import type { ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

import type { PositionedNode3D } from './graph3d-positioning/types';
import { positionForceGraph3D } from './graph3d-positioning/force';
import { positionGridGraph3D } from './graph3d-positioning/grid';
import { positionSphereGraph3D } from './graph3d-positioning/sphere';
import { positionTreeGraph3D } from './graph3d-positioning/tree';
import { positionRandomGraph3D } from './graph3d-positioning/random';
import { calculateGraph3DStatistics } from './graph3d-positioning/stats';

/**
 * Graph 3D utilities - 3D graph visualizations
 */

export interface Graph3DData extends ChartData {
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
		shape?: "sphere" | "cube" | "cylinder";
	}>;
	edges: Array<{
		source: string;
		target: string;
		x1: number;
		y1: number;
		z1: number;
		x2: number;
		y2: number;
		z2: number;
		value?: number;
		color?: string;
		width?: number;
		style?: "solid" | "dashed" | "dotted";
	}>;
	bounds: {
		x: { min: number; max: number };
		y: { min: number; max: number };
		z: { min: number; max: number };
	};
	camera: {
		position: { x: number; y: number; z: number };
		target: { x: number; y: number; z: number };
		up: { x: number; y: number; z: number };
	};
}

/**
 * Position graph nodes in 3D space
 */
function positionGraphNodes3D(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
		shape?: "sphere" | "cube" | "cylinder";
	}>,
	edges: Array<{
		source: string;
		target: string;
	}>,
	layout: "force" | "grid" | "sphere" | "tree" | "random",
	dimensions: { width: number; height: number; depth: number },
	nodeSize: string,
	colorBy: string,
	nodeDegrees: Map<string, number>,
): PositionedNode3D[] {
	switch (layout) {
		case "force":
			return positionForceGraph3D(
				nodes,
				edges,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
		case "grid":
			return positionGridGraph3D(
				nodes,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
		case "sphere":
			return positionSphereGraph3D(
				nodes,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
		case "tree":
			return positionTreeGraph3D(
				nodes,
				edges,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
		case "random":
		default:
			return positionRandomGraph3D(
				nodes,
				dimensions,
				nodeSize,
				colorBy,
				nodeDegrees,
			);
	}
}

/**
 * Generate 3D graph data
 */
export function generateGraph3DData(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
		shape?: "sphere" | "cube" | "cylinder";
	}>,
	edges: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
		width?: number;
		style?: "solid" | "dashed" | "dotted";
	}>,
	options: {
		title?: string;
		layout?: "force" | "grid" | "sphere" | "tree" | "random";
		nodeSize?: "fixed" | "value" | "degree";
		edgeWidth?: "fixed" | "value";
		colorBy?: "group" | "value" | "degree" | "community";
		dimensions?: { width: number; height: number; depth: number };
		camera?: {
			position: { x: number; y: number; z: number };
			target: { x: number; y: number; z: number };
		};
	} = {},
): Graph3DData {
	const {
		title,
		layout = "force",
		nodeSize = "degree",
		edgeWidth = "value",
		colorBy = "group",
		dimensions = { width: 800, height: 600, depth: 400 },
		camera = {
			position: { x: 400, y: 300, z: 600 },
			target: { x: 400, y: 300, z: 0 },
		},
	} = options;

	// Calculate node degrees for sizing/coloring
	const nodeDegrees = new Map<string, number>();
	nodes.forEach((node) => nodeDegrees.set(node.id, 0));

	edges.forEach((edge) => {
		nodeDegrees.set(edge.source, (nodeDegrees.get(edge.source) || 0) + 1);
		nodeDegrees.set(edge.target, (nodeDegrees.get(edge.target) || 0) + 1);
	});

	// Position nodes based on layout
	const positionedNodes = positionGraphNodes3D(
		nodes,
		edges,
		layout,
		dimensions,
		nodeSize,
		colorBy,
		nodeDegrees,
	);

	// Create edges with coordinates
	const nodeMap = new Map(positionedNodes.map((node) => [node.id, node]));
	const positionedEdges = edges.map((edge) => {
		const sourceNode = nodeMap.get(edge.source);
		const targetNode = nodeMap.get(edge.target);

		if (!sourceNode || !targetNode) {
			throw new Error(
				`Edge references non-existent node: ${edge.source} -> ${edge.target}`,
			);
		}

		let width = 1;
		switch (edgeWidth) {
			case "value":
				width = Math.max(1, Math.sqrt(edge.value || 1));
				break;
			case "fixed":
			default:
				width = edge.width || 1;
		}

		return {
			source: edge.source,
			target: edge.target,
			x1: sourceNode.x,
			y1: sourceNode.y,
			z1: sourceNode.z,
			x2: targetNode.x,
			y2: targetNode.y,
			z2: targetNode.z,
			value: edge.value,
			color: edge.color || "#999",
			width,
			style: edge.style || "solid",
		};
	});

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "3D Graph",
				data: positionedNodes.map((node) => ({
					x: node.x,
					y: node.y,
					label: node.name,
					color: node.color,
					value: node.value,
				})),
				type: "graph3d" as const,
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

	const centerX = (bounds.x.min + bounds.x.max) / 2;
	const centerY = (bounds.y.min + bounds.y.max) / 2;
	const centerZ = (bounds.z.min + bounds.z.max) / 2;

	return {
		...chartData,
		nodes: positionedNodes,
		edges: positionedEdges,
		bounds,
		camera: {
			position: camera.position,
			target: { x: centerX, y: centerY, z: centerZ },
			up: { x: 0, y: 1, z: 0 },
		},
	};
}

/**
 * Generate 3D graph from adjacency matrix
 */
export function generateGraph3DFromMatrix(
	nodeNames: string[],
	adjacencyMatrix: number[][],
	options: {
		title?: string;
		threshold?: number;
	} = {},
): Graph3DData {
	const { title, threshold = 0 } = options;

	const nodes = nodeNames.map((name) => ({
		id: name,
		name,
		color: undefined,
		size: undefined,
		shape: "sphere" as const,
	}));

	const edges: Array<{
		source: string;
		target: string;
		value?: number;
	}> = [];

	for (let i = 0; i < adjacencyMatrix.length; i++) {
		for (let j = i + 1; j < adjacencyMatrix[i].length; j++) {
			const value = adjacencyMatrix[i][j];
			if (value > threshold) {
				edges.push({
					source: nodeNames[i],
					target: nodeNames[j],
					value,
				});
			}
		}
	}

	return generateGraph3DData(nodes, edges, { title });
}

/**
 * Rotate 3D graph view
 */
export function rotateGraph3D(
	graph: Graph3DData,
	rotation: { x: number; y: number; z: number },
): Graph3DData {
	// Simplified rotation around Y axis
	const cosY = Math.cos(rotation.y);
	const sinY = Math.sin(rotation.y);

	const rotatedNodes = graph.nodes.map((node) => ({
		...node,
		x: node.x * cosY - node.z * sinY,
		z: node.x * sinY + node.z * cosY,
	}));

	const rotatedEdges = graph.edges.map((edge) => {
		const sourceNode = rotatedNodes.find((n) => n.id === edge.source);
		const targetNode = rotatedNodes.find((n) => n.id === edge.target);

		return {
			...edge,
			x1: sourceNode?.x || edge.x1,
			y1: sourceNode?.y || edge.y1,
			z1: sourceNode?.z || edge.z1,
			x2: targetNode?.x || edge.x2,
			y2: targetNode?.y || edge.y2,
			z2: targetNode?.z || edge.z2,
		};
	});

	return {
		...graph,
		nodes: rotatedNodes,
		edges: rotatedEdges,
	};
}

export { calculateGraph3DStatistics };


