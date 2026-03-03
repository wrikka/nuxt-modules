import { describe, it, expect } from "bun:test";
import { floydWarshall, floydWarshallPath, floydWarshallDistance } from "./floyd-warshall";
import type { WeightedGraph } from "../../types/graph";

describe("floydWarshall", () => {
	it("should compute all-pairs shortest paths", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "C", weight: 1 }, { node: "D", weight: 5 }]],
			["C", [{ node: "D", weight: 8 }, { node: "E", weight: 10 }]],
			["D", [{ node: "E", weight: 2 }]],
			["E", []],
		]);

		const { distances, hasNegativeCycle } = floydWarshall(graph);

		expect(hasNegativeCycle).toBe(false);
		expect(floydWarshallDistance(distances, "A", "A")).toBe(0);
		expect(floydWarshallDistance(distances, "A", "B")).toBe(4);
		expect(floydWarshallDistance(distances, "A", "C")).toBe(2);
		expect(floydWarshallDistance(distances, "A", "D")).toBe(9);
		expect(floydWarshallDistance(distances, "A", "E")).toBe(11);
		expect(floydWarshallDistance(distances, "B", "E")).toBe(7);
	});

	it("should handle negative edge weights", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "C", weight: -3 }, { node: "D", weight: 5 }]],
			["C", [{ node: "D", weight: 8 }, { node: "E", weight: 10 }]],
			["D", [{ node: "E", weight: 2 }]],
			["E", []],
		]);

		const { distances, hasNegativeCycle } = floydWarshall(graph);

		expect(hasNegativeCycle).toBe(false);
		expect(floydWarshallDistance(distances, "A", "C")).toBe(1); // A->C directly (2) or A->B->C (4-3=1), so 1
		expect(floydWarshallDistance(distances, "A", "E")).toBe(11);
	});

	it("should detect negative cycles", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", [{ node: "C", weight: 1 }]],
			["C", [{ node: "A", weight: -3 }]], // Creates negative cycle
		]);

		const { hasNegativeCycle } = floydWarshall(graph);
		expect(hasNegativeCycle).toBe(true);
	});

	it("should handle disconnected graph", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", [{ node: "A", weight: 1 }]],
			["C", [{ node: "D", weight: 2 }]],
			["D", [{ node: "C", weight: 2 }]],
		]);

		const { distances } = floydWarshall(graph);

		expect(floydWarshallDistance(distances, "A", "C")).toBe(Infinity);
		expect(floydWarshallDistance(distances, "A", "B")).toBe(1);
		expect(floydWarshallDistance(distances, "C", "D")).toBe(2);
	});

	it("should handle single node graph", () => {
		const graph: WeightedGraph<string> = new Map([["A", []]]);
		const { distances, hasNegativeCycle } = floydWarshall(graph);

		expect(hasNegativeCycle).toBe(false);
		expect(floydWarshallDistance(distances, "A", "A")).toBe(0);
	});
});

describe("floydWarshallPath", () => {
	it("should reconstruct shortest path", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "C", weight: 1 }, { node: "D", weight: 5 }]],
			["C", [{ node: "D", weight: 8 }, { node: "E", weight: 10 }]],
			["D", [{ node: "E", weight: 2 }]],
			["E", []],
		]);

		const { predecessors } = floydWarshall(graph);
		const path = floydWarshallPath(predecessors, "A", "E");

		expect(path).toEqual(["A", "B", "D", "E"]); // A->B->D->E has cost 4+5+2=11
	});

	it("should return null for unreachable nodes", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", []],
			["C", []],
		]);

		const { predecessors } = floydWarshall(graph);
		const path = floydWarshallPath(predecessors, "A", "C");

		expect(path).toBeNull();
	});
});

describe("floydWarshallDistance", () => {
	it("should return correct distances", () => {
		const distances = new Map([
			["A", new Map([["A", 0], ["B", 5], ["C", 10]])],
			["B", new Map([["A", 5], ["B", 0], ["C", 15]])],
			["C", new Map([["A", 10], ["B", 15], ["C", 0]])],
		]);

		expect(floydWarshallDistance(distances, "A", "B")).toBe(5);
		expect(floydWarshallDistance(distances, "B", "C")).toBe(15);
		expect(floydWarshallDistance(distances, "A", "C")).toBe(10);
	});

	it("should return Infinity for missing entries", () => {
		const distances = new Map([["A", new Map([["B", 5]])]]);
		expect(floydWarshallDistance(distances, "A", "C")).toBe(Infinity);
	});
});
