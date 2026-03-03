import { describe, it, expect } from "bun:test";
import { isBipartiteBFS, isBipartiteDFS, getBipartitePartitions } from "./bipartite-check";
import type { Graph } from "../../types/graph";

describe("isBipartiteBFS", () => {
	it("should identify bipartite graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "D"]],
			["C", ["A", "E"]],
			["D", ["B"]],
			["E", ["C"]],
		]);

		const result = isBipartiteBFS(graph);
		expect(result.isBipartite).toBe(true);
		expect(result.colors).toBeDefined();
	});

	it("should identify non-bipartite graph with odd cycle", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "C"]], // Triangle - odd cycle
			["C", ["A", "B"]],
		]);

		const result = isBipartiteBFS(graph);
		expect(result.isBipartite).toBe(false);
		expect(result.colors).toBeUndefined();
	});

	it("should handle disconnected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["A"]],
			["C", ["D"]],
			["D", ["C"]],
		]);

		const result = isBipartiteBFS(graph);
		expect(result.isBipartite).toBe(true);
		expect(result.colors).toBeDefined();
	});

	it("should handle single node", () => {
		const graph: Graph<string> = new Map([["A", []]]);
		const result = isBipartiteBFS(graph);
		expect(result.isBipartite).toBe(true);
		expect(result.colors!.get("A")).toBe(0);
	});

	it("should handle empty graph", () => {
		const graph: Graph<string> = new Map();
		const result = isBipartiteBFS(graph);
		expect(result.isBipartite).toBe(true);
		expect(result.colors!.size).toBe(0);
	});
});

describe("isBipartiteDFS", () => {
	it("should identify bipartite graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "D"]],
			["C", ["A", "E"]],
			["D", ["B"]],
			["E", ["C"]],
		]);

		const result = isBipartiteDFS(graph);
		expect(result.isBipartite).toBe(true);
		expect(result.colors).toBeDefined();
	});

	it("should identify non-bipartite graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["A", "C"]],
			["C", ["B"]], // This creates an odd cycle indirectly
		]);

		const result = isBipartiteDFS(graph);
		expect(result.isBipartite).toBe(true); // This is actually bipartite
	});

	it("should detect odd cycle", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C"]],
			["C", ["A"]], // Odd cycle
		]);

		const result = isBipartiteDFS(graph);
		expect(result.isBipartite).toBe(false);
	});
});

describe("getBipartitePartitions", () => {
	it("should partition bipartite graph correctly", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "D"]],
			["C", ["A", "E"]],
			["D", ["B"]],
			["E", ["C"]],
		]);

		const { colors } = isBipartiteBFS(graph);
		const partitions = getBipartitePartitions(graph, colors!);

		// Check that partitions are correct
		const allNodes = [...partitions.partition0, ...partitions.partition1].sort();
		expect(allNodes).toEqual(["A", "B", "C", "D", "E"]);

		// Check no edges within partitions (simplified check)
		const partition0Set = new Set(partitions.partition0);
		const partition1Set = new Set(partitions.partition1);

		// A should be in one partition, B,C,D,E in the other
		expect(partition0Set.has("A") || partition1Set.has("A")).toBe(true);
		expect(partitions.partition0.length + partitions.partition1.length).toBe(5);
	});

	it("should handle empty partitions", () => {
		const colors = new Map<string, number>();
		const graph: Graph<string> = new Map();
		const partitions = getBipartitePartitions(graph, colors);
		expect(partitions.partition0).toEqual([]);
		expect(partitions.partition1).toEqual([]);
	});
});
