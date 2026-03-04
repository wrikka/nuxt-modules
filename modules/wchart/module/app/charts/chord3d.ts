import type { ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import {
	calculateChord3DLayout,
	calculateChord3DStatistics,
	rotateChord3D,
	generateStyledChord3D,
	filterChord3DByThreshold,
	generateHierarchicalChord3D,
} from './chord3d-utils';

/**
 * Chord 3D utilities - 3D chord diagrams
 */

export interface Chord3DData extends ChartData {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		z: number;
		angle: number;
		radius: number;
		value: number;
		color?: string;
		group?: string;
	}>;
	ribbons: Array<{
		source: string;
		target: string;
		value: number;
		sourceAngle: number;
		targetAngle: number;
		sourceRadius: number;
		targetRadius: number;
		color?: string;
		opacity?: number;
		height?: number;
	}>;
	center: { x: number; y: number; z: number };
	radius: number;
	height: number;
}

/**
 * Generate 3D chord diagram data
 */
export function generateChord3DData(
	matrix: number[][],
	labels: string[],
	options: {
		title?: string;
		centerX?: number;
		centerY?: number;
		centerZ?: number;
		radius?: number;
		height?: number;
		colorScheme?: string[];
		sortBy?: "name" | "value" | "size";
		threshold?: number;
		ribbonOpacity?: number;
		ribbonHeight?: number;
	} = {},
): Chord3DData {
	const {
		title,
		centerX = 400,
		centerY = 300,
		centerZ = 200,
		radius = 150,
		height = 50,
		colorScheme,
		sortBy = "value",
		threshold = 0,
		ribbonOpacity = 0.7,
		ribbonHeight = 20,
	} = options;

	// Validate matrix dimensions
	if (matrix.length !== labels.length || matrix[0]?.length !== labels.length) {
		throw new Error("Matrix dimensions must match labels length");
	}

	// Calculate node values and positions
	const nodeValues = matrix.map((row, i) => ({
		index: i,
		incoming: row.reduce((sum, val) => sum + val, 0),
		outgoing: matrix.reduce((sum, r) => sum + r[i], 0),
		total:
			row.reduce((sum, val) => sum + val, 0) +
			matrix.reduce((sum, r) => sum + r[i], 0),
	}));

	// Sort nodes based on strategy
	let sortedIndices = nodeValues.map((_, i) => i);
	switch (sortBy) {
		case "value":
			sortedIndices.sort((a, b) => nodeValues[b].total - nodeValues[a].total);
			break;
		case "size":
			sortedIndices.sort(
				(a, b) => nodeValues[b].incoming - nodeValues[a].incoming,
			);
			break;
		case "name":
			sortedIndices.sort((a, b) => labels[a].localeCompare(labels[b]));
			break;
	}

	// Calculate angles for nodes
	const angleStep = (2 * Math.PI) / labels.length;

	const nodes = sortedIndices.map((originalIndex, sortedIndex) => {
		const angle = sortedIndex * angleStep;
		const x = centerX + radius * Math.cos(angle);
		const y = centerY + radius * Math.sin(angle);
		const z = centerZ;

		// Determine color
		const color = colorScheme
			? colorScheme[sortedIndex % colorScheme.length]
			: getSeriesColor(sortedIndex);

		return {
			id: `node_${originalIndex}`,
			name: labels[originalIndex],
			x,
			y,
			z,
			angle,
			radius: Math.max(5, Math.sqrt(nodeValues[originalIndex].total) * 2),
			value: nodeValues[originalIndex].total,
			color,
		};
	});

	// Create ribbons from matrix
	const ribbons: Array<{
		source: string;
		target: string;
		value: number;
		sourceAngle: number;
		targetAngle: number;
		sourceRadius: number;
		targetRadius: number;
		color?: string;
		opacity?: number;
		height?: number;
	}> = [];

	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			const value = matrix[i][j];
			if (value > threshold && i !== j) {
				// Skip self-connections
				const sourceIndex = sortedIndices.indexOf(i);
				const targetIndex = sortedIndices.indexOf(j);

				const sourceNode = nodes[sourceIndex];
				const targetNode = nodes[targetIndex];

				ribbons.push({
					source: sourceNode.id,
					target: targetNode.id,
					value,
					sourceAngle: sourceNode.angle,
					targetAngle: targetNode.angle,
					sourceRadius: sourceNode.radius,
					targetRadius: targetNode.radius,
					color: sourceNode.color,
					opacity: ribbonOpacity,
					height: ribbonHeight,
				});
			}
		}
	}

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "3D Chord Diagram",
				data: nodes.map((node) => ({
					x: node.x,
					y: node.y,
					label: node.name,
					color: node.color,
					value: node.value,
				})),
				type: "chord3d" as const,
			},
		],
	};

	return {
		...chartData,
		nodes,
		ribbons,
		center: { x: centerX, y: centerY, z: centerZ },
		radius,
		height,
	};
}

/**
 * Generate 3D chord diagram from network data
 */
export function generateChord3DFromNetwork(
	nodes: Array<{ id: string; name: string; group?: string }>,
	links: Array<{
		source: string;
		target: string;
		value?: number;
	}>,
	options: {
		title?: string;
		symmetric?: boolean;
	} = {},
): Chord3DData {
	const { title, symmetric = false } = options;

	// Create adjacency matrix
	const nodeIndex = new Map(nodes.map((node, index) => [node.id, index]));
	const matrix: number[][] = Array(nodes.length)
		.fill(0)
		.map(() => Array(nodes.length).fill(0));

	links.forEach((link) => {
		const sourceIdx = nodeIndex.get(link.source);
		const targetIdx = nodeIndex.get(link.target);

		if (sourceIdx !== undefined && targetIdx !== undefined) {
			const value = link.value || 1;
			matrix[sourceIdx][targetIdx] =
				(matrix[sourceIdx][targetIdx] || 0) + value;

			if (symmetric) {
				matrix[targetIdx][sourceIdx] =
					(matrix[targetIdx][sourceIdx] || 0) + value;
			}
		}
	});

	const labels = nodes.map((node) => node.name);

	return generateChord3DData(matrix, labels, { title });
}


