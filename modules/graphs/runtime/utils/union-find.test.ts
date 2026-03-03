import { describe, it, expect } from "bun:test";
import { UnionFind, createUnionFind } from "./union-find";

describe("UnionFind", () => {
	it("should initialize with empty sets", () => {
		const uf = new UnionFind<string>();
		expect(uf.getSetCount()).toBe(0);
	});

	it("should create sets for elements", () => {
		const uf = new UnionFind<string>();
		uf.makeSet("A");
		uf.makeSet("B");
		uf.makeSet("C");

		expect(uf.getSetCount()).toBe(3);
		expect(uf.getSetSize("A")).toBe(1);
		expect(uf.getSetSize("B")).toBe(1);
		expect(uf.getSetSize("C")).toBe(1);
	});

	it("should find root of single element set", () => {
		const uf = new UnionFind<string>();
		uf.makeSet("A");

		expect(uf.find("A")).toBe("A");
	});

	it("should union two separate sets", () => {
		const uf = new UnionFind<string>();
		uf.makeSet("A");
		uf.makeSet("B");

		expect(uf.union("A", "B")).toBe(true);
		expect(uf.connected("A", "B")).toBe(true);
		expect(uf.getSetCount()).toBe(1);
		expect(uf.getSetSize("A")).toBe(2);
		expect(uf.getSetSize("B")).toBe(2);
	});

	it("should not union already connected elements", () => {
		const uf = new UnionFind<string>();
		uf.makeSet("A");
		uf.makeSet("B");
		uf.union("A", "B");

		expect(uf.union("A", "B")).toBe(false);
		expect(uf.getSetCount()).toBe(1);
	});

	it("should handle multiple unions with union by rank", () => {
		const uf = new UnionFind<string>();
		uf.makeSet("A");
		uf.makeSet("B");
		uf.makeSet("C");
		uf.makeSet("D");

		uf.union("A", "B");
		uf.union("C", "D");
		uf.union("A", "C");

		expect(uf.getSetCount()).toBe(1);
		expect(uf.connected("A", "D")).toBe(true);
		expect(uf.getSetSize("A")).toBe(4);
	});

	it("should get set elements correctly", () => {
		const uf = new UnionFind<string>();
		uf.makeSet("A");
		uf.makeSet("B");
		uf.makeSet("C");

		uf.union("A", "B");

		const setElements = uf.getSetElements("A").sort();
		expect(setElements).toEqual(["A", "B"]);

		const singletonElements = uf.getSetElements("C");
		expect(singletonElements).toEqual(["C"]);
	});

	it("should get all sets", () => {
		const uf = new UnionFind<string>();
		uf.makeSet("A");
		uf.makeSet("B");
		uf.makeSet("C");
		uf.makeSet("D");

		uf.union("A", "B");
		uf.union("C", "D");

		const allSets = uf.getAllSets().sort();
		expect(allSets.length).toBe(2);
	});

	it("should throw error for non-existent element", () => {
		const uf = new UnionFind<string>();
		expect(() => uf.find("A")).toThrow();
		expect(() => uf.union("A", "B")).toThrow();
	});

	it("should handle path compression", () => {
		const uf = new UnionFind<string>();
		uf.makeSet("A");
		uf.makeSet("B");
		uf.makeSet("C");
		uf.makeSet("D");

		uf.union("A", "B");
		uf.union("B", "C");
		uf.union("C", "D");

		// After path compression, all should point to same root
		const root = uf.find("A");
		expect(uf.find("B")).toBe(root);
		expect(uf.find("C")).toBe(root);
		expect(uf.find("D")).toBe(root);
	});
});

describe("createUnionFind", () => {
	it("should create UnionFind with initial elements", () => {
		const uf = createUnionFind(["A", "B", "C"]);

		expect(uf.getSetCount()).toBe(3);
		expect(uf.getSetSize("A")).toBe(1);
		expect(uf.getSetSize("B")).toBe(1);
		expect(uf.getSetSize("C")).toBe(1);
	});
});
