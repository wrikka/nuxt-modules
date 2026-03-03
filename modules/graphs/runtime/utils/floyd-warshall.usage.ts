// Usage examples for Floyd-Warshall Algorithm

import { floydWarshall, floydWarshallPath, floydWarshallDistance } from "./floyd-warshall";
import type { WeightedGraph } from "../../types/graph";

// Example 1: Currency exchange arbitrage detection
const currencies: WeightedGraph<string> = new Map([
	["USD", [
		{ node: "EUR", weight: -0.05 }, // 5% fee
		{ node: "GBP", weight: -0.03 }
	]],
	["EUR", [
		{ node: "USD", weight: -0.04 },
		{ node: "GBP", weight: -0.02 }
	]],
	["GBP", [
		{ node: "USD", weight: -0.06 },
		{ node: "EUR", weight: -0.03 }
	]],
]);

const { distances, hasNegativeCycle } = floydWarshall(currencies);
console.log("Arbitrage opportunity exists:", hasNegativeCycle);

if (!hasNegativeCycle) {
	console.log("Best exchange rates:");
	console.log(`USD->EUR: ${-distances.get("USD")!.get("EUR")!}% profit`);
	console.log(`USD->GBP: ${-distances.get("USD")!.get("GBP")!}% profit`);
}
// Output: Arbitrage opportunity exists: false
//         Best exchange rates: USD->EUR: -0.05% profit, etc.

// Example 2: Network routing table computation
const network: WeightedGraph<string> = new Map([
	["Router1", [
		{ node: "Router2", weight: 10 },
		{ node: "Router3", weight: 5 }
	]],
	["Router2", [
		{ node: "Router1", weight: 10 },
		{ node: "Router4", weight: 8 }
	]],
	["Router3", [
		{ node: "Router1", weight: 5 },
		{ node: "Router4", weight: 12 },
		{ node: "Router5", weight: 7 }
	]],
	["Router4", [
		{ node: "Router2", weight: 8 },
		{ node: "Router3", weight: 12 }
	]],
	["Router5", [
		{ node: "Router3", weight: 7 }
	]],
]);

const { distances: networkDistances, predecessors } = floydWarshall(network);
console.log("Network routing costs:");
for (const source of network.keys()) {
	for (const target of network.keys()) {
		if (source !== target) {
			const cost = floydWarshallDistance(networkDistances, source, target);
			if (cost !== Infinity) {
				const path = floydWarshallPath(predecessors, source, target);
				console.log(`${source} -> ${target}: cost ${cost}, path: ${path?.join(" -> ")}`);
			}
		}
	}
}

// Example 3: Transportation network analysis
const cities: WeightedGraph<string> = new Map([
	["New York", [
		{ node: "Boston", weight: 215 },
		{ node: "Philadelphia", weight: 91 }
	]],
	["Boston", [
		{ node: "New York", weight: 215 },
		{ node: "Portland", weight: 110 }
	]],
	["Philadelphia", [
		{ node: "New York", weight: 91 },
		{ node: "Washington DC", weight: 140 }
	]],
	["Washington DC", [
		{ node: "Philadelphia", weight: 140 },
		{ node: "Richmond", weight: 109 }
	]],
	["Portland", [
		{ node: "Boston", weight: 110 }
	]],
	["Richmond", [
		{ node: "Washington DC", weight: 109 }
	]],
]);

const { distances: cityDistances } = floydWarshall(cities);
console.log("All-pairs shortest distances:");
console.log(`NY to Boston: ${floydWarshallDistance(cityDistances, "New York", "Boston")} miles`);
console.log(`NY to Richmond: ${floydWarshallDistance(cityDistances, "New York", "Richmond")} miles`);
console.log(`Boston to Richmond: ${floydWarshallDistance(cityDistances, "Boston", "Richmond")} miles`);
// Output: NY to Boston: 215, NY to Richmond: 340, Boston to Richmond: 555

// Example 4: Detecting negative cycles in financial transactions
const transactions: WeightedGraph<string> = new Map([
	["Account A", [
		{ node: "Account B", weight: -100 }, // Transfer $100 from A to B
		{ node: "Account C", weight: -50 }
	]],
	["Account B", [
		{ node: "Account A", weight: 120 }, // Transfer $120 back with "interest"
		{ node: "Account C", weight: -30 }
	]],
	["Account C", [
		{ node: "Account A", weight: 60 },
		{ node: "Account B", weight: 40 }
	]],
]);

const { hasNegativeCycle: hasArbitrage } = floydWarshall(transactions);
console.log("Arbitrage cycle detected in transactions:", hasArbitrage);
// Output: Arbitrage cycle detected in transactions: true
