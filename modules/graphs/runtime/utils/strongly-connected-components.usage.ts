// Usage examples for Strongly Connected Components

import { findStronglyConnectedComponents, countStronglyConnectedComponents, isStronglyConnected } from "./strongly-connected-components";
import type { Graph } from "./graph-types";

// Example 1: Web page linking analysis
const webGraph: Graph<string> = new Map([
	["Page A", ["Page B"]],
	["Page B", ["Page C", "Page E"]],
	["Page C", ["Page A", "Page D"]],
	["Page D", ["Page C"]],
	["Page E", ["Page D"]],
	["Page F", ["Page G"]],
	["Page G", ["Page F", "Page H"]],
	["Page H", ["Page I"]],
	["Page I", ["Page H"]],
]);

const sccs = findStronglyConnectedComponents(webGraph);
console.log("Web page strongly connected components:");
sccs.forEach((component, index) => {
	console.log(`SCC ${index + 1}: ${component.join(" ↔ ")}`);
});
// Output: SCC 1: Page A ↔ Page B ↔ Page C
//         SCC 2: Page D
//         SCC 3: Page E
//         SCC 4: Page F ↔ Page G
//         SCC 5: Page H ↔ Page I

// Example 2: Compiler dependency analysis
const moduleGraph: Graph<string> = new Map([
	["Main", ["Utils", "Parser"]],
	["Utils", ["Core"]],
	["Parser", ["Utils", "Lexer"]],
	["Lexer", ["Utils"]],
	["Core", []],
]);

const moduleSCCs = findStronglyConnectedComponents(moduleGraph);
console.log("Module dependency SCCs:");
moduleSCCs.forEach((component, index) => {
	console.log(`Group ${index + 1}: ${component.join(", ")}`);
});
// Output: Group 1: Core
//         Group 2: Utils
//         Group 3: Lexer
//         Group 4: Parser
//         Group 5: Main

console.log("All modules form one SCC?", isStronglyConnected(moduleGraph));
// Output: false

// Example 3: Social network trust relationships
const trustGraph: Graph<string> = new Map([
	["Alice", ["Bob"]],
	["Bob", ["Charlie"]],
	["Charlie", ["Alice"]],
	["David", ["Eve"]],
	["Eve", []],
]);

const trustSCCs = findStronglyConnectedComponents(trustGraph);
console.log("Trust circles:");
trustSCCs.forEach((component, index) => {
	console.log(`Circle ${index + 1}: ${component.join(" trusts ")} (mutual)`);
});
// Output: Circle 1: Alice trusts Bob trusts Charlie trusts Alice (mutual)
//         Circle 2: David
//         Circle 3: Eve

console.log("Number of trust circles:", countStronglyConnectedComponents(trustGraph));
// Output: 3

// Example 4: Circuit analysis (feedback loops)
const circuitGraph: Graph<string> = new Map([
	["Gate1", ["Gate2"]],
	["Gate2", ["Gate3"]],
	["Gate3", ["Gate1", "Gate4"]],
	["Gate4", ["Gate5"]],
	["Gate5", []],
]);

console.log("Circuit has feedback loops:", !isStronglyConnected(circuitGraph));
console.log("Number of independent loops:", countStronglyConnectedComponents(circuitGraph));
// Output: Circuit has feedback loops: true
//         Number of independent loops: 4
