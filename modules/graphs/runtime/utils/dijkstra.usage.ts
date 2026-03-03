// Usage examples for Dijkstra's algorithm

import { dijkstra, dijkstraPath, dijkstraDistance, WeightedGraph } from "./dijkstra";

// Create a weighted graph representing city distances
const cityGraph: WeightedGraph<string> = new Map([
	["New York", [
		{ node: "Boston", weight: 215 },
		{ node: "Washington DC", weight: 226 },
		{ node: "Philadelphia", weight: 91 }
	]],
	["Boston", [
		{ node: "New York", weight: 215 },
		{ node: "Portland", weight: 110 }
	]],
	["Washington DC", [
		{ node: "New York", weight: 226 },
		{ node: "Richmond", weight: 109 }
	]],
	["Philadelphia", [
		{ node: "New York", weight: 91 },
		{ node: "Washington DC", weight: 140 }
	]],
	["Portland", []],
	["Richmond", []],
]);

// Calculate all shortest distances from New York
const { distances, previous } = dijkstra(cityGraph, "New York");
console.log("Distances from New York:");
console.log("Boston:", distances.get("Boston"));
console.log("Washington DC:", distances.get("Washington DC"));
console.log("Philadelphia:", distances.get("Philadelphia"));
// Output: Boston: 215, Washington DC: 226, Philadelphia: 91

// Find shortest path from New York to Richmond
const pathToRichmond = dijkstraPath(cityGraph, "New York", "Richmond");
console.log("Shortest path to Richmond:", pathToRichmond);
// Output: ["New York", "Washington DC", "Richmond"]

// Get shortest distance from New York to Portland
const distanceToPortland = dijkstraDistance(cityGraph, "New York", "Portland");
console.log("Distance to Portland:", distanceToPortland);
// Output: 325

// Try to find path to disconnected city
const pathToDisconnected = dijkstraPath(cityGraph, "New York", "Seattle");
console.log("Path to Seattle:", pathToDisconnected);
// Output: null
