import type { Graph } from "../../types/graph";

/**
 * Checks if a graph is bipartite using BFS coloring
 * @param graph - The undirected graph to check
 * @returns Object with isBipartite boolean and color assignments if bipartite
 */
export function isBipartiteBFS<T>(
	graph: Graph<T>
): { isBipartite: boolean; colors?: Map<T, number> } {
	const colors = new Map<T, number>();
	const visited = new Set<T>();

	for (const startNode of graph.keys()) {
		if (visited.has(startNode)) {
			continue;
		}

		// Start BFS from this node with color 0
		const queue: T[] = [startNode];
		colors.set(startNode, 0);
		visited.add(startNode);

		while (queue.length > 0) {
			const node = queue.shift()!;
			const nodeColor = colors.get(node)!;

			const neighbors = graph.get(node) || [];
			for (const neighbor of neighbors) {
				if (!visited.has(neighbor)) {
					// Assign opposite color
					colors.set(neighbor, 1 - nodeColor);
					visited.add(neighbor);
					queue.push(neighbor);
				} else if (colors.get(neighbor) === nodeColor) {
					// Same color as parent - not bipartite
					return { isBipartite: false };
				}
			}
		}
	}

	return { isBipartite: true, colors };
}

/**
 * Checks if a graph is bipartite using DFS coloring
 * @param graph - The undirected graph to check
 * @returns Object with isBipartite boolean and color assignments if bipartite
 */
export function isBipartiteDFS<T>(
	graph: Graph<T>
): { isBipartite: boolean; colors?: Map<T, number> } {
	const colors = new Map<T, number>();
	const visited = new Set<T>();

	function dfs(node: T, color: number): boolean {
		visited.add(node);
		colors.set(node, color);

		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				if (!dfs(neighbor, 1 - color)) {
					return false;
				}
			} else if (colors.get(neighbor) === color) {
				// Same color - conflict
				return false;
			}
		}

		return true;
	}

	for (const node of graph.keys()) {
		if (!visited.has(node)) {
			if (!dfs(node, 0)) {
				return { isBipartite: false };
			}
		}
	}

	return { isBipartite: true, colors };
}

/**
 * Gets the two partitions of a bipartite graph
 * @param graph - The bipartite graph
 * @param colors - Color assignments from isBipartiteBFS or isBipartiteDFS
 * @returns Object with the two partitions
 */
export function getBipartitePartitions<T>(
	graph: Graph<T>,
	colors: Map<T, number>
): { partition0: T[]; partition1: T[] } {
	const partition0: T[] = [];
	const partition1: T[] = [];

	for (const [node, color] of colors) {
		if (color === 0) {
			partition0.push(node);
		} else {
			partition1.push(node);
		}
	}

	return { partition0, partition1 };
}
