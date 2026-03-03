import type { ChartData } from '@/module/app/types/chart-basic';
import type { AdjacencyData } from './adjacency-types';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate adjacency matrix data
 */
export function generateAdjacencyData(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		color?: string;
		size?: number;
	}>,
	edges: Array<{
		source: string;
		target: string;
		weight?: number;
		directed?: boolean;
	}>,
	options: {
		title?: string;
		defaultEdgeWeight?: number;
		normalizeWeights?: boolean;
		colorScheme?: string[];
		sortBy?: "name" | "degree" | "group" | "none";
		showLabels?: boolean;
	} = {},
): AdjacencyData {
	const {
		title,
		defaultEdgeWeight = 1,
		normalizeWeights = false,
		colorScheme = ["#ffffff", "#1f77b4"],
		sortBy = "name",
		showLabels = true,
	} = options;

	// Create node index mapping
	const nodeIndex = new Map(nodes.map((node, index) => [node.id, index]));

	// Initialize adjacency matrix
	const n = nodes.length;
	const matrix: number[][] = Array(n)
		.fill(0)
		.map(() => Array(n).fill(0));

	// Check if graph is directed or weighted
	let hasDirectedEdges = false;
	let hasWeightedEdges = false;

	edges.forEach((edge) => {
		if (edge.directed) hasDirectedEdges = true;
		if (edge.weight !== undefined && edge.weight !== defaultEdgeWeight)
			hasWeightedEdges = true;

		const sourceIdx = nodeIndex.get(edge.source);
		const targetIdx = nodeIndex.get(edge.target);

		if (sourceIdx !== undefined && targetIdx !== undefined) {
			const weight = edge.weight ?? defaultEdgeWeight;
			matrix[sourceIdx][targetIdx] =
				(matrix[sourceIdx][targetIdx] || 0) + weight;

			// If not directed, also set symmetric entry
			if (!edge.directed) {
				matrix[targetIdx][sourceIdx] =
					(matrix[targetIdx][sourceIdx] || 0) + weight;
			}
		}
	});

	// Normalize weights if requested
	let processedMatrix = matrix;
	if (normalizeWeights && hasWeightedEdges) {
		const maxWeight = Math.max(...matrix.flat().filter((val) => val > 0));
		if (maxWeight > 0) {
			processedMatrix = matrix.map((row) =>
				row.map((val) => (val > 0 ? val / maxWeight : 0)),
			);
		}
	}

	// Sort nodes if requested
	let sortedNodes = [...nodes];
	switch (sortBy) {
		case "name":
			sortedNodes.sort((a, b) => a.name.localeCompare(b.name));
			break;
		case "degree":
			const degrees = nodes.map((node) => {
				const idx = nodeIndex.get(node.id)!;
				return processedMatrix[idx].reduce((sum, val) => sum + val, 0);
			});
			sortedNodes = nodes
				.map((node, i) => ({ ...node, degree: degrees[i] }))
				.sort((a, b) => (b.degree || 0) - (a.degree || 0))
				.map(({ degree, ...node }) => node);
			break;
		case "group":
			sortedNodes.sort((a, b) => (a.group || "").localeCompare(b.group || ""));
			break;
		case "none":
		default:
			// Keep original order
			break;
	}

	// Reorder matrix according to sorted nodes
	const sortedIndices = sortedNodes.map((node) => nodeIndex.get(node.id)!);
	const sortedMatrix = sortedIndices.map((rowIdx) =>
		sortedIndices.map((colIdx) => processedMatrix[rowIdx][colIdx]),
	);

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Adjacency Matrix",
				data: sortedMatrix.flatMap((row, rowIndex) =>
					row.map((value, colIndex) => ({
						x: colIndex,
						y: rowIndex,
						label: showLabels && value > 0 ? value.toString() : undefined,
						color: value > 0 ? colorScheme[1] : colorScheme[0],
						value,
					})),
				),
				type: "adjacency" as const,
			},
		],
	};

	return {
		...chartData,
		nodes: sortedNodes,
		matrix: sortedMatrix,
		directed: hasDirectedEdges,
		weighted: hasWeightedEdges,
	};
}

/**
 * Generate adjacency matrix from network data
 */
export function generateAdjacencyFromNetwork(
	nodes: Array<{ id: string; name: string; group?: string }>,
	edges: Array<{
		source: string;
		target: string;
		weight?: number;
		type?: string;
	}>,
	options: {
		title?: string;
		includeEdgeTypes?: boolean;
	} = {},
): AdjacencyData {
	const { title, includeEdgeTypes = false } = options;

	// Process edges with types if requested
	let processedEdges = edges;
	if (includeEdgeTypes && edges.some((e) => e.type)) {
		// Create separate matrices for each edge type
		const edgeTypes = [...new Set(edges.map((e) => e.type).filter(Boolean))];

		processedEdges = edges.flatMap((edge) => {
			if (edge.type && edgeTypes.includes(edge.type)) {
				// Create type-specific edges
				return [
					{
						...edge,
						weight: edge.weight || 1,
						directed: true, // Assume directed for typed edges
					},
				];
			}
			return [edge];
		});
	}

	return generateAdjacencyData(nodes, processedEdges, {
		title: title || "Network Adjacency Matrix",
	});
}


