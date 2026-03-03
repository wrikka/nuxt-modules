// Usage examples for Cycle Detection

import { hasCycleDFS, hasCycleUndirected, hasCycleTopological, Graph } from "./cycle-detection";

// Example 1: Directed graph cycle detection
const taskGraph: Graph<string> = new Map([
	["Task A", ["Task B", "Task C"]],
	["Task B", ["Task D"]],
	["Task C", ["Task D"]],
	["Task D", ["Task E"]],
	["Task E", []],
]);

console.log("Task graph has cycle (DFS):", hasCycleDFS(taskGraph));
// Output: false

const cyclicTaskGraph: Graph<string> = new Map([
	["Task A", ["Task B"]],
	["Task B", ["Task C"]],
	["Task C", ["Task A"]], // Creates cycle
]);

console.log("Cyclic task graph has cycle (DFS):", hasCycleDFS(cyclicTaskGraph));
// Output: true

// Example 2: Undirected graph cycle detection
const networkGraph: Graph<string> = new Map([
	["Router1", ["Router2", "Router3"]],
	["Router2", ["Router1", "Router4"]],
	["Router3", ["Router1", "Router4"]],
	["Router4", ["Router2", "Router3"]], // Creates cycle
]);

console.log("Network has cycle (undirected):", hasCycleUndirected(networkGraph));
// Output: true

const treeNetwork: Graph<string> = new Map([
	["Router1", ["Router2", "Router3"]],
	["Router2", ["Router4"]],
	["Router3", []],
	["Router4", []], // No cycles - it's a tree
]);

console.log("Tree network has cycle (undirected):", hasCycleUndirected(treeNetwork));
// Output: false

// Example 3: Topological sort approach for directed graphs
const dependencyGraph: Graph<string> = new Map([
	["Package A", ["Package B", "Package C"]],
	["Package B", ["Package D"]],
	["Package C", ["Package D"]],
	["Package D", []],
]);

console.log("Dependencies have cycle (topological):", hasCycleTopological(dependencyGraph));
// Output: false

const circularDeps: Graph<string> = new Map([
	["Package A", ["Package B"]],
	["Package B", ["Package C"]],
	["Package C", ["Package A"]], // Circular dependency
]);

console.log("Circular dependencies have cycle (topological):", hasCycleTopological(circularDeps));
// Output: true

// Example 4: Real-world application - deadlock detection
const processGraph: Graph<string> = new Map([
	["Process 1", ["Resource A"]],
	["Process 2", ["Resource B"]],
	["Resource A", ["Process 2"]], // Wait-for relationship
	["Resource B", ["Process 1"]], // Creates deadlock cycle
]);

console.log("System has deadlock:", hasCycleDFS(processGraph));
// Output: true
