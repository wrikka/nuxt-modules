// Usage examples for Topological Sort

import { topologicalSort, topologicalSortDFS, Graph } from "./topological-sort";

// Create a directed graph representing course prerequisites
const courseGraph: Graph<string> = new Map([
	["CS101", ["CS201", "CS202"]], // Intro to CS required for Data Structures and Algorithms
	["CS201", ["CS301", "CS401"]], // Data Structures required for Advanced Algorithms and Software Engineering
	["CS202", ["CS301"]], // Algorithms required for Advanced Algorithms
	["CS301", ["CS501"]], // Advanced Algorithms required for AI
	["CS401", ["CS501"]], // Software Engineering required for AI
	["CS501", []], // AI has no prerequisites
	["MATH101", ["CS201", "CS202"]], // Math required for Data Structures and Algorithms
]);

// Perform topological sort using Kahn's algorithm (BFS)
const courseOrder = topologicalSort(courseGraph);
if (courseOrder) {
	console.log("Course schedule (BFS topological sort):");
	courseOrder.forEach((course, index) => {
		console.log(`${index + 1}. ${course}`);
	});
} else {
	console.log("Cannot create course schedule - cycle detected!");
}

// Perform topological sort using DFS
const courseOrderDFS = topologicalSortDFS(courseGraph);
if (courseOrderDFS) {
	console.log("Course schedule (DFS topological sort):");
	courseOrderDFS.forEach((course, index) => {
		console.log(`${index + 1}. ${course}`);
	});
} else {
	console.log("Cannot create course schedule - cycle detected!");
}

// Example with cycle (impossible schedule)
const cyclicGraph: Graph<string> = new Map([
	["Task A", ["Task B"]],
	["Task B", ["Task C"]],
	["Task C", ["Task A"]], // Creates cycle
]);

const impossibleOrder = topologicalSort(cyclicGraph);
console.log("Can schedule tasks with cycle?", impossibleOrder !== null);
// Output: false

// Example with build dependencies
const buildGraph: Graph<string> = new Map([
	["utils", ["core", "api"]],
	["core", ["database"]],
	["api", ["core"]],
	["database", []],
	["tests", ["utils", "core", "api", "database"]],
]);

const buildOrder = topologicalSort(buildGraph);
if (buildOrder) {
	console.log("Build order:");
	buildOrder.forEach((module, index) => {
		console.log(`${index + 1}. Build ${module}`);
	});
}
// Output: 1. database, 2. core, 3. utils, 4. api, 5. tests
