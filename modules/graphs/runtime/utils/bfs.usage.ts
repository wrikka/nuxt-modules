// Usage examples for BFS (Breadth-First Search)

import { bfs, bfsPath, Graph } from "./bfs";

// Create a graph representing a social network
const socialNetwork: Graph<string> = new Map([
	["Alice", ["Bob", "Charlie"]],
	["Bob", ["David", "Eve"]],
	["Charlie", ["Frank"]],
	["David", []],
	["Eve", []],
	["Frank", []],
]);

// Traverse the entire network starting from Alice
const networkTraversal = bfs(socialNetwork, "Alice");
console.log("Network traversal:", networkTraversal);
// Output: ["Alice", "Bob", "Charlie", "David", "Eve", "Frank"]

// Find path from Alice to David
const pathToDavid = bfsPath(socialNetwork, "Alice", "David");
console.log("Path to David:", pathToDavid);
// Output: ["Alice", "Bob", "David"]

// Find path to someone not connected
const pathToDisconnected = bfsPath(socialNetwork, "Alice", "Grace");
console.log("Path to disconnected person:", pathToDisconnected);
// Output: null
