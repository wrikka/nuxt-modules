// Usage examples for Connected Components

import { findConnectedComponents, countConnectedComponents, isConnected, Graph } from "./connected-components";

// Example 1: Social network analysis
const socialNetwork: Graph<string> = new Map([
	["Alice", ["Bob", "Charlie"]],
	["Bob", ["Alice", "Charlie", "David"]],
	["Charlie", ["Alice", "Bob"]],
	["David", ["Bob"]],
	["Eve", ["Frank"]],
	["Frank", ["Eve"]],
	["Grace", []], // Isolated user
]);

const components = findConnectedComponents(socialNetwork);
console.log("Social network communities:");
components.forEach((component, index) => {
	console.log(`Community ${index + 1}: ${component.join(", ")}`);
});
// Output: Community 1: Alice, Bob, Charlie, David
//         Community 2: Eve, Frank
//         Community 3: Grace

const networkComponents = countConnectedComponents(socialNetwork);
console.log("Number of communities:", networkComponents);
// Output: 3

console.log("Is network fully connected?", isConnected(socialNetwork));
// Output: false

// Example 2: Computer network connectivity
const computerNetwork: Graph<string> = new Map([
	["Server1", ["Router1", "Router2"]],
	["Server2", ["Router2"]],
	["Router1", ["Server1", "Router3"]],
	["Router2", ["Server1", "Server2", "Router3"]],
	["Router3", ["Router1", "Router2"]],
	["Server3", ["Router4"]],
	["Router4", ["Server3"]],
]);

const networkComponents2 = findConnectedComponents(computerNetwork);
console.log("Network segments:");
networkComponents2.forEach((component, index) => {
	console.log(`Segment ${index + 1}: ${component.join(", ")}`);
});
// Output: Segment 1: Server1, Router1, Router2, Server2, Router3
//         Segment 2: Server3, Router4

console.log("Network is fully connected?", isConnected(computerNetwork));
// Output: false

// Example 3: Island counting problem
const grid: Graph<string> = new Map([
	["1-1", ["1-2", "2-1"]],
	["1-2", ["1-1", "1-3", "2-2"]],
	["1-3", ["1-2", "2-3"]],
	["2-1", ["1-1", "2-2", "3-1"]],
	["2-2", ["1-2", "2-1", "2-3", "3-2"]],
	["2-3", ["1-3", "2-2", "3-3"]],
	["3-1", ["2-1", "3-2"]],
	["3-2", ["3-1", "2-2", "3-3"]],
	["3-3", ["3-2", "2-3"]],
]);

const islands = countConnectedComponents(grid);
console.log("Number of islands in grid:", islands);
// Output: 1 (all cells are connected)

// Example 4: Checking if a graph is a single connected component
const tree: Graph<string> = new Map([
	["A", ["B", "C"]],
	["B", ["A", "D", "E"]],
	["C", ["A"]],
	["D", ["B"]],
	["E", ["B"]],
]);

console.log("Tree is connected:", isConnected(tree));
// Output: true
