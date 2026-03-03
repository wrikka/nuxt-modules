// Usage examples for Graph Utilities

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

// Example 1: Converting between graph representations
const socialGraph: Graph<string> = new Map([
	["Alice", ["Bob", "Charlie"]],
	["Bob", ["Alice", "David"]],
	["Charlie", ["Alice"]],
	["David", ["Bob", "Eve"]],
	["Eve", ["David"]],
]);

// Convert to adjacency matrix
const adjacencyMatrix = graphToAdjacencyMatrix(socialGraph);
console.log("Adjacency matrix for Alice's connections:");
console.log(`Alice -> Bob: ${adjacencyMatrix.get("Alice")!.get("Bob")}`);
console.log(`Alice -> Charlie: ${adjacencyMatrix.get("Alice")!.get("Charlie")}`);

// Convert back to graph
const reconstructedGraph = adjacencyMatrixToGraph(adjacencyMatrix);
console.log("Reconstructed graph is valid:", validateGraph(reconstructedGraph));

// Example 2: Working with weighted graphs
const roadNetwork: WeightedGraph<string> = new Map([
	["A", [{ node: "B", weight: 5 }, { node: "C", weight: 10 }]],
	["B", [{ node: "C", weight: 3 }, { node: "D", weight: 8 }]],
	["C", [{ node: "D", weight: 2 }]],
	["D", []],
]);

const weightedMatrix = weightedGraphToAdjacencyMatrix(roadNetwork);
console.log("Road distances matrix:");
for (const [from, distances] of weightedMatrix) {
	for (const [to, distance] of distances) {
		if (distance !== Infinity && distance !== 0) {
			console.log(`${from} -> ${to}: ${distance} km`);
		}
	}
}

// Example 3: Making directed graphs undirected
const directedWeb: Graph<string> = new Map([
	["Page1", ["Page2", "Page3"]],
	["Page2", ["Page3"]],
	["Page3", ["Page1"]],
	["Page4", ["Page1"]],
]);

const undirectedWeb = makeUndirected(directedWeb);
console.log("Undirected web graph:");
for (const [page, links] of undirectedWeb) {
	console.log(`${page} links to: ${links.join(", ")}`);
}

// Example 4: Graph validation and statistics
const validGraph: Graph<string> = new Map([
	["Node1", ["Node2", "Node3"]],
	["Node2", ["Node1", "Node4"]],
	["Node3", ["Node1"]],
	["Node4", ["Node2"]],
]);

const invalidGraph: Graph<string> = new Map([
	["Node1", ["Node2", "Node5"]], // Node5 doesn't exist
	["Node2", ["Node1"]],
]);

console.log("Valid graph check:", validateGraph(validGraph));
console.log("Invalid graph check:", validateGraph(invalidGraph));

// Get statistics
const stats = getGraphStats(validGraph);
console.log("Graph statistics:");
console.log(`Nodes: ${stats.nodeCount}`);
console.log(`Edges: ${stats.edgeCount}`);
console.log(`Average degree: ${stats.averageDegree.toFixed(2)}`);
console.log(`Max degree: ${stats.maxDegree}`);
console.log(`Min degree: ${stats.minDegree}`);
console.log(`Is directed: ${stats.isDirected}`);

// Example 5: Matrix operations for algorithms
const cityGraph: WeightedGraph<string> = new Map([
	["NYC", [{ node: "BOS", weight: 215 }, { node: "PHI", weight: 91 }]],
	["BOS", [{ node: "NYC", weight: 215 }]],
	["PHI", [{ node: "NYC", weight: 91 }, { node: "WDC", weight: 140 }]],
	["WDC", [{ node: "PHI", weight: 140 }]],
]);

// Convert to matrix for Floyd-Warshall or other matrix-based algorithms
const distanceMatrix = weightedGraphToAdjacencyMatrix(cityGraph);
console.log("Distance matrix for Floyd-Warshall:");
for (const [from, distances] of distanceMatrix) {
	const row: string[] = [];
	for (const [to, dist] of distances) {
		row.push(dist === Infinity ? "∞" : dist.toString());
	}
	console.log(`${from}: [${row.join(", ")}]`);
}
