/**
 * Patch Example
 *
 * This example demonstrates how to use the patch and unpatch functions
 * to apply and reverse differences between objects.
 */

import { diff, patch, unpatch } from "../app/utils/index";

// Example 1: Basic patching
console.log("=== Example 1: Basic Patching ===");

const original = {
	active: true,
	age: 30,
	email: "john@example.com",
	name: "John Doe",
};

const updated = {
	active: true,
	age: 31,
	department: "Engineering",
	email: "jane@example.com",
	name: "Jane Smith",
};

const diffResult = diff(original, updated);
console.log("Original:", original);
console.log("Updated:", updated);
console.log("Diff:", diffResult);

// Apply the patch
const patched = patch(original, diffResult);
console.log("Patched result:", patched);

// Verify the patch worked
console.log(
	"Patch successful:",
	JSON.stringify(patched) === JSON.stringify(updated),
);

// Example 2: Reverse patching (unpatch)
console.log("\n=== Example 2: Reverse Patching (Unpatch) ===");

const unpatched = unpatch(patched, diffResult);
console.log("Unpatched result:", unpatched);
console.log(
	"Unpatch successful:",
	JSON.stringify(unpatched) === JSON.stringify(original),
);

// Example 3: Nested object patching
console.log("\n=== Example 3: Nested Object Patching ===");

const config = {
	database: {
		credentials: {
			password: "secret",
			username: "admin",
		},
		host: "db.example.com",
		port: 5432,
	},
	server: {
		host: "localhost",
		port: 3000,
		ssl: {
			cert: null,
			enabled: false,
		},
	},
};

const newConfig = {
	database: {
		credentials: {
			password: "newsecret",
			username: "admin",
		},
		host: "db.example.com",
		port: 5432,
	},
	server: {
		host: "0.0.0.0",
		port: 8080,
		ssl: {
			cert: "/path/to/cert.pem",
			enabled: true,
		},
	},
};

const configDiff = diff(config, newConfig);
console.log("Config diff:", JSON.stringify(configDiff, null, 2));

const patchedConfig = patch(config, configDiff);
console.log("Patched config:", JSON.stringify(patchedConfig, null, 2));

// Example 4: Array patching
console.log("\n=== Example 4: Array Patching ===");

const todos = [
	{ completed: false, id: 1, text: "Learn TypeScript" },
	{ completed: true, id: 2, text: "Build a diff library" },
	{ completed: false, id: 3, text: "Write tests" },
];

const updatedTodos = [
	{ completed: true, id: 1, text: "Learn TypeScript" },
	{ completed: true, id: 2, text: "Build a diff library" },
	{ completed: false, id: 4, text: "Write documentation" },
];

const todosDiff = diff(todos, updatedTodos);
console.log("Todos diff:", todosDiff);

const patchedTodos = patch(todos, todosDiff);
console.log("Patched todos:", patchedTodos);

// Example 5: Partial patching with options
console.log("\n=== Example 5: Partial Patching ===");

const userProfile = {
	personal: {
		age: 28,
		hobbies: ["reading", "coding"],
		name: "Alice",
	},
	professional: {
		company: "Tech Corp",
		skills: ["JavaScript", "React", "Node.js"],
		title: "Developer",
	},
};

const profileUpdate = {
	personal: {
		age: 29,
		hobbies: ["reading", "coding", "photography"],
		name: "Alice Johnson",
	},
	professional: {
		company: "Tech Corp",
		skills: ["JavaScript", "React", "Node.js", "TypeScript"],
		title: "Senior Developer",
	},
};

// Create diff with options to ignore certain paths
const profileDiff = diff(userProfile, profileUpdate, {
	ignorePaths: ["professional.company"], // Don't diff the company field
});

console.log(
	"Profile diff (ignoring company):",
	JSON.stringify(profileDiff, null, 2),
);

const patchedProfile = patch(userProfile, profileDiff);
console.log("Patched profile:", JSON.stringify(patchedProfile, null, 2));
