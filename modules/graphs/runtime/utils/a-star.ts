import type { WeightedGraph } from "../../types/graph";

/**
 * A* search algorithm for finding shortest path with heuristic
 * @param graph - The weighted graph
 * @param start - Starting node
 * @param goal - Goal node
 * @param heuristic - Heuristic function h(n) that estimates cost from n to goal
 * @returns Object with path, cost, and nodes explored, or null if no path found
 */
export function aStar<T>(
	graph: WeightedGraph<T>,
	start: T,
	goal: T,
	heuristic: (node: T, goal: T) => number
): { path: T[]; cost: number; nodesExplored: number } | null {
	const openSet = new Set<T>([start]);
	const closedSet = new Set<T>();

	// gScore[n] = cost from start to n
	const gScore = new Map<T, number>();
	gScore.set(start, 0);

	// fScore[n] = gScore[n] + heuristic(n, goal)
	const fScore = new Map<T, number>();
	fScore.set(start, heuristic(start, goal));

	// cameFrom[n] = node immediately preceding n on cheapest path from start
	const cameFrom = new Map<T, T>();

	let nodesExplored = 0;

	while (openSet.size > 0) {
		// Find node in openSet with lowest fScore
		let current: T | null = null;
		let lowestFScore = Infinity;

		for (const node of openSet) {
			const score = fScore.get(node) ?? Infinity;
			if (score < lowestFScore) {
				lowestFScore = score;
				current = node;
			}
		}

		if (current === null) {
			break;
		}

		if (current === goal) {
			// Reconstruct path
			const path: T[] = [];
			let temp: T | undefined = current;
			while (temp !== undefined) {
				path.unshift(temp);
				temp = cameFrom.get(temp);
			}
			return {
				path,
				cost: gScore.get(goal)!,
				nodesExplored
			};
		}

		openSet.delete(current);
		closedSet.add(current);
		nodesExplored++;

		const neighbors = graph.get(current) || [];
		for (const { node: neighbor, weight } of neighbors) {
			if (closedSet.has(neighbor)) {
				continue;
			}

			const tentativeGScore = gScore.get(current)! + weight;

			if (!openSet.has(neighbor)) {
				openSet.add(neighbor);
			} else if (tentativeGScore >= (gScore.get(neighbor) ?? Infinity)) {
				continue;
			}

			// This path is better than any previous one
			cameFrom.set(neighbor, current);
			gScore.set(neighbor, tentativeGScore);
			fScore.set(neighbor, tentativeGScore + heuristic(neighbor, goal));
		}
	}

	// No path found
	return null;
}

/**
 * Manhattan distance heuristic for grid-based graphs
 * Assumes nodes are in format "x-y" (e.g., "3-4")
 */
export function manhattanHeuristic(node: string, goal: string): number {
	const [x1, y1] = node.split('-').map(Number);
	const [x2, y2] = goal.split('-').map(Number);
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/**
 * Euclidean distance heuristic
 * Assumes nodes have x,y coordinates as properties
 */
export function euclideanHeuristic(
	node: { x: number; y: number },
	goal: { x: number; y: number }
): number {
	const dx = node.x - goal.x;
	const dy = node.y - goal.y;
	return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Zero heuristic (Dijkstra's algorithm)
 */
export function zeroHeuristic<T>(_node: T, _goal: T): number {
	return 0;
}
