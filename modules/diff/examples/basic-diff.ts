/**
 * Basic Diff Example
 *
 * This example demonstrates the basic usage of the diff function
 * to calculate differences between two objects.
 */

import { diff } from "@wpackages/diff";

// Example 1: Simple object comparison
console.log("=== Example 1: Simple Object Comparison ===");

const oldUser = {
	age: 30,
	email: "john@example.com",
	name: "John Doe",
};

const newUser = {
	age: 31,
	email: "jane@example.com",
	name: "Jane Doe",
};

const diffResult = diff(oldUser, newUser);

console.log("Old user:", oldUser);
console.log("New user:", newUser);
console.log("Diff result:", diffResult);

/*
Expected output:
{
  added: {},
  deleted: { name: 'John Doe', email: 'john@example.com' },
  updated: { name: 'Jane Doe', age: 31 }
}
*/

// Example 2: Nested object comparison
console.log("\n=== Example 2: Nested Object Comparison ===");

const oldConfig = {
	database: {
		host: "db.example.com",
		port: 5432,
	},
	server: {
		host: "localhost",
		port: 3000,
		ssl: false,
	},
};

const newConfig = {
	database: {
		host: "db.example.com",
		poolSize: 10,
		port: 5432,
	},
	server: {
		host: "0.0.0.0",
		port: 3000,
		ssl: true,
	},
};

const nestedDiffResult = diff(oldConfig, newConfig);

console.log("Old config:", JSON.stringify(oldConfig, null, 2));
console.log("New config:", JSON.stringify(newConfig, null, 2));
console.log("Nested diff result:", JSON.stringify(nestedDiffResult, null, 2));

/*
Expected output:
{
  "added": {
    "database.poolSize": 10,
    "server.ssl": true
  },
  "deleted": {
    "server.ssl": false
  },
  "updated": {
    "server.host": "0.0.0.0"
  }
}
*/

// Example 3: Array comparison
console.log("\n=== Example 3: Array Comparison ===");

const oldArray = [1, 2, 3, 4, 5];
const newArray = [1, 2, "three", 4, 5, 6];

const arrayDiffResult = diff(oldArray, newArray);

console.log("Old array:", oldArray);
console.log("New array:", newArray);
console.log("Array diff result:", arrayDiffResult);

/*
Expected output:
{
  added: { '5': 6, '2': 'three' },
  deleted: { '2': 3 },
  updated: {}
}
*/
