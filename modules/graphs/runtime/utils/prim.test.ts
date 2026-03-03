import { describe, it, expect } from "bun:test";
import { prim, primMstToGraph } from "./prim";
import type { WeightedGraph } from "../../types/graph";

describe("prim", () => {
	it("should find MST for a simple weighted graph", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "A", weight: 4 }, { node: "C", weight: 1 }, { node: "D", weight: 5 }]],
			["C", [{ node: "A", weight: 2 }, { node: "B", weight: 1 }, { node: "D", weight: 8 }]],
			["D", [{ node: "B", weight: 5 }, { node: "C", weight: 8 }]],
		]);

		const { mst, totalWeight } = prim(graph, "A");

		expect(totalWeight).toBe(8); // A-C: 2, C-B: 1, B-D: 5
		expect(mst.length).toBe(3);

		const edgeWeights = mst.map(edge => edge.weight).sort();
		expect(edgeWeights).toEqual([1, 2, 5]);
	});

	it("should work with different starting nodes", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 4 }, { node: "C", weight: 2 }]],
			["B", [{ node: "A", weight: 4 }, { node: "C", weight: 1 }, { node: "D", weight: 5 }]],
			["C", [{ node: "A", weight: 2 }, { node: "B", weight: 1 }, { node: "D", weight: 8 }]],
			["D", [{ node: "B", weight: 5 }, { node: "C", weight: 8 }]],
		]);

		const { totalWeight: weightFromA } = prim(graph, "A");
		const { totalWeight: weightFromB } = prim(graph, "B");

		// MST weight should be the same regardless of starting node
		expect(weightFromA).toBe(weightFromB);
		expect(weightFromA).toBe(8);
	});

	it("should handle disconnected graph", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 1 }]],
			["B", [{ node: "A", weight: 1 }]],
			["C", [{ node: "D", weight: 2 }]],
			["D", [{ node: "C", weight: 2 }]],
		]);

		const { mst, totalWeight } = prim(graph, "A");

		expect(totalWeight).toBe(1); // Only connects A-B, not C-D
		expect(mst.length).toBe(1);
		expect(mst[0]).toEqual({ from: "A", to: "B", weight: 1 });
	});

	it("should handle single node graph", () => {
		const graph: WeightedGraph<string> = new Map([["A", []]]);

		const { mst, totalWeight } = prim(graph, "A");

		expect(totalWeight).toBe(0);
		expect(mst.length).toBe(0);
	});

	it("should handle empty graph", () => {
		const graph: WeightedGraph<string> = new Map();

		const { mst, totalWeight } = prim(graph);

		expect(totalWeight).toBe(0);
		expect(mst.length).toBe(0);
	});
});

describe("primMstToGraph", () => {
	it("should convert MST edges back to graph representation", () => {
		const mst = [
			{ from: "A", to: "B", weight: 1 },
			{ from: "B", to: "C", weight: 2 },
			{ from: "C", to: "D", weight: 3 },
		];

		const graph = primMstToGraph(mst);

		expect(graph.get("A")).toEqual([{ node: "B", weight: 1 }]);
		expect(graph.get("B")).toEqual([{ node: "A", weight: 1 }, { node: "C", weight: 2 }]);
		expect(graph.get("C")).toEqual([{ node: "B", weight: 2 }, { node: "D", weight: 3 }]);
		expect(graph.get("D")).toEqual([{ node: "C", weight: 3 }]);
	});

	it("should handle empty MST", () => {
		const mst: Array<{ from: string; to: string; weight: number }> = [];
		const graph = primMstToGraph(mst);
		expect(graph.size).toBe(0);
	});
});
