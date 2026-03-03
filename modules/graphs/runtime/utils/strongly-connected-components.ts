import { Graph } from "./graph-types";

/**
 * Finds strongly connected components using Kosaraju's algorithm
 * @param graph - The directed graph
 * @returns Array of arrays, where each sub-array is a strongly connected component
 */
export function findStronglyConnectedComponents<T>(graph: Graph<T>): T[][] {
	const visited = new Set<T>();
	const order: T[] = [];

	// First DFS pass: fill order with finishing times
	function dfs1(node: T): void {
		visited.add(node);

		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				dfs1(neighbor);
			}
		}

		order.push(node);
	}

	for (const node of graph.keys()) {
		if (!visited.has(node)) {
			dfs1(node);
		}
	}

	// Create transpose graph
	const transpose = new Map<T, T[]>();
	for (const [node, neighbors] of graph) {
		for (const neighbor of neighbors) {
			if (!transpose.has(neighbor)) {
				transpose.set(neighbor, []);
			}
			transpose.get(neighbor)!.push(node);
		}
		// Ensure all nodes are in transpose graph
		if (!transpose.has(node)) {
			transpose.set(node, []);
		}
	}

	// Second DFS pass: process in decreasing finishing time order
	visited.clear();
	const components: T[][] = [];

	function dfs2(node: T, component: T[]): void {
		visited.add(node);
		component.push(node);

		const neighbors = transpose.get(node) || [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				dfs2(neighbor, component);
			}
		}
	}

	while (order.length > 0) {
		const node = order.pop()!;
		if (!visited.has(node)) {
			const component: T[] = [];
			dfs2(node, component);
			components.push(component);
		}
	}

	return components;
}

/**
 * Counts the number of strongly connected components in a directed graph
 * @param graph - The directed graph
 * @returns Number of SCCs
 */
export function countStronglyConnectedComponents<T>(graph: Graph<T>): number {
	return findStronglyConnectedComponents(graph).length;
}

/**
 * Checks if a directed graph is strongly connected (has exactly one SCC)
 * @param graph - The directed graph
 * @returns True if the graph is strongly connected, false otherwise
 */
export function isStronglyConnected<T>(graph: Graph<T>): boolean {
	return countStronglyConnectedComponents(graph) === 1;
}
