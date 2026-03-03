import { describe, it, expect } from "bun:test";
import { dijkstra, dijkstraPath, dijkstraDistance } from "./dijkstra";
import type { WeightedGraph } from "../../types/graph";

describe("dijkstra", () => {
	it("should calculate shortest distances from start node", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "C", weight: 1 }, { node: "D", weight: 5 }]],
			["C", [{ node: "D", weight: 8 }, { node: "E", weight: 10 }]],
			["D", [{ node: "E", weight: 2 }]],
			["E", []],
		]);

		const { distances } = dijkstra(graph, "A");

		expect(distances.get("A")).toBe(0);
		expect(distances.get("B")).toBe(4);
		expect(distances.get("C")).toBe(2);
		expect(distances.get("D")).toBe(9);
		expect(distances.get("E")).toBe(11);
	});

	it("should handle unreachable nodes", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", []],
			["C", [{ node: "D", weight: 1 }]],
			["D", []],
		]);

		const { distances } = dijkstra(graph, "A");

		expect(distances.get("A")).toBe(0);
		expect(distances.get("B")).toBe(1);
		expect(distances.get("C")).toBe(Infinity);
		expect(distances.get("D")).toBe(Infinity);
	});
});

describe("dijkstraPath", () => {
	it("should find shortest path from start to target", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "C", weight: 1 }, { node: "D", weight: 5 }]],
			["C", [{ node: "D", weight: 8 }, { node: "E", weight: 10 }]],
			["D", [{ node: "E", weight: 2 }]],
			["E", []],
		]);

		const path = dijkstraPath(graph, "A", "D");
		expect(path).toEqual(["A", "B", "D"]);
	});

	it("should return null when no path exists", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", []],
			["C", [{ node: "D", weight: 1 }]],
			["D", []],
		]);

		const path = dijkstraPath(graph, "A", "C");
		expect(path).toBeNull();
	});

	it("should handle direct connection", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 5 }]],
			["B", []],
		]);

		const path = dijkstraPath(graph, "A", "B");
		expect(path).toEqual(["A", "B"]);
	});
});

describe("dijkstraDistance", () => {
	it("should return shortest distance", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "C", weight: 1 }, { node: "D", weight: 5 }]],
			["C", [{ node: "D", weight: 8 }, { node: "E", weight: 10 }]],
			["D", [{ node: "E", weight: 2 }]],
			["E", []],
		]);

		const distance = dijkstraDistance(graph, "A", "E");
		expect(distance).toBe(11);
	});

	it("should return Infinity for unreachable nodes", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", []],
			["C", []],
		]);

		const distance = dijkstraDistance(graph, "A", "C");
		expect(distance).toBe(Infinity);
	});
});
