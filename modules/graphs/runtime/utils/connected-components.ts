import type { Graph } from "../../types/graph";

/**
 * Finds all connected components in an undirected graph using DFS
 * @param graph - The undirected graph
 * @returns Array of arrays, where each sub-array is a connected component
 */
export function findConnectedComponents<T>(graph: Graph<T>): T[][] {
	const visited = new Set<T>();
	const components: T[][] = [];

	function dfs(node: T, component: T[]): void {
		visited.add(node);
		component.push(node);

		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				dfs(neighbor, component);
			}
		}
	}

	for (const node of graph.keys()) {
		if (!visited.has(node)) {
			const component: T[] = [];
			dfs(node, component);
			components.push(component);
		}
	}

	return components;
}

/**
 * Finds all connected components in an undirected graph using BFS
 * @param graph - The undirected graph
 * @returns Array of arrays, where each sub-array is a connected component
 */
export function findConnectedComponentsBFS<T>(graph: Graph<T>): T[][] {
	const visited = new Set<T>();
	const components: T[][] = [];

	for (const startNode of graph.keys()) {
		if (!visited.has(startNode)) {
			const component: T[] = [];
			const queue: T[] = [startNode];
			visited.add(startNode);

			while (queue.length > 0) {
				const node = queue.shift()!;
				component.push(node);

				const neighbors = graph.get(node) || [];
				for (const neighbor of neighbors) {
					if (!visited.has(neighbor)) {
						visited.add(neighbor);
						queue.push(neighbor);
					}
				}
			}

			components.push(component);
		}
	}

	return components;
}

/**
 * Counts the number of connected components in an undirected graph
 * @param graph - The undirected graph
 * @returns Number of connected components
 */
export function countConnectedComponents<T>(graph: Graph<T>): number {
	return findConnectedComponents(graph).length;
}

/**
 * Checks if an undirected graph is connected (has exactly one component)
 * @param graph - The undirected graph
 * @returns True if the graph is connected, false otherwise
 */
export function isConnected<T>(graph: Graph<T>): boolean {
	return countConnectedComponents(graph) === 1;
}
