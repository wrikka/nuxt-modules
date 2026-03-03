import { describe, it, expect } from "bun:test";
import { kruskal, mstToGraph, Edge } from "./kruskal";
import type { WeightedGraph } from "../../types/graph";

describe("kruskal", () => {
	it("should find MST for a simple weighted graph", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "A", weight: 4 }, { node: "C", weight: 1 }, { node: "D", weight: 5 }]],
			["C", [{ node: "A", weight: 2 }, { node: "B", weight: 1 }, { node: "D", weight: 8 }]],
			["D", [{ node: "B", weight: 5 }, { node: "C", weight: 8 }]],
		]);

		const { mst, totalWeight } = kruskal(graph);

		expect(totalWeight).toBe(8); // A-C: 2, C-B: 1, B-D: 5 = 8

		const edgeWeights = mst.map(edge => edge.weight).sort();
		expect(edgeWeights).toEqual([1, 2, 5]);
	});

	it("should handle disconnected graph", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", [{ node: "A", weight: 1 }]],
			["C", [{ node: "D", weight: 2 }]],
			["D", [{ node: "C", weight: 2 }]],
		]);

		const { mst, totalWeight } = kruskal(graph);

		expect(totalWeight).toBe(3); // A-B: 1, C-D: 2
		expect(mst.length).toBe(2);
	});

	it("should return empty MST for single node graph", () => {
		const graph: WeightedGraph<string> = new Map([["A", []]]);

		const { mst, totalWeight } = kruskal(graph);

		expect(totalWeight).toBe(0);
		expect(mst.length).toBe(0);
	});

	it("should handle graph with multiple possible MSTs", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }, { node: "C", weight: 3 }]],
			["B", [{ node: "A", weight: 1 }, { node: "C", weight: 2 }]],
			["C", [{ node: "A", weight: 3 }, { node: "B", weight: 2 }]],
		]);

		const { mst, totalWeight } = kruskal(graph);

		expect(totalWeight).toBe(3); // A-B: 1, B-C: 2
		expect(mst.length).toBe(2);
	});
});

describe("mstToGraph", () => {
	it("should convert MST edges back to graph representation", () => {
		const mst: Edge<string>[] = [
			{ from: "A", to: "B", weight: 1 },
			{ from: "B", to: "C", weight: 2 },
			{ from: "C", to: "D", weight: 3 },
		];

		const graph = mstToGraph(mst);

		expect(graph.get("A")).toEqual([{ node: "B", weight: 1 }]);
		expect(graph.get("B")).toEqual([{ node: "A", weight: 1 }, { node: "C", weight: 2 }]);
		expect(graph.get("C")).toEqual([{ node: "B", weight: 2 }, { node: "D", weight: 3 }]);
		expect(graph.get("D")).toEqual([{ node: "C", weight: 3 }]);
	});

	it("should handle empty MST", () => {
		const mst: Edge<string>[] = [];
		const graph = mstToGraph(mst);
		expect(graph.size).toBe(0);
	});
});
