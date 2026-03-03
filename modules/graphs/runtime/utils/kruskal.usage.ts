// Usage examples for Kruskal's MST algorithm

import { kruskal, mstToGraph, WeightedGraph } from "./kruskal";

// Create a weighted graph representing a network of cities and cable costs
const networkGraph: WeightedGraph<string> = new Map([
	["New York", [
		{ node: "Boston", weight: 215 },
		{ node: "Philadelphia", weight: 91 },
		{ node: "Washington DC", weight: 226 }
	]],
	["Boston", [
		{ node: "New York", weight: 215 },
		{ node: "Providence", weight: 50 }
	]],
	["Philadelphia", [
		{ node: "New York", weight: 91 },
		{ node: "Washington DC", weight: 140 },
		{ node: "Baltimore", weight: 100 }
	]],
	["Washington DC", [
		{ node: "New York", weight: 226 },
		{ node: "Philadelphia", weight: 140 },
		{ node: "Richmond", weight: 109 }
	]],
	["Providence", [
		{ node: "Boston", weight: 50 }
	]],
	["Baltimore", [
		{ node: "Philadelphia", weight: 100 }
	]],
	["Richmond", [
		{ node: "Washington DC", weight: 109 }
	]],
]);

// Find the Minimum Spanning Tree using Kruskal's algorithm
const { mst, totalWeight } = kruskal(networkGraph);
console.log("Minimum Spanning Tree edges:");
mst.forEach(edge => {
	console.log(`${edge.from} --(${edge.weight})-- ${edge.to}`);
});
console.log("Total cable cost:", totalWeight);
// Output: Total cost will be the minimum cost to connect all cities

// Convert MST back to graph representation for further analysis
const mstGraph = mstToGraph(mst);
console.log("MST as graph:");
for (const [node, edges] of mstGraph) {
	console.log(`${node}: ${edges.map(e => `${e.node}(${e.weight})`).join(", ")}`);
}

// Example with disconnected components
const disconnectedGraph: WeightedGraph<string> = new Map([
	["A", [{ node: "B", weight: 1 }]],
	["B", [{ node: "A", weight: 1 }, { node: "C", weight: 2 }]],
	["C", [{ node: "B", weight: 2 }]],
	["D", [{ node: "E", weight: 3 }]],
	["E", [{ node: "D", weight: 3 }]],
]);

const { mst: forest, totalWeight: forestWeight } = kruskal(disconnectedGraph);
console.log("Forest edges (disconnected MST):");
forest.forEach(edge => {
	console.log(`${edge.from} --(${edge.weight})-- ${edge.to}`);
});
console.log("Total weight for forest:", forestWeight);
// Output: A-B(1), B-C(2), D-E(3) = 6
