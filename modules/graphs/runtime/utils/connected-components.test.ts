import { describe, it, expect } from "bun:test";
import { findConnectedComponents, findConnectedComponentsBFS, countConnectedComponents, isConnected } from "./connected-components";
import type { Graph } from "../../types/graph";

describe("findConnectedComponents", () => {
	it("should find components in a disconnected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "C"]],
			["C", ["A", "B"]],
			["D", ["E"]],
			["E", ["D"]],
			["F", []],
		]);

		const components = findConnectedComponents(graph);
		expect(components.length).toBe(3);

		// Sort components for consistent comparison
		const sortedComponents = components.map(comp => comp.sort()).sort((a, b) => a[0].localeCompare(b[0]));

		expect(sortedComponents[0]).toEqual(["A", "B", "C"]);
		expect(sortedComponents[1]).toEqual(["D", "E"]);
		expect(sortedComponents[2]).toEqual(["F"]);
	});

	it("should return single component for connected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["A", "C"]],
			["C", ["B"]],
		]);

		const components = findConnectedComponents(graph);
		expect(components.length).toBe(1);
		expect(components[0].sort()).toEqual(["A", "B", "C"]);
	});

	it("should handle single node", () => {
		const graph: Graph<string> = new Map([["A", []]]);
		const components = findConnectedComponents(graph);
		expect(components).toEqual([["A"]]);
	});

	it("should handle empty graph", () => {
		const graph: Graph<string> = new Map();
		const components = findConnectedComponents(graph);
		expect(components).toEqual([]);
	});

	it("should handle isolated nodes", () => {
		const graph: Graph<string> = new Map([
			["A", []],
			["B", []],
			["C", []],
		]);

		const components = findConnectedComponents(graph);
		expect(components.length).toBe(3);
		const sortedComponents = components.map(comp => comp.sort()).sort();
		expect(sortedComponents).toEqual([["A"], ["B"], ["C"]]);
	});
});

describe("findConnectedComponentsBFS", () => {
	it("should find same components as DFS version", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "C"]],
			["C", ["A", "B"]],
			["D", ["E"]],
			["E", ["D"]],
			["F", []],
		]);

		const dfsComponents = findConnectedComponents(graph);
		const bfsComponents = findConnectedComponentsBFS(graph);

		// Both should have same number of components and same total nodes
		expect(bfsComponents.length).toBe(dfsComponents.length);
		expect(bfsComponents.flat().length).toBe(dfsComponents.flat().length);
	});
});

describe("countConnectedComponents", () => {
	it("should count components correctly", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["A"]],
			["C", ["D"]],
			["D", ["C"]],
			["E", []],
		]);

		expect(countConnectedComponents(graph)).toBe(3);
	});

	it("should return 0 for empty graph", () => {
		const graph: Graph<string> = new Map();
		expect(countConnectedComponents(graph)).toBe(0);
	});
});

describe("isConnected", () => {
	it("should return true for connected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B", "C"]],
			["B", ["A", "C"]],
			["C", ["A", "B"]],
		]);

		expect(isConnected(graph)).toBe(true);
	});

	it("should return false for disconnected graph", () => {
		const graph: Graph<string> = new Map([
			["A", ["B"]],
			["B", ["A"]],
			["C", ["D"]],
			["D", ["C"]],
		]);

		expect(isConnected(graph)).toBe(false);
	});

	it("should return true for single node", () => {
		const graph: Graph<string> = new Map([["A", []]]);
		expect(isConnected(graph)).toBe(true);
	});

	it("should return false for empty graph", () => {
		const graph: Graph<string> = new Map();
		expect(isConnected(graph)).toBe(false);
	});
});
