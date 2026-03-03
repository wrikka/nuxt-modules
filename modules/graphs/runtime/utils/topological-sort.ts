import { Graph } from "./graph-types";

/**
 * Performs topological sort using Kahn's algorithm (BFS-based)
 * @param graph - The directed graph (must be acyclic)
 * @returns Array of nodes in topological order, or null if cycle detected
 */
export function topologicalSort<T>(graph: Graph<T>): T[] | null {
	const inDegree = new Map<T, number>();
	const queue: T[] = [];
	const result: T[] = [];

	// Initialize in-degrees
	for (const node of graph.keys()) {
		inDegree.set(node, 0);
	}

	// Calculate in-degrees
	for (const neighbors of graph.values()) {
		for (const neighbor of neighbors) {
			inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
		}
	}

	// Add nodes with in-degree 0 to queue
	for (const [node, degree] of inDegree) {
		if (degree === 0) {
			queue.push(node);
		}
	}

	while (queue.length > 0) {
		const node = queue.shift()!;
		result.push(node);

		// Reduce in-degree of neighbors
		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			const currentDegree = inDegree.get(neighbor)! - 1;
			inDegree.set(neighbor, currentDegree);

			if (currentDegree === 0) {
				queue.push(neighbor);
			}
		}
	}

	// Check if all nodes were included (no cycle)
	if (result.length === graph.size) {
		return result;
	}

	return null; // Cycle detected
}

/**
 * Performs topological sort using DFS
 * @param graph - The directed graph (must be acyclic)
 * @returns Array of nodes in topological order, or null if cycle detected
 */
export function topologicalSortDFS<T>(graph: Graph<T>): T[] | null {
	const visited = new Set<T>();
	const visiting = new Set<T>(); // For cycle detection
	const result: T[] = [];

	function dfs(node: T): boolean {
		if (visiting.has(node)) {
			return false; // Cycle detected
		}

		if (visited.has(node)) {
			return true;
		}

		visiting.add(node);

		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			if (!dfs(neighbor)) {
				return false; // Cycle detected in subtree
			}
		}

		visiting.delete(node);
		visited.add(node);
		result.unshift(node); // Add to front for correct order

		return true;
	}

	for (const node of graph.keys()) {
		if (!visited.has(node)) {
			if (!dfs(node)) {
				return null; // Cycle detected
			}
		}
	}

	return result;
}
