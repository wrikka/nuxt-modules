import type { Graph } from "../../types/graph";

export type { Graph };

/**
 * Performs Breadth-First Search traversal on a graph
 * @param graph - The graph to traverse
 * @param start - Starting node
 * @returns Array of nodes in BFS order
 */
export function bfs<T>(graph: Graph<T>, start: T): T[] {
	const visited = new Set<T>();
	const queue: T[] = [start];
	const result: T[] = [];

	visited.add(start);

	while (queue.length > 0) {
		const node = queue.shift()!;
		result.push(node);

		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				visited.add(neighbor);
				queue.push(neighbor);
			}
		}
	}

	return result;
}

/**
 * Performs BFS and returns path from start to target
 * @param graph - The graph to search
 * @param start - Starting node
 * @param target - Target node to find
 * @returns Path from start to target, or null if no path exists
 */
export function bfsPath<T>(graph: Graph<T>, start: T, target: T): T[] | null {
	const visited = new Set<T>();
	const queue: { node: T; path: T[] }[] = [{ node: start, path: [start] }];
	visited.add(start);

	while (queue.length > 0) {
		const { node, path } = queue.shift()!;

		if (node === target) {
			return path;
		}

		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				visited.add(neighbor);
				queue.push({ node: neighbor, path: [...path, neighbor] });
			}
		}
	}

	return null;
}
