import { describe, it, expect } from "bun:test";
import { bfs, bfsPath } from "./bfs";
import type { Graph } from "../../types/graph";

describe("bfs", () => {
	it("should traverse a simple graph in BFS order", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["D", "E"]],
			["C", ["F"]],
			["D", []],
			["E", []],
			["F", []],
		]);

		const result = bfs(graph, "A");
		expect(result).toEqual(["A", "B", "C", "D", "E", "F"]);
	});

	it("should handle disconnected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C"]],
			["C", []],
			["D", ["E"]],
			["E", []],
		]);

		const result = bfs(graph, "A");
		expect(result).toEqual(["A", "B", "C"]);
	});

	it("should handle single node graph", () => {
		const graph: Graph<string> = new Map([["A", []]]);
		const result = bfs(graph, "A");
		expect(result).toEqual(["A"]);
	});
});

describe("bfsPath", () => {
	it("should find path from start to target", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["D", "E"]],
			["C", ["F"]],
			["D", []],
			["E", []],
			["F", []],
		]);

		const path = bfsPath(graph, "A", "D");
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

		const path = bfsPath(graph, "A", "D");
		expect(path).toBeNull();
	});

	it("should handle direct connection", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", []],
		]);

		const path = bfsPath(graph, "A", "B");
		expect(path).toEqual(["A", "B"]);
	});
});
