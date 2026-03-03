import type { Graph } from "../../types/graph";

export type { Graph };

/**
 * Performs Depth-First Search traversal on a graph
 * @param graph - The graph to traverse
 * @param start - Starting node
 * @returns Array of nodes in DFS order
 */
export function dfs<T>(graph: Graph<T>, start: T): T[] {
	const visited = new Set<T>();
	const result: T[] = [];

	function dfsRecursive(node: T): void {
		visited.add(node);
		result.push(node);

		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				dfsRecursive(neighbor);
			}
		}
	}

	dfsRecursive(start);
	return result;
}

/**
 * Performs iterative DFS traversal
 * @param graph - The graph to traverse
 * @param start - Starting node
 * @returns Array of nodes in DFS order
 */
export function dfsIterative<T>(graph: Graph<T>, start: T): T[] {
	const visited = new Set<T>();
	const stack: T[] = [start];
	const result: T[] = [];

	visited.add(start);

	while (stack.length > 0) {
		const node = stack.pop()!;
		result.push(node);

		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				visited.add(neighbor);
				stack.push(neighbor);
			}
		}
	}

	return result;
}

/**
 * Performs DFS and returns path from start to target
 * @param graph - The graph to search
 * @param start - Starting node
 * @param target - Target node to find
 * @returns Path from start to target, or null if no path exists
 */
export function dfsPath<T>(graph: Graph<T>, start: T, target: T): T[] | null {
	const visited = new Set<T>();

	function dfsRecursive(node: T, path: T[]): T[] | null {
		visited.add(node);
		path.push(node);

		if (node === target) {
			return [...path];
		}

		const neighbors = graph.get(node) || [];
		for (const neighbor of neighbors) {
			if (!visited.has(neighbor)) {
				const result = dfsRecursive(neighbor, path);
				if (result) {
					return result;
				}
			}
		}

		path.pop();
		return null;
	}

	return dfsRecursive(start, []);
}
