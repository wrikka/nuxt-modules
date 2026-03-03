import type { WeightedGraph } from "../../types/graph";

/**
 * Floyd-Warshall algorithm for all-pairs shortest paths
 * @param graph - The weighted graph
 * @returns Object with distance matrix and predecessor matrix
 */
export function floydWarshall<T>(
	graph: WeightedGraph<T>
): {
	distances: Map<T, Map<T, number>>;
	predecessors: Map<T, Map<T, T | null>>;
	hasNegativeCycle: boolean;
} {
	const nodes = Array.from(graph.keys());
	const n = nodes.length;

	// Initialize distance matrix
	const distances = new Map<T, Map<T, number>>();
	const predecessors = new Map<T, Map<T, T | null>>();

	// Create initial distance and predecessor matrices
	for (const u of nodes) {
		distances.set(u, new Map());
		predecessors.set(u, new Map());

		for (const v of nodes) {
			if (u === v) {
				distances.get(u)!.set(v, 0);
				predecessors.get(u)!.set(v, null);
			} else {
				const edge = graph.get(u)?.find(e => e.node === v);
				if (edge) {
					distances.get(u)!.set(v, edge.weight);
					predecessors.get(u)!.set(v, u);
				} else {
					distances.get(u)!.set(v, Infinity);
					predecessors.get(u)!.set(v, null);
				}
			}
		}
	}

	// Floyd-Warshall algorithm
	for (const k of nodes) {
		for (const i of nodes) {
			for (const j of nodes) {
				const distIK = distances.get(i)!.get(k)!;
				const distKJ = distances.get(k)!.get(j)!;
				const currentDist = distances.get(i)!.get(j)!;

				if (distIK !== Infinity && distKJ !== Infinity && distIK + distKJ < currentDist) {
					distances.get(i)!.set(j, distIK + distKJ);
					predecessors.get(i)!.set(j, predecessors.get(k)!.get(j) ?? null);
				}
			}
		}
	}

	// Check for negative cycles
	let hasNegativeCycle = false;
	for (const node of nodes) {
		if (distances.get(node)!.get(node)! < 0) {
			hasNegativeCycle = true;
			break;
		}
	}

	return { distances, predecessors, hasNegativeCycle };
}

export function floydWarshallPath<T>(
	predecessors: Map<T, Map<T, T | null>>,
	source: T,
	target: T
): T[] | null {
	if (source === target) {
		return [source];
	}

	if (!predecessors.has(source) || !predecessors.get(source)!.has(target)) {
		return null;
	}

	const path: T[] = [target];
	let current = target;

	while (current !== source) {
		const pred = predecessors.get(source)!.get(current);
		if (pred === null || pred === current) {
			// No predecessor or self-loop
			return null;
		}
		path.unshift(pred);
		current = pred;

		// Prevent infinite loops
		if (path.length > predecessors.size) {
			return null;
		}
	}

	return path;
}

/**
 * Gets the shortest distance from source to target using Floyd-Warshall distance matrix
 * @param distances - Distance matrix from Floyd-Warshall
 * @param source - Source node
 * @param target - Target node
 * @returns Shortest distance, or Infinity if no path exists
 */
export function floydWarshallDistance<T>(
	distances: Map<T, Map<T, number>>,
	source: T,
	target: T
): number {
	return distances.get(source)?.get(target) ?? Infinity;
}
