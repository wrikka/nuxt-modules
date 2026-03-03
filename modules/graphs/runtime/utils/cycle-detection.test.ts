import { describe, it, expect } from "bun:test";
import { hasCycleDFS, hasCycleUndirected, hasCycleTopological } from "./cycle-detection";
import type { Graph } from "../../types/graph";

describe("hasCycleDFS", () => {
	it("should detect cycle in directed graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C"]],
			["C", ["A"]], // Cycle: A -> B -> C -> A
		]);

		expect(hasCycleDFS(graph)).toBe(true);
	});

	it("should return false for acyclic directed graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["D"]],
			["C", ["D"]],
			["D", []],
		]);

		expect(hasCycleDFS(graph)).toBe(false);
	});

	it("should detect self-loop cycle", () => {
		const graph: Graph<string> = new Map([
			["A", ["A"]], // Self-loop
		]);

		expect(hasCycleDFS(graph)).toBe(true);
	});

	it("should handle disconnected components", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", []],
			["C", ["D"]],
			["D", ["C"]], // Cycle in second component
		]);

		expect(hasCycleDFS(graph)).toBe(true);
	});
});

describe("hasCycleUndirected", () => {
	it("should detect cycle in undirected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "C"]],
			["C", ["A", "B"]], // Triangle cycle
		]);

		expect(hasCycleUndirected(graph)).toBe(true);
	});

	it("should return false for acyclic undirected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C"]],
			["C", []],
		]);

		expect(hasCycleUndirected(graph)).toBe(false);
	});

	it("should handle disconnected components", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "C"]],
			["C", ["A", "B"]], // Triangle cycle in first component
			["D", ["E"]],
			["E", ["D"]], // No cycle in second component
		]);

		expect(hasCycleUndirected(graph)).toBe(true); // Cycle in first component
	});

	it("should return false for single node", () => {
		const graph: Graph<string> = new Map([["A", []]]);
		expect(hasCycleUndirected(graph)).toBe(false);
	});
});

describe("hasCycleTopological", () => {
	it("should detect cycle in directed graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C"]],
			["C", ["A"]], // Cycle: A -> B -> C -> A
		]);

		expect(hasCycleTopological(graph)).toBe(true);
	});

	it("should return false for acyclic directed graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["D"]],
			["C", ["D"]],
			["D", []],
		]);

		expect(hasCycleTopological(graph)).toBe(false);
	});

	it("should detect self-loop cycle", () => {
		const graph: Graph<string> = new Map([
			["A", ["A"]], // Self-loop
		]);

		expect(hasCycleTopological(graph)).toBe(true);
	});

	it("should handle complex DAG", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["D", "E"]],
			["C", ["F"]],
			["D", ["G"]],
			["E", ["G"]],
			["F", ["G"]],
			["G", []],
		]);

		expect(hasCycleTopological(graph)).toBe(false);
	});
});
