import { describe, it, expect } from "bun:test";
import { aStar, manhattanHeuristic, euclideanHeuristic, zeroHeuristic } from "./a-star";
import type { WeightedGraph } from "../../types/graph";

describe("aStar", () => {
	it("should find shortest path in grid using Manhattan distance", () => {
		const grid: WeightedGraph<string> = new Map([
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

		const result = aStar(grid, "0-0", "2-2", manhattanHeuristic);

		expect(result).not.toBeNull();
		expect(result!.path).toEqual(["0-0", "0-1", "0-2", "1-2", "2-2"]);
		expect(result!.cost).toBe(4);
		expect(result!.nodesExplored).toBeGreaterThan(0);
	});

	it("should return null when no path exists", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", [{ node: "A", weight: 1 }]],
			["C", [{ node: "D", weight: 1 }]],
			["D", [{ node: "C", weight: 1 }]],
		]);

		const result = aStar(graph, "A", "C", manhattanHeuristic);
		expect(result).toBeNull();
	});

	it("should work with zero heuristic (becomes Dijkstra)", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "C", weight: 1 }, { node: "D", weight: 5 }]],
			["C", [{ node: "D", weight: 8 }]],
			["D", []],
		]);

		const result = aStar(graph, "A", "D", zeroHeuristic);

		expect(result).not.toBeNull();
		expect(result!.cost).toBe(9); // A->C->B->D = 2+1+5 = 8, or A->C->D = 2+8 = 10, so 8 is better
	});

	it("should handle single node graph", () => {
		const graph: WeightedGraph<string> = new Map([["0-0", []]]);
		const result = aStar(graph, "0-0", "0-0", manhattanHeuristic);

		expect(result).not.toBeNull();
		expect(result!.path).toEqual(["0-0"]);
		expect(result!.cost).toBe(0);
	});
});

describe("manhattanHeuristic", () => {
	it("should calculate Manhattan distance", () => {
		expect(manhattanHeuristic("0-0", "2-3")).toBe(5); // |2-0| + |3-0| = 5
		expect(manhattanHeuristic("1-1", "1-1")).toBe(0); // Same position
		expect(manhattanHeuristic("5-2", "2-5")).toBe(6); // |5-2| + |2-5| = 3 + 3 = 6
	});
});

describe("euclideanHeuristic", () => {
	it("should calculate Euclidean distance", () => {
		const node1 = { x: 0, y: 0 };
		const node2 = { x: 3, y: 4 };
		expect(euclideanHeuristic(node1, node2)).toBe(5); // sqrt(3^2 + 4^2) = 5

		const sameNode = { x: 1, y: 1 };
		expect(euclideanHeuristic(sameNode, sameNode)).toBe(0);
	});
});

describe("zeroHeuristic", () => {
	it("should always return 0", () => {
		expect(zeroHeuristic("A", "B")).toBe(0);
		expect(zeroHeuristic(1, 2)).toBe(0);
		expect(zeroHeuristic({ x: 1, y: 2 }, { x: 3, y: 4 })).toBe(0);
	});
});
