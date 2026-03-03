import { describe, it, expect } from "bun:test";
import { dfs, dfsIterative, dfsPath } from "./dfs";
import type { Graph } from "../../types/graph";

describe("dfs", () => {
	it("should traverse a simple graph in DFS order", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["D", "E"]],
			["C", ["F"]],
			["D", []],
			["E", []],
			["F", []],
		]);

		const result = dfs(graph, "A");
		expect(result).toEqual(["A", "B", "D", "E", "C", "F"]);
	});

	it("should handle disconnected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C"]],
			["C", []],
			["D", ["E"]],
			["E", []],
		]);

		const result = dfs(graph, "A");
		expect(result).toEqual(["A", "B", "C"]);
	});

	it("should handle single node graph", () => {
		const graph: Graph<string> = new Map([["A", []]]);
		const result = dfs(graph, "A");
		expect(result).toEqual(["A"]);
	});
});

describe("dfsIterative", () => {
	it("should traverse graph in DFS order iteratively", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["D", "E"]],
			["C", ["F"]],
			["D", []],
			["E", []],
			["F", []],
		]);

		const result = dfsIterative(graph, "A");
		expect(result).toEqual(["A", "C", "F", "B", "E", "D"]);
	});
});

describe("dfsPath", () => {
	it("should find path from start to target", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["D", "E"]],
			["C", ["F"]],
			["D", []],
			["E", []],
			["F", []],
		]);

		const path = dfsPath(graph, "A", "D");
		expect(path).toEqual(["A", "B", "D"]);
	});

	it("should return null when no path exists", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C"]],
			["C", []],
			["D", ["E"]],
			["E", []],
		]);

		const path = dfsPath(graph, "A", "D");
		expect(path).toBeNull();
	});

	it("should handle direct connection", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", []],
		]);

		const path = dfsPath(graph, "A", "B");
		expect(path).toEqual(["A", "B"]);
	});
});
