import { describe, it, expect } from "bun:test";
import { findStronglyConnectedComponents, countStronglyConnectedComponents, isStronglyConnected } from "./strongly-connected-components";
import type { Graph } from "./graph-types";

describe("findStronglyConnectedComponents", () => {
	it("should find SCCs in a directed graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C", "E"]],
			["C", ["A", "D"]],
			["D", ["C"]],
			["E", ["D"]],
			["F", ["G"]],
			["G", ["F", "H"]],
			["H", ["I"]],
			["I", ["H"]],
		]);

		const components = findStronglyConnectedComponents(graph);

		// Should have 3 SCCs: {A, B, C, D, E}, {F, G}, {H, I}
		expect(components.length).toBe(3);

		// Flatten and check all nodes are included
		const allNodes = components.flat().sort();
		expect(allNodes).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I"]);
	});

	it("should handle single node", () => {
		const graph: Graph<string> = new Map([["A", []]]);
		const components = findStronglyConnectedComponents(graph);
		expect(components).toEqual([["A"]]);
	});

	it("should handle strongly connected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C"]],
			["C", ["A"]],
		]);

		const components = findStronglyConnectedComponents(graph);
		expect(components.length).toBe(1);
		expect(components[0].sort()).toEqual(["A", "B", "C"]);
	});

	it("should handle disconnected components", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["A"]],
			["C", ["D"]],
			["D", []],
		]);

		const components = findStronglyConnectedComponents(graph);
		expect(components.length).toBe(3); // {A, B}, {C}, {D}
	});

	it("should handle empty graph", () => {
		const graph: Graph<string> = new Map();
		const components = findStronglyConnectedComponents(graph);
		expect(components).toEqual([]);
	});
});

describe("countStronglyConnectedComponents", () => {
	it("should count SCCs correctly", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C"]],
			["C", ["A"]],
			["D", ["E"]],
			["E", []],
		]);

		expect(countStronglyConnectedComponents(graph)).toBe(3); // {A,B,C}, {D}, {E}
	});

	it("should return 0 for empty graph", () => {
		const graph: Graph<string> = new Map();
		expect(countStronglyConnectedComponents(graph)).toBe(0);
	});
});

describe("isStronglyConnected", () => {
	it("should return true for strongly connected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["C"]],
			["C", ["A"]],
		]);

		expect(isStronglyConnected(graph)).toBe(true);
	});

	it("should return false for weakly connected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", []],
			["C", ["A"]],
		]);

		expect(isStronglyConnected(graph)).toBe(false);
	});

	it("should return true for single node", () => {
		const graph: Graph<string> = new Map([["A", []]]);
		expect(isStronglyConnected(graph)).toBe(true);
	});

	it("should return false for empty graph", () => {
		const graph: Graph<string> = new Map();
		expect(isStronglyConnected(graph)).toBe(false);
	});
});
