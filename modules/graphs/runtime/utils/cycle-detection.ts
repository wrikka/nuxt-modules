import type { Graph } from "../../types/graph";

/**
 * Detects if a directed graph has a cycle using DFS
 * @param graph - The directed graph to check
 * @returns True if cycle exists, false otherwise
 */
export function hasCycleDFS<T>(graph: Graph<T>): boolean {
	const visited = new Set<T>();
	const recursionStack = new Set<T>();

	function dfs(node: T): boolean {
		if (recursionStack.has(node)) {
			return true; // Cycle detected
		}

		if (visited.has(node)) {
			return false; // Already processed
		}

		visited.add(node);
		recursionStack.add(node);

		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			if (dfs(neighbor)) {
				return true; // Cycle found in subtree
			}
		}

		recursionStack.delete(node);
		return false;
	}

	for (const node of graph.keys()) {
		if (!visited.has(node)) {
			if (dfs(node)) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Detects if an undirected graph has a cycle using DFS
 * @param graph - The undirected graph to check
 * @returns True if cycle exists, false otherwise
 */
export function hasCycleUndirected<T>(graph: Graph<T>): boolean {
	const visited = new Set<T>();

	function dfs(node: T, parent: T | null): boolean {
		visited.add(node);

		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			if (neighbor === parent) {
				continue; // Skip parent in undirected graph
			}

			if (visited.has(neighbor)) {
				return true; // Back edge found (cycle)
			}

			if (dfs(neighbor, node)) {
				return true; // Cycle found in subtree
			}
		}

		return false;
	}

	for (const node of graph.keys()) {
		if (!visited.has(node)) {
			if (dfs(node, null)) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Detects if a directed graph has a cycle using topological sort approach
 * @param graph - The directed graph to check
 * @returns True if cycle exists, false otherwise
 */
export function hasCycleTopological<T>(graph: Graph<T>): boolean {
	const inDegree = new Map<T, number>();
	const queue: T[] = [];
	let processedCount = 0;

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

	// Process queue
	while (queue.length > 0) {
		const node = queue.shift()!;
		processedCount++;

		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			const currentDegree = inDegree.get(neighbor)! - 1;
			inDegree.set(neighbor, currentDegree);

			if (currentDegree === 0) {
				queue.push(neighbor);
			}
		}
	}

	// If not all nodes processed, there's a cycle
	return processedCount !== graph.size;
}
