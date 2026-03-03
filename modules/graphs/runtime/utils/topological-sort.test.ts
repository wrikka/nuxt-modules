import { describe, it, expect } from "bun:test";
import { topologicalSort, topologicalSortDFS } from "./topological-sort";
import { Graph } from "./graph-types";

describe("topologicalSort", () => {
	it("should sort a simple DAG", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["D"]],
			["C", ["D"]],
			["D", []],
			["E", ["D"]],
		]);

		const result = topologicalSort(graph);
		expect(result).toBeTruthy();
		expect(result!.length).toBe(5);

		// Check that dependencies come before dependents
		const order = result!;
		const aIndex = order.indexOf("A");
		const bIndex = order.indexOf("B");
		const cIndex = order.indexOf("C");
		const dIndex = order.indexOf("D");
		const eIndex = order.indexOf("E");

		expect(aIndex).toBeLessThan(bIndex);
		expect(aIndex).toBeLessThan(cIndex);
		expect(bIndex).toBeLessThan(dIndex);
		expect(cIndex).toBeLessThan(dIndex);
		expect(eIndex).toBeLessThan(dIndex);
	});

	it("should detect cycles", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C"]],
			["C", ["A"]], // Cycle: A -> B -> C -> A
		]);

		const result = topologicalSort(graph);
		expect(result).toBeNull();
	});

	it("should handle disconnected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", []],
			["C", ["D"]],
			["D", []],
		]);

		const result = topologicalSort(graph);
		expect(result).toBeTruthy();
		expect(result!.length).toBe(4);

		// Check ordering within components
		const order = result!;
		const aIndex = order.indexOf("A");
		const bIndex = order.indexOf("B");
		const cIndex = order.indexOf("C");
		const dIndex = order.indexOf("D");

		expect(aIndex).toBeLessThan(bIndex);
		expect(cIndex).toBeLessThan(dIndex);
	});

	it("should handle single node", () => {
		const graph: Graph<string> = new Map([["A", []]]);
		const result = topologicalSort(graph);
		expect(result).toEqual(["A"]);
	});

	it("should handle empty graph", () => {
		const graph: Graph<string> = new Map();
		const result = topologicalSort(graph);
		expect(result).toEqual([]);
	});
});

describe("topologicalSortDFS", () => {
	it("should sort a simple DAG", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["D"]],
			["C", ["D"]],
			["D", []],
			["E", ["D"]],
		]);

		const result = topologicalSortDFS(graph);
		expect(result).toBeTruthy();
		expect(result!.length).toBe(5);

		// Check that dependencies come before dependents
		const order = result!;
		const aIndex = order.indexOf("A");
		const bIndex = order.indexOf("B");
		const cIndex = order.indexOf("C");
		const dIndex = order.indexOf("D");
		const eIndex = order.indexOf("E");

		expect(aIndex).toBeLessThan(bIndex);
		expect(aIndex).toBeLessThan(cIndex);
		expect(bIndex).toBeLessThan(dIndex);
		expect(cIndex).toBeLessThan(dIndex);
		expect(eIndex).toBeLessThan(dIndex);
	});

	it("should detect cycles", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C"]],
			["C", ["A"]], // Cycle: A -> B -> C -> A
		]);

		const result = topologicalSortDFS(graph);
		expect(result).toBeNull();
	});

	it("should handle self-loop cycle", () => {
		const graph: Graph<string> = new Map([
			["A", ["A"]], // Self-loop
		]);

		const result = topologicalSortDFS(graph);
		expect(result).toBeNull();
	});
});
