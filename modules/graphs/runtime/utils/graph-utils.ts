import type { Graph, WeightedGraph } from "../../types/graph";

/**
 * Converts an adjacency list graph to adjacency matrix representation
 * @param graph - The graph in adjacency list format
 * @param nodes - Optional ordered list of nodes (for consistent matrix indexing)
 * @returns Adjacency matrix as Map of Maps
 */
export function graphToAdjacencyMatrix<T>(
	graph: Graph<T>,
	nodes?: T[]
): Map<T, Map<T, number>> {
	const nodeList = nodes || Array.from(graph.keys());
	const matrix = new Map<T, Map<T, number>>();

	// Initialize matrix with 0s
	for (const node1 of nodeList) {
		matrix.set(node1, new Map());
		for (const node2 of nodeList) {
			matrix.get(node1)!.set(node2, 0);
		}
	}

	// Set edges to 1
	for (const [node, neighbors] of graph) {
		for (const neighbor of neighbors) {
			if (matrix.has(node) && matrix.get(node)!.has(neighbor)) {
				matrix.get(node)!.set(neighbor, 1);
			}
		}
	}

	return matrix;
}

/**
 * Converts an adjacency list weighted graph to adjacency matrix representation
 * @param graph - The weighted graph in adjacency list format
 * @param nodes - Optional ordered list of nodes (for consistent matrix indexing)
 * @returns Adjacency matrix as Map of Maps with weights
 */
export function weightedGraphToAdjacencyMatrix<T>(
	graph: WeightedGraph<T>,
	nodes?: T[]
): Map<T, Map<T, number>> {
	const nodeList = nodes || Array.from(graph.keys());
	const matrix = new Map<T, Map<T, number>>();

	// Initialize matrix with Infinity (no edge)
	for (const node1 of nodeList) {
		matrix.set(node1, new Map());
		for (const node2 of nodeList) {
			matrix.get(node1)!.set(node2, node1 === node2 ? 0 : Infinity);
		}
	}

	// Set edge weights
	for (const [node, neighbors] of graph) {
		for (const { node: neighbor, weight } of neighbors) {
			if (matrix.has(node) && matrix.get(node)!.has(neighbor)) {
				matrix.get(node)!.set(neighbor, weight);
			}
		}
	}

	return matrix;
}

/**
 * Converts adjacency matrix back to adjacency list graph
 * @param matrix - Adjacency matrix representation
 * @param threshold - Threshold for considering an edge exists (default: 0 for unweighted, < Infinity for weighted)
 * @returns Graph in adjacency list format
 */
export function adjacencyMatrixToGraph<T>(
	matrix: Map<T, Map<T, number>>,
	threshold: number = 0
): Graph<T> {
	const graph: Graph<T> = new Map();

	for (const [node, neighbors] of matrix) {
		graph.set(node, []);
		for (const [neighbor, weight] of neighbors) {
			if (weight > threshold && node !== neighbor) {
				graph.get(node)!.push(neighbor);
			}
		}
	}

	return graph;
}

/**
 * Converts adjacency matrix back to weighted adjacency list graph
 * @param matrix - Adjacency matrix representation
 * @returns Weighted graph in adjacency list format
 */
export function adjacencyMatrixToWeightedGraph<T>(
	matrix: Map<T, Map<T, number>>
): WeightedGraph<T> {
	const graph: WeightedGraph<T> = new Map();

	for (const [node, neighbors] of matrix) {
		graph.set(node, []);
		for (const [neighbor, weight] of neighbors) {
			if (weight !== Infinity && weight !== 0 && node !== neighbor) {
				graph.get(node)!.push({ node: neighbor, weight });
			}
		}
	}

	return graph;
}

/**
 * Creates an undirected version of a directed graph
 * @param graph - The directed graph
 * @returns Undirected graph with bidirectional edges
 */
export function makeUndirected<T>(graph: Graph<T>): Graph<T> {
	const undirected: Graph<T> = new Map();

	// Initialize all nodes
	for (const node of graph.keys()) {
		undirected.set(node, []);
	}

	// Add bidirectional edges
	for (const [node, neighbors] of graph) {
		for (const neighbor of neighbors) {
			// Add edge from node to neighbor
			if (!undirected.get(node)!.includes(neighbor)) {
				undirected.get(node)!.push(neighbor);
			}
			// Add edge from neighbor to node
			if (!undirected.get(neighbor)!.includes(node)) {
				undirected.get(neighbor)!.push(node);
			}
		}
	}

	return undirected;
}

/**
 * Validates that a graph structure is consistent
 * @param graph - The graph to validate
 * @returns True if valid, false otherwise
 */
export function validateGraph<T>(graph: Graph<T>): boolean {
	try {
		// Check that all referenced nodes exist as keys
		for (const [node, neighbors] of graph) {
			for (const neighbor of neighbors) {
				if (!graph.has(neighbor)) {
					return false;
				}
			}
		}
		return true;
	} catch {
		return false;
	}
}

/**
 * Gets basic statistics about a graph
 * @param graph - The graph to analyze
 * @returns Object with graph statistics
 */
export function getGraphStats<T>(graph: Graph<T>): {
	nodeCount: number;
	edgeCount: number;
	isDirected: boolean;
	averageDegree: number;
	maxDegree: number;
	minDegree: number;
} {
	const nodes = Array.from(graph.keys());
	const nodeCount = nodes.length;

	let edgeCount = 0;
	let maxDegree = 0;
	let minDegree = Infinity;
	let totalDegree = 0;

	for (const [node, neighbors] of graph) {
		const degree = neighbors.length;
		edgeCount += degree;
		maxDegree = Math.max(maxDegree, degree);
		minDegree = Math.min(minDegree, degree);
		totalDegree += degree;
	}

	// For directed graphs, each edge is counted once
	const isDirected = true; // Assuming directed by default
	const averageDegree = nodeCount > 0 ? totalDegree / nodeCount : 0;

	return {
		nodeCount,
		edgeCount,
		isDirected,
		averageDegree,
		maxDegree,
		minDegree: minDegree === Infinity ? 0 : minDegree,
	};
}
