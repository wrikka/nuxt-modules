import { describe, it, expect } from "bun:test";
import { bellmanFord, bellmanFordPath, bellmanFordDistance } from "./bellman-ford";
import type { WeightedGraph } from "../../types/graph";

describe("bellmanFord", () => {
	it("should calculate shortest distances with positive weights", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "C", weight: 1 }, { node: "D", weight: 5 }]],
			["C", [{ node: "D", weight: 8 }, { node: "E", weight: 10 }]],
			["D", [{ node: "E", weight: 2 }]],
			["E", []],
		]);

		const { distances, hasNegativeCycle } = bellmanFord(graph, "A");

		expect(distances.get("A")).toBe(0);
		expect(distances.get("B")).toBe(4);
		expect(distances.get("C")).toBe(2);
		expect(distances.get("D")).toBe(9);
		expect(distances.get("E")).toBe(11);
		expect(hasNegativeCycle).toBe(false);
	});

	it("should handle negative edge weights", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "C", weight: -3 }, { node: "D", weight: 5 }]],
			["C", [{ node: "D", weight: 8 }, { node: "E", weight: 10 }]],
			["D", [{ node: "E", weight: 2 }]],
			["E", []],
		]);

		const { distances, hasNegativeCycle } = bellmanFord(graph, "A");

		expect(distances.get("A")).toBe(0);
		expect(distances.get("B")).toBe(4);
		expect(distances.get("C")).toBe(1);
		expect(distances.get("D")).toBe(9);
		expect(distances.get("E")).toBe(11);
		expect(hasNegativeCycle).toBe(false);
	});

	it("should detect negative cycles", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", [{ node: "C", weight: 1 }]],
			["C", [{ node: "B", weight: -3 }]], // Creates negative cycle B -> C -> B
		]);

		const { hasNegativeCycle } = bellmanFord(graph, "A");
		expect(hasNegativeCycle).toBe(true);
	});

	it("should handle unreachable nodes", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", []],
			["C", [{ node: "D", weight: 1 }]],
			["D", []],
		]);

		const { distances, hasNegativeCycle } = bellmanFord(graph, "A");

		expect(distances.get("A")).toBe(0);
		expect(distances.get("B")).toBe(1);
		expect(distances.get("C")).toBe(Infinity);
		expect(distances.get("D")).toBe(Infinity);
		expect(hasNegativeCycle).toBe(false);
	});
});

describe("bellmanFordPath", () => {
	it("should find shortest path with negative weights", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "C", weight: -3 }, { node: "D", weight: 5 }]],
			["C", [{ node: "D", weight: 8 }, { node: "E", weight: 10 }]],
			["D", [{ node: "E", weight: 2 }]],
			["E", []],
		]);

		const { path, hasNegativeCycle } = bellmanFordPath(graph, "A", "D");
		expect(path).toEqual(["A", "B", "D"]);
		expect(hasNegativeCycle).toBe(false);
	});

	it("should return null when no path exists", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", []],
			["C", [{ node: "D", weight: 1 }]],
			["D", []],
		]);

		const { path } = bellmanFordPath(graph, "A", "C");
		expect(path).toBeNull();
	});
});

describe("bellmanFordDistance", () => {
	it("should return shortest distance with negative weights", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "C", weight: -3 }, { node: "D", weight: 5 }]],
			["C", [{ node: "D", weight: 8 }, { node: "E", weight: 10 }]],
			["D", [{ node: "E", weight: 2 }]],
			["E", []],
		]);

		const { distance, hasNegativeCycle } = bellmanFordDistance(graph, "A", "E");
		expect(distance).toBe(11);
		expect(hasNegativeCycle).toBe(false);
	});

	it("should return Infinity for unreachable nodes", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", []],
			["C", []],
		]);

		const { distance } = bellmanFordDistance(graph, "A", "C");
		expect(distance).toBe(Infinity);
	});
});
