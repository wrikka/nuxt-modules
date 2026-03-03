import type { WeightedGraph } from "../../types/graph";

/**
 * Edge representation for Kruskal's algorithm
 */
export interface Edge<T> {
	from: T;
	to: T;
	weight: number;
}

/**
 * Union-Find (Disjoint Set) data structure
 */
class UnionFind<T> {
	private parent = new Map<T, T>();
	private rank = new Map<T, number>();

	constructor(nodes: T[]) {
		for (const node of nodes) {
			this.parent.set(node, node);
			this.rank.set(node, 0);
		}
	}

	find(node: T): T {
		if (this.parent.get(node) !== node) {
			this.parent.set(node, this.find(this.parent.get(node)!));
		}
		return this.parent.get(node)!;
	}

	union(node1: T, node2: T): boolean {
		const root1 = this.find(node1);
		const root2 = this.find(node2);

		if (root1 === root2) {
			return false; // Already in same set
		}

		// Union by rank
		if (this.rank.get(root1)! < this.rank.get(root2)!) {
			this.parent.set(root1, root2);
		} else if (this.rank.get(root1)! > this.rank.get(root2)!) {
			this.parent.set(root2, root1);
		} else {
			this.parent.set(root2, root1);
			this.rank.set(root1, this.rank.get(root1)! + 1);
		}

		return true;
	}
}

/**
 * Implements Kruskal's algorithm for finding Minimum Spanning Tree
 * @param graph - The weighted graph
 * @returns Array of edges forming the MST and total weight
 */
export function kruskal<T>(
	graph: WeightedGraph<T>
): { mst: Edge<T>[]; totalWeight: number } {
	const edges: Edge<T>[] = [];
	const nodes = Array.from(graph.keys());

	// Collect all edges
	for (const [from, neighbors] of graph) {
		for (const { node: to, weight } of neighbors) {
			// Avoid duplicate edges in undirected graph
			if (from < to) {
				edges.push({ from, to, weight });
			}
		}
	}

	// Sort edges by weight
	edges.sort((a, b) => a.weight - b.weight);

	const unionFind = new UnionFind(nodes);
	const mst: Edge<T>[] = [];
	let totalWeight = 0;

	for (const edge of edges) {
		if (unionFind.union(edge.from, edge.to)) {
			mst.push(edge);
			totalWeight += edge.weight;
		}
	}

	return { mst, totalWeight };
}

/**
 * Converts MST edges back to a weighted graph representation
 * @param mst - Array of edges from MST
 * @returns Weighted graph representation of MST
 */
export function mstToGraph<T>(mst: Edge<T>[]): WeightedGraph<T> {
	const graph: WeightedGraph<T> = new Map();

	for (const edge of mst) {
		if (!graph.has(edge.from)) {
			graph.set(edge.from, []);
		}
		if (!graph.has(edge.to)) {
			graph.set(edge.to, []);
		}

		graph.get(edge.from)!.push({ node: edge.to, weight: edge.weight });
		graph.get(edge.to)!.push({ node: edge.from, weight: edge.weight });
	}

	return graph;
}
