import { describe, it, expect } from "bun:test";
import {
	graphToAdjacencyMatrix,
	weightedGraphToAdjacencyMatrix,
	adjacencyMatrixToGraph,
	adjacencyMatrixToWeightedGraph,
	makeUndirected,
	validateGraph,
	getGraphStats,
} from "./graph-utils";
import type { Graph, WeightedGraph } from "../../types/graph";

describe("graphToAdjacencyMatrix", () => {
	it("should convert graph to adjacency matrix", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "C"]],
			["C", ["A"]],
		]);

		const matrix = graphToAdjacencyMatrix(graph);
		expect(matrix.get("A")!.get("B")).toBe(1);
		expect(matrix.get("A")!.get("C")).toBe(1);
		expect(matrix.get("B")!.get("A")).toBe(1);
		expect(matrix.get("B")!.get("C")).toBe(1);
		expect(matrix.get("C")!.get("A")).toBe(1);
		expect(matrix.get("A")!.get("A")).toBe(0); // No self-loops
	});

	it("should handle empty graph", () => {
		const graph: Graph<string> = new Map();
		const matrix = graphToAdjacencyMatrix(graph);
		expect(matrix.size).toBe(0);
	});
});

describe("weightedGraphToAdjacencyMatrix", () => {
	it("should convert weighted graph to adjacency matrix", () => {
		const graph: WeightedGraph<string> = new Map([
			["A", [{ node: "B", weight: 5 }, { node: "C", weight: 3 }]],
			["B", [{ node: "A", weight: 5 }]],
			["C", []],
		]);

		const matrix = weightedGraphToAdjacencyMatrix(graph);
		expect(matrix.get("A")!.get("B")).toBe(5);
		expect(matrix.get("A")!.get("C")).toBe(3);
		expect(matrix.get("B")!.get("A")).toBe(5);
		expect(matrix.get("A")!.get("A")).toBe(0); // Self-distance is 0
		expect(matrix.get("A")!.get("D")).toBeUndefined(); // Node D doesn't exist
		expect(matrix.get("C")!.get("A")).toBe(Infinity); // No edge
	});
});

describe("adjacencyMatrixToGraph", () => {
	it("should convert adjacency matrix back to graph", () => {
		const matrix = new Map([
			["A", new Map([["A", 0], ["B", 1], ["C", 0]])],
			["B", new Map([["A", 0], ["B", 0], ["C", 1]])],
			["C", new Map([["A", 1], ["B", 0], ["C", 0]])],
		]);

		const graph = adjacencyMatrixToGraph(matrix);
		expect(graph.get("A")).toEqual(["B"]);
		expect(graph.get("B")).toEqual(["C"]);
		expect(graph.get("C")).toEqual(["A"]);
	});

	it("should handle weighted matrix with threshold", () => {
		const matrix = new Map([
			["A", new Map([["A", 0], ["B", 0.5], ["C", 2.0]])],
			["B", new Map([["A", 0], ["B", 0], ["C", 0.1]])],
			["C", new Map([["A", 0], ["B", 0], ["C", 0]])],
		]);

		const graph = adjacencyMatrixToGraph(matrix, 1.0);
		expect(graph.get("A")).toEqual(["C"]); // Only weight >= 1.0
		expect(graph.get("B")).toEqual([]);
		expect(graph.get("C")).toEqual([]);
	});
});

describe("adjacencyMatrixToWeightedGraph", () => {
	it("should convert adjacency matrix back to weighted graph", () => {
		const matrix = new Map([
			["A", new Map([["A", 0], ["B", 5], ["C", Infinity]])],
			["B", new Map([["A", 3], ["B", 0], ["C", 2]])],
			["C", new Map([["A", Infinity], ["B", Infinity], ["C", 0]])],
		]);

		const graph = adjacencyMatrixToWeightedGraph(matrix);
		expect(graph.get("A")).toEqual([{ node: "B", weight: 5 }]);
		expect(graph.get("B")).toEqual([{ node: "A", weight: 3 }, { node: "C", weight: 2 }]);
		expect(graph.get("C")).toEqual([]);
	});
});

describe("makeUndirected", () => {
	it("should make directed graph undirected", () => {
		const directed: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["C"]],
			["C", []],
		]);

		const undirected = makeUndirected(directed);
		expect(undirected.get("A")!.sort()).toEqual(["B", "C"]);
		expect(undirected.get("B")!.sort()).toEqual(["A", "C"]);
		expect(undirected.get("C")!.sort()).toEqual(["A", "B"]);
	});

	it("should handle already undirected graph", () => {
		const undirected: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "C"]],
			["C", ["A", "B"]],
		]);

		const result = makeUndirected(undirected);
		expect(result.get("A")!.sort()).toEqual(["B", "C"]);
		expect(result.get("B")!.sort()).toEqual(["A", "C"]);
		expect(result.get("C")!.sort()).toEqual(["A", "B"]);
	});
});

describe("validateGraph", () => {
	it("should validate valid graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "C"]],
			["C", ["A"]],
		]);

		expect(validateGraph(graph)).toBe(true);
	});

	it("should invalidate graph with missing nodes", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "D"]], // D doesn't exist as a key
			["B", ["A"]],
		]);

		expect(validateGraph(graph)).toBe(false);
	});

	it("should validate empty graph", () => {
		const graph: Graph<string> = new Map();
		expect(validateGraph(graph)).toBe(true);
	});
});

describe("getGraphStats", () => {
	it("should calculate graph statistics", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "C"]],
			["C", ["A"]],
		]);

		const stats = getGraphStats(graph);
		expect(stats.nodeCount).toBe(3);
		expect(stats.edgeCount).toBe(5); // A->B, A->C, B->A, B->C, C->A
		expect(stats.isDirected).toBe(true);
		expect(stats.averageDegree).toBeCloseTo(5 / 3, 1);
		expect(stats.maxDegree).toBe(2);
		expect(stats.minDegree).toBe(1);
	});

	it("should handle empty graph", () => {
		const graph: Graph<string> = new Map();
		const stats = getGraphStats(graph);
		expect(stats.nodeCount).toBe(0);
		expect(stats.edgeCount).toBe(0);
		expect(stats.averageDegree).toBe(0);
		expect(stats.maxDegree).toBe(0);
		expect(stats.minDegree).toBe(0);
	});
});
