// Usage examples for DFS (Depth-First Search)

import { dfs, dfsIterative, dfsPath, Graph } from "./dfs";

// Create a graph representing a file system hierarchy
const fileSystem: Graph<string> = new Map([
	["/", ["home", "usr", "var"]],
	["home", ["user1", "user2"]],
	["usr", ["bin", "lib"]],
	["var", ["log"]],
	["user1", ["documents", "pictures"]],
	["user2", ["music"]],
	["bin", []],
	["lib", []],
	["log", []],
	["documents", []],
	["pictures", []],
	["music", []],
]);

// Traverse the file system recursively (DFS)
const recursiveTraversal = dfs(fileSystem, "/");
console.log("Recursive DFS traversal:", recursiveTraversal);
// Output: ["/", "home", "user1", "documents", "pictures", "user2", "music", "usr", "bin", "lib", "var", "log"]

// Traverse the file system iteratively
const iterativeTraversal = dfsIterative(fileSystem, "/");
console.log("Iterative DFS traversal:", iterativeTraversal);
// Output: ["/", "var", "log", "usr", "lib", "bin", "home", "user2", "music", "user1", "pictures", "documents"]

// Find path from root to a specific file
const pathToDocuments = dfsPath(fileSystem, "/", "documents");
console.log("Path to documents:", pathToDocuments);
// Output: ["/", "home", "user1", "documents"]

// Find path to a non-existent file
const pathToNonExistent = dfsPath(fileSystem, "/", "nonexistent");
console.log("Path to nonexistent file:", pathToNonExistent);
// Output: null
