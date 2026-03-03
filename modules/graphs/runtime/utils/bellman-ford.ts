import type { WeightedGraph } from "../../types/graph";

/**
 * Implements Bellman-Ford algorithm for finding shortest paths in a weighted graph
 * Can handle negative edge weights
 * @param graph - The weighted graph
 * @param start - Starting node
 * @returns Object with distances, previous nodes, and whether negative cycle exists
 */
export function bellmanFord<T>(
	graph: WeightedGraph<T>,
	start: T
): {
	distances: Map<T, number>;
	previous: Map<T, T | null>;
	hasNegativeCycle: boolean;
} {
	const distances = new Map<T, number>();
	const previous = new Map<T, T | null>();
	const nodes = Array.from(graph.keys());

	// Initialize distances
	for (const node of nodes) {
		distances.set(node, node === start ? 0 : Infinity);
		previous.set(node, null);
	}

	// Relax edges |V| - 1 times
	for (let i = 0; i < nodes.length - 1; i++) {
		for (const [node, edges] of graph) {
			for (const { node: neighbor, weight } of edges) {
				const currentDistance = distances.get(node)!;
				const newDistance = currentDistance + weight;

				if (currentDistance !== Infinity && newDistance < distances.get(neighbor)!) {
					distances.set(neighbor, newDistance);
					previous.set(neighbor, node);
				}
			}
		}
	}

	// Check for negative cycles
	let hasNegativeCycle = false;
	for (const [node, edges] of graph) {
		for (const { node: neighbor, weight } of edges) {
			const currentDistance = distances.get(node)!;
			const newDistance = currentDistance + weight;

			if (currentDistance !== Infinity && newDistance < distances.get(neighbor)!) {
				hasNegativeCycle = true;
				break;
			}
		}
		if (hasNegativeCycle) break;
	}

	return { distances, previous, hasNegativeCycle };
}

/**
 * Gets the shortest path from start to target using Bellman-Ford algorithm
 * @param graph - The weighted graph
 * @param start - Starting node
 * @param target - Target node
 * @returns Object with path array and whether negative cycle exists, or null if no path
 */
export function bellmanFordPath<T>(
	graph: WeightedGraph<T>,
	start: T,
	target: T
): { path: T[] | null; hasNegativeCycle: boolean } {
	const { distances, previous, hasNegativeCycle } = bellmanFord(graph, start);

	if (distances.get(target) === Infinity) {
		return { path: null, hasNegativeCycle };
	}

	const path: T[] = [];
	let current: T | null = target;

	while (current !== null) {
		path.unshift(current);
		current = previous.get(current)!;
	}

	return { path: path[0] === start ? path : null, hasNegativeCycle };
}

/**
 * Gets the shortest distance from start to target using Bellman-Ford algorithm
 * @param graph - The weighted graph
 * @param start - Starting node
 * @param target - Target node
 * @returns Object with distance and whether negative cycle exists
 */
export function bellmanFordDistance<T>(
	graph: WeightedGraph<T>,
	start: T,
	target: T
): { distance: number; hasNegativeCycle: boolean } {
	const { distances, hasNegativeCycle } = bellmanFord(graph, start);
	const distance = distances.get(target) ?? Infinity;
	return { distance, hasNegativeCycle };
}
