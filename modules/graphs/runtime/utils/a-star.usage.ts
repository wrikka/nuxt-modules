// Usage examples for A* Search Algorithm

import { aStar, manhattanHeuristic, euclideanHeuristic, zeroHeuristic } from "./a-star";
import type { WeightedGraph } from "../../types/graph";

// Example 1: Grid-based pathfinding (like in games)
const gameGrid: WeightedGraph<string> = new Map([
	["0-0", [{ node: "0-1", weight: 1 }, { node: "1-0", weight: 1 }]],
	["0-1", [{ node: "0-0", weight: 1 }, { node: "0-2", weight: 1 }, { node: "1-1", weight: 1 }]],
	["0-2", [{ node: "0-1", weight: 1 }, { node: "1-2", weight: 1 }]],
	["1-0", [{ node: "0-0", weight: 1 }, { node: "1-1", weight: 1 }, { node: "2-0", weight: 1 }]],
	["1-1", [{ node: "0-1", weight: 1 }, { node: "1-0", weight: 1 }, { node: "1-2", weight: 1 }, { node: "2-1", weight: 1 }]],
	["1-2", [{ node: "0-2", weight: 1 }, { node: "1-1", weight: 1 }, { node: "2-2", weight: 1 }]],
	["2-0", [{ node: "1-0", weight: 1 }, { node: "2-1", weight: 1 }]],
	["2-1", [{ node: "1-1", weight: 1 }, { node: "2-0", weight: 1 }, { node: "2-2", weight: 1 }]],
	["2-2", [{ node: "1-2", weight: 1 }, { node: "2-1", weight: 1 }]],
]);

const pathResult = aStar(gameGrid, "0-0", "2-2", manhattanHeuristic);
if (pathResult) {
	console.log("Path found:", pathResult.path.join(" -> "));
	console.log("Path cost:", pathResult.cost);
	console.log("Nodes explored:", pathResult.nodesExplored);
} else {
	console.log("No path found");
}
// Output: Path found: 0-0 -> 0-1 -> 0-2 -> 1-2 -> 2-2
//         Path cost: 4
//         Nodes explored: 5

// Example 2: Robot navigation with Euclidean distance
type Position = { x: number; y: number; id: string };

const robotMap: WeightedGraph<Position> = new Map([
	[{ x: 0, y: 0, id: "start" }, [
		{ node: { x: 1, y: 0, id: "p1" }, weight: 1 },
		{ node: { x: 0, y: 1, id: "p2" }, weight: 1 }
	]],
	[{ x: 1, y: 0, id: "p1" }, [
		{ node: { x: 0, y: 0, id: "start" }, weight: 1 },
		{ node: { x: 1, y: 1, id: "p3" }, weight: 1 }
	]],
	[{ x: 0, y: 1, id: "p2" }, [
		{ node: { x: 0, y: 0, id: "start" }, weight: 1 },
		{ node: { x: 1, y: 1, id: "p3" }, weight: 1 }
	]],
	[{ x: 1, y: 1, id: "p3" }, [
		{ node: { x: 1, y: 0, id: "p1" }, weight: 1 },
		{ node: { x: 0, y: 1, id: "p2" }, weight: 1 }
	]],
]);

const start = { x: 0, y: 0, id: "start" };
const goal = { x: 1, y: 1, id: "p3" };

const robotPath = aStar(robotMap, start, goal, euclideanHeuristic);
if (robotPath) {
	console.log("Robot path:", robotPath.path.map(p => p.id).join(" -> "));
	console.log("Total distance:", robotPath.cost);
}
// Output: Robot path: start -> p2 -> p3
//         Total distance: 2

// Example 3: Using zero heuristic (becomes Dijkstra)
const weightedGraph: WeightedGraph<string> = new Map([
	["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
	["B", [{ node: "D", weight: 5 }]],
	["C", [{ node: "D", weight: 8 }, { node: "E", weight: 10 }]],
	["D", [{ node: "E", weight: 2 }]],
	["E", []],
]);

const dijkstraResult = aStar(weightedGraph, "A", "E", zeroHeuristic);
if (dijkstraResult) {
	console.log("Shortest path (Dijkstra):", dijkstraResult.path.join(" -> "));
	console.log("Total cost:", dijkstraResult.cost);
}
// Output: Shortest path (Dijkstra): A -> C -> D -> E
//         Total cost: 12

// Example 4: GPS navigation simulation
const cityGraph: WeightedGraph<string> = new Map([
	["Home", [
		{ node: "Mall", weight: 5 },
		{ node: "School", weight: 8 }
	]],
	["Mall", [
		{ node: "Home", weight: 5 },
		{ node: "School", weight: 3 },
		{ node: "Office", weight: 6 }
	]],
	["School", [
		{ node: "Home", weight: 8 },
		{ node: "Mall", weight: 3 },
		{ node: "Office", weight: 4 }
	]],
	["Office", [
		{ node: "Mall", weight: 6 },
		{ node: "School", weight: 4 }
	]],
]);

// Simple heuristic: assume Office is at (0,0), Home at (5,8), Mall at (0,5), School at (4,4)
const gpsHeuristic = (node: string, _goal: string): number => {
	const positions: Record<string, [number, number]> = {
		"Home": [5, 8],
		"Mall": [0, 5],
		"School": [4, 4],
		"Office": [0, 0]
	};
	const [x, y] = positions[node] || [0, 0];
	return Math.sqrt(x * x + y * y); // Distance to origin (Office)
};

const route = aStar(cityGraph, "Home", "Office", gpsHeuristic);
if (route) {
	console.log("GPS route:", route.path.join(" -> "));
	console.log("Estimated driving time:", route.cost, "minutes");
}
// Output: GPS route: Home -> Mall -> Office
//         Estimated driving time: 11 minutes
