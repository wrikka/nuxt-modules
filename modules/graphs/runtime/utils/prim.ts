import { WeightedGraph } from "./graph-types";

/**
 * Implements Prim's algorithm for finding Minimum Spanning Tree
 * @param graph - The weighted graph
 * @param start - Starting node (optional, defaults to first node)
 * @returns Array of edges forming the MST and total weight
 */
export function prim<T>(
	graph: WeightedGraph<T>,
	start?: T
): { mst: Array<{ from: T; to: T; weight: number }>; totalWeight: number } {
	const nodes = Array.from(graph.keys());
	if (nodes.length === 0) {
		return { mst: [], totalWeight: 0 };
	}

	const startNode = start ?? nodes[0];
	const visited = new Set<T>();
	const mst: Array<{ from: T; to: T; weight: number }> = [];
	let totalWeight = 0;

	// Priority queue for edges: [weight, from, to]
	const edges: Array<[number, T, T]> = [];

	// Add starting node
	visited.add(startNode);

	// Add all edges from starting node to priority queue
	const startEdges = graph.get(startNode) || [];
	for (const { node, weight } of startEdges) {
		edges.push([weight, startNode, node]);
	}

	while (visited.size < nodes.length && edges.length > 0) {
		// Find minimum weight edge
		edges.sort((a, b) => a[0] - b[0]);
		const [weight, from, to] = edges.shift()!;

		if (visited.has(to)) {
			continue; // Skip if target already visited
		}

		// Add edge to MST
		visited.add(to);
		mst.push({ from, to, weight });
		totalWeight += weight;

		// Add new edges from the newly added node
		const newEdges = graph.get(to) || [];
		for (const { node, weight: edgeWeight } of newEdges) {
			if (!visited.has(node)) {
				edges.push([edgeWeight, to, node]);
			}
		}
	}

	return { mst, totalWeight };
}

/**
 * Converts Prim's MST edges back to a weighted graph representation
 * @param mst - Array of edges from MST
 * @returns Weighted graph representation of MST
 */
export function primMstToGraph<T>(
	mst: Array<{ from: T; to: T; weight: number }>
): WeightedGraph<T> {
	const graph: WeightedGraph<T> = new Map();

	for (const edge of mst) {
		if (!graph.has(edge.from)) {
			graph.set(edge.from, []);
		}
		if (!graph.has(edge.to)) {
			graph.set(edge.to, []);
		}

		graph.get(edge.from)!.push({ node: edge.to, weight: edge.weight });
		graph.get(edge.to)!.push({ node: edge.from, weight: edge.weight });
	}

	return graph;
}
