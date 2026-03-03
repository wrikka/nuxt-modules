// Usage examples for Union-Find (Disjoint Set)

import { UnionFind, createUnionFind } from "./union-find";

// Example 1: Network connectivity checking
const networkUF = new UnionFind<string>();
networkUF.makeSet("Server1");
networkUF.makeSet("Server2");
networkUF.makeSet("Server3");
networkUF.makeSet("Router1");
networkUF.makeSet("Router2");

// Connect servers through routers
networkUF.union("Server1", "Router1");
networkUF.union("Router1", "Router2");
networkUF.union("Router2", "Server2");

console.log("Server1 and Server2 connected:", networkUF.connected("Server1", "Server2"));
// Output: true

console.log("Server1 and Server3 connected:", networkUF.connected("Server1", "Server3"));
// Output: false

console.log("Network components:", networkUF.getSetCount());
// Output: 2

// Example 2: Kruskal's MST with Union-Find
const cities = ["New York", "Boston", "Washington DC", "Philadelphia"];
const cityUF = createUnionFind(cities);

// Possible cable connections with costs
const connections = [
	{ cities: ["New York", "Boston"], cost: 215 },
	{ cities: ["New York", "Philadelphia"], cost: 91 },
	{ cities: ["Boston", "Washington DC"], cost: 400 },
	{ cities: ["Philadelphia", "Washington DC"], cost: 140 },
];

// Sort by cost and add minimum cost connections
connections.sort((a, b) => a.cost - b.cost);
let totalCost = 0;
const mstConnections: string[] = [];

for (const conn of connections) {
	if (cityUF.union(conn.cities[0], conn.cities[1])) {
		totalCost += conn.cost;
		mstConnections.push(`${conn.cities[0]} -- ${conn.cities[1]} (${conn.cost})`);
	}
}

console.log("MST connections:");
mstConnections.forEach(conn => console.log(conn));
console.log("Total cable cost:", totalCost);
// Output: New York -- Philadelphia (91), Philadelphia -- Washington DC (140), New York -- Boston (215) = 446

// Example 3: Friend circles in social network
const people = ["Alice", "Bob", "Charlie", "David", "Eve"];
const socialUF = createUnionFind(people);

// Friend relationships
socialUF.union("Alice", "Bob");
socialUF.union("Bob", "Charlie");
socialUF.union("David", "Eve");

console.log("Friend circles:", socialUF.getSetCount());
// Output: 2

console.log("Alice's friend circle:", socialUF.getSetElements("Alice").sort());
// Output: ["Alice", "Bob", "Charlie"]

console.log("David's friend circle:", socialUF.getSetElements("David"));
// Output: ["David", "Eve"]

// Example 4: Image processing (connected components in binary image)
const pixels = ["0-0", "0-1", "1-0", "1-1"];
const imageUF = createUnionFind(pixels);

// Connect adjacent pixels (simplified 2x2 image)
imageUF.union("0-0", "0-1"); // Horizontal connection
imageUF.union("0-0", "1-0"); // Vertical connection
imageUF.union("0-1", "1-1"); // Diagonal - would create cycle if added
// imageUF.union("0-1", "1-1"); // Uncomment to connect all pixels

console.log("Connected pixel groups:", imageUF.getSetCount());
console.log("Main component size:", imageUF.getSetSize("0-0"));
// Output: Connected pixel groups: 2 (if diagonal not connected), Main component size: 3
