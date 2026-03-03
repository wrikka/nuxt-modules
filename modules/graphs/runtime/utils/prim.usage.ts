// Usage examples for Prim's MST algorithm

import { prim, primMstToGraph, WeightedGraph } from "./prim";

// Create a weighted graph representing a computer network with connection costs
const networkGraph: WeightedGraph<string> = new Map([
	["Server1", [
		{ node: "Server2", weight: 10 },
		{ node: "Server3", weight: 15 },
		{ node: "Router1", weight: 5 }
	]],
	["Server2", [
		{ node: "Server1", weight: 10 },
		{ node: "Server4", weight: 8 },
		{ node: "Router1", weight: 12 }
	]],
	["Server3", [
		{ node: "Server1", weight: 15 },
		{ node: "Router2", weight: 7 }
	]],
	["Server4", [
		{ node: "Server2", weight: 8 },
		{ node: "Router2", weight: 9 }
	]],
	["Router1", [
		{ node: "Server1", weight: 5 },
		{ node: "Server2", weight: 12 },
		{ node: "Router2", weight: 6 }
	]],
	["Router2", [
		{ node: "Server3", weight: 7 },
		{ node: "Server4", weight: 9 },
		{ node: "Router1", weight: 6 }
	]],
]);

// Find the Minimum Spanning Tree using Prim's algorithm starting from Server1
const { mst, totalWeight } = prim(networkGraph, "Server1");
console.log("Minimum Spanning Tree edges from Server1:");
mst.forEach(edge => {
	console.log(`${edge.from} --(${edge.weight})-- ${edge.to}`);
});
console.log("Total network cost:", totalWeight);

// Convert MST back to graph representation
const mstGraph = primMstToGraph(mst);
console.log("MST network topology:");
for (const [node, connections] of mstGraph) {
	console.log(`${node} connected to: ${connections.map(c => `${c.node}(${c.weight})`).join(", ")}`);
}

// Example starting from different node
const { mst: mstFromRouter, totalWeight: weightFromRouter } = prim(networkGraph, "Router1");
console.log("MST from Router1 has same total weight:", totalWeight === weightFromRouter);

// Example with partially connected graph
const partialGraph: WeightedGraph<string> = new Map([
	["A", [{ node: "B", weight: 1 }, { node: "C", weight: 4 }]],
	["B", [{ node: "A", weight: 1 }, { node: "C", weight: 2 }]],
	["C", [{ node: "A", weight: 4 }, { node: "B", weight: 2 }]],
	["D", [{ node: "E", weight: 3 }]], // Isolated component
	["E", [{ node: "D", weight: 3 }]],
]);

const { mst: partialMst, totalWeight: partialWeight } = prim(partialGraph, "A");
console.log("Partial MST (only connected component):");
partialMst.forEach(edge => {
	console.log(`${edge.from} --(${edge.weight})-- ${edge.to}`);
});
console.log("Partial MST weight:", partialWeight);
// Output: Only connects A-B-C, D-E remains separate
