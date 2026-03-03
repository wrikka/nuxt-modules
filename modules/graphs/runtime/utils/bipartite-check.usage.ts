// Usage examples for Bipartite Graph Check

import { isBipartiteBFS, isBipartiteDFS, getBipartitePartitions } from "./bipartite-check";
import type { Graph } from "../../types/graph";

// Example 1: Social network analysis (bipartite graphs)
const socialGraph: Graph<string> = new Map([
	["Person1", ["GroupA", "GroupB"]],
	["Person2", ["GroupA", "GroupC"]],
	["Person3", ["GroupB", "GroupC"]],
	["GroupA", ["Person1", "Person2"]],
	["GroupB", ["Person1", "Person3"]],
	["GroupC", ["Person2", "Person3"]],
]);

const bipartiteResult = isBipartiteBFS(socialGraph);
console.log("Social network is bipartite:", bipartiteResult.isBipartite);

if (bipartiteResult.isBipartite) {
	const partitions = getBipartitePartitions(socialGraph, bipartiteResult.colors!);
	console.log("People partition:", partitions.partition0.filter(p => p.startsWith("Person")));
	console.log("Groups partition:", partitions.partition1.filter(g => g.startsWith("Group")));
}

// Example 2: Course scheduling (checking for conflicts)
const courseGraph: Graph<string> = new Map([
	["CS101", ["RoomA", "Time9AM"]],
	["CS102", ["RoomB", "Time10AM"]],
	["CS103", ["RoomA", "Time11AM"]], // Same room different time - OK
	["RoomA", ["CS101", "CS103"]],
	["RoomB", ["CS102"]],
	["Time9AM", ["CS101"]],
	["Time10AM", ["CS102"]],
	["Time11AM", ["CS103"]],
]);

const schedulingResult = isBipartiteDFS(courseGraph);
console.log("Course schedule has no conflicts:", schedulingResult.isBipartite);
// Output: true (courses and resources can be cleanly separated)

// Example 3: Job assignment problem
const jobGraph: Graph<string> = new Map([
	["Worker1", ["TaskA", "TaskB"]],
	["Worker2", ["TaskB", "TaskC"]],
	["Worker3", ["TaskA", "TaskC"]],
	["TaskA", ["Worker1", "Worker3"]],
	["TaskB", ["Worker1", "Worker2"]],
	["TaskC", ["Worker2", "Worker3"]],
]);

console.log("Job assignment is bipartite:", isBipartiteBFS(jobGraph).isBipartite);
// Output: true (workers and tasks can be separated)

// Example 4: Detecting odd cycles in graphs
const graphWithOddCycle: Graph<string> = new Map([
	["A", ["B", "C"]],
	["B", ["A", "C"]], // This creates a triangle
	["C", ["A", "B"]],
]);

console.log("Graph has odd cycle (not bipartite):", !isBipartiteBFS(graphWithOddCycle).isBipartite);
// Output: true

// Example 5: Chessboard coloring validation
const chessboard: Graph<string> = new Map([
	["a1", ["b2", "a3"]], // Black squares
	["b2", ["a1", "c3", "a3", "b4"]],
	["a3", ["a1", "b2", "b4", "a5"]],
	["c3", ["b2", "d4", "b4", "c5"]],
	["b4", ["b2", "a3", "c3", "d4", "a5", "c5"]],
	// ... more squares
]);

// In a proper chessboard, squares should form a bipartite graph
// (black squares connect only to white squares)
console.log("Chessboard is properly colored (bipartite):", isBipartiteDFS(chessboard).isBipartite);
// Output: true (assuming proper chessboard connectivity)

// Example 6: Transportation network (buses and stops)
const transportGraph: Graph<string> = new Map([
	["Bus1", ["StopA", "StopB", "StopC"]],
	["Bus2", ["StopB", "StopC", "StopD"]],
	["Bus3", ["StopA", "StopD"]],
	["StopA", ["Bus1", "Bus3"]],
	["StopB", ["Bus1", "Bus2"]],
	["StopC", ["Bus1", "Bus2"]],
	["StopD", ["Bus2", "Bus3"]],
]);

const transportResult = isBipartiteBFS(transportGraph);
console.log("Transport network is bipartite:", transportResult.isBipartite);

if (transportResult.isBipartite) {
	const partitions = getBipartitePartitions(transportGraph, transportResult.colors!);
	console.log("Bus routes:", partitions.partition0.filter(x => x.startsWith("Bus")));
	console.log("Bus stops:", partitions.partition1.filter(x => x.startsWith("Stop")));
}
