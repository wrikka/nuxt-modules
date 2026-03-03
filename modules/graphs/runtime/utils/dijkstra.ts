import type { WeightedGraph } from "../../types/graph";

/**
 * Implements Dijkstra's algorithm for finding shortest paths in a weighted graph
 * @param graph - The weighted graph
 * @param start - Starting node
 * @returns Object with distances and previous nodes for shortest paths
 */
export function dijkstra<T>(
	graph: WeightedGraph<T>,
	start: T
): { distances: Map<T, number>; previous: Map<T, T | null> } {
	const distances = new Map<T, number>();
	const previous = new Map<T, T | null>();
	const unvisited = new Set<T>();

	// Initialize distances and previous nodes
	for (const node of graph.keys()) {
		distances.set(node, node === start ? 0 : Infinity);
		previous.set(node, null);
		unvisited.add(node);
	}

	while (unvisited.size > 0) {
		// Find node with minimum distance
		let current: T | null = null;
		let minDistance = Infinity;

		for (const node of unvisited) {
			const distance = distances.get(node)!;
			if (distance < minDistance) {
				minDistance = distance;
				current = node;
			}
		}

		if (current === null || minDistance === Infinity) {
			break;
		}

		unvisited.delete(current);

		// Update distances to neighbors
		const neighbors = graph.get(current) || [];
		for (const { node: neighbor, weight } of neighbors) {
			if (!unvisited.has(neighbor)) {
				continue;
			}

			const currentDistance = distances.get(current)!;
			const newDistance = currentDistance + weight;

			if (newDistance < distances.get(neighbor)!) {
				distances.set(neighbor, newDistance);
				previous.set(neighbor, current);
			}
		}
	}

	return { distances, previous };
}

/**
 * Gets the shortest path from start to target using Dijkstra's algorithm
 * @param graph - The weighted graph
 * @param start - Starting node
 * @param target - Target node
 * @returns Array representing the shortest path, or null if no path exists
 */
export function dijkstraPath<T>(
	graph: WeightedGraph<T>,
	start: T,
	target: T
): T[] | null {
	const { distances, previous } = dijkstra(graph, start);

	if (distances.get(target) === Infinity) {
		return null;
	}

	const path: T[] = [];
	let current: T | null = target;

	while (current !== null) {
		path.unshift(current);
		current = previous.get(current)!;
	}

	return path[0] === start ? path : null;
}

/**
 * Gets the shortest distance from start to target using Dijkstra's algorithm
 * @param graph - The weighted graph
 * @param start - Starting node
 * @param target - Target node
 * @returns Shortest distance, or Infinity if no path exists
 */
export function dijkstraDistance<T>(
	graph: WeightedGraph<T>,
	start: T,
	target: T
): number {
	const { distances } = dijkstra(graph, start);
	return distances.get(target) ?? Infinity;
}
