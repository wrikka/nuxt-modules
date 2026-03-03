// Usage examples for Bellman-Ford algorithm

import { bellmanFord, bellmanFordPath, bellmanFordDistance, WeightedGraph } from "./bellman-ford";

// Create a weighted graph representing currency exchange rates (can have negative weights)
const currencyGraph: WeightedGraph<string> = new Map([
	["USD", [
		{ node: "EUR", weight: 0.85 },
		{ node: "GBP", weight: 0.73 },
		{ node: "JPY", weight: 110.0 }
	]],
	["EUR", [
		{ node: "USD", weight: 1.18 },
		{ node: "GBP", weight: 0.86 },
		{ node: "JPY", weight: 129.0 }
	]],
	["GBP", [
		{ node: "USD", weight: 1.37 },
		{ node: "EUR", weight: 1.16 },
		{ node: "JPY", weight: 150.0 }
	]],
	["JPY", [
		{ node: "USD", weight: 0.0091 },
		{ node: "EUR", weight: 0.0078 },
		{ node: "GBP", weight: 0.0067 }
	]],
]);

// Calculate all shortest paths from USD (representing exchange rates)
const { distances, previous, hasNegativeCycle } = bellmanFord(currencyGraph, "USD");
console.log("Exchange rates from USD:");
console.log("USD to EUR:", distances.get("EUR"));
console.log("USD to GBP:", distances.get("GBP"));
console.log("USD to JPY:", distances.get("JPY"));
console.log("Has negative cycle:", hasNegativeCycle);
// Output: USD to EUR: 0.85, USD to GBP: 0.73, USD to JPY: 110.0, Has negative cycle: false

// Find arbitrage opportunity (negative cycle detection)
const arbitrageGraph: WeightedGraph<string> = new Map([
	["A", [{ node: "B", weight: 0.5 }, { node: "C", weight: 1.0 }]],
	["B", [{ node: "C", weight: 0.5 }, { node: "A", weight: -0.8 }]], // Negative weight creates cycle
	["C", [{ node: "A", weight: 0.5 }]],
]);

const arbitrageResult = bellmanFord(arbitrageGraph, "A");
console.log("Arbitrage opportunity detected:", arbitrageResult.hasNegativeCycle);
// Output: Arbitrage opportunity detected: true

// Find shortest path in graph with negative weights
const negativeWeightGraph: WeightedGraph<string> = new Map([
	["Start", [
		{ node: "A", weight: 5 },
		{ node: "B", weight: 10 }
	]],
	["A", [
		{ node: "C", weight: -3 },
		{ node: "D", weight: 2 }
	]],
	["B", [
		{ node: "C", weight: 1 }
	]],
	["C", [
		{ node: "End", weight: 4 }
	]],
	["D", [
		{ node: "End", weight: 6 }
	]],
	["End", []],
]);

const { path, hasNegativeCycle: hasCycle } = bellmanFordPath(negativeWeightGraph, "Start", "End");
console.log("Path with negative weights:", path);
console.log("Has negative cycle:", hasCycle);
// Output: Path with negative weights: ["Start", "A", "C", "End"], Has negative cycle: false

// Get shortest distance considering negative weights
const { distance } = bellmanFordDistance(negativeWeightGraph, "Start", "End");
console.log("Shortest distance:", distance);
// Output: Shortest distance: 6 (Start->A->C->End = 5 + (-3) + 4 = 6)
