/**
 * Validation Example
 *
 * This example demonstrates how to use validation functions
 * to ensure data integrity before performing diff operations.
 */

import { validateDiff } from "../app/utils/validators/diff-validator";

// Example 1: Basic validation
console.log("=== Example 1: Basic Validation ===");

const dataA = {
	age: 30,
	items: [1, 2, 3],
	name: "John",
};

const dataB = {
	age: 31,
	items: [1, 2, 4],
	name: "Jane",
};

const validationOptions = {
	allowCircularReferences: false,
	maxArrayLength: 100,
	maxDepth: 5,
	maxObjectSize: 50,
	validateTypes: true,
};

const validationResult = validateDiff(validationOptions, dataA, dataB);

console.log("Data A:", dataA);
console.log("Data B:", dataB);
console.log("Validation result:", {
	errorCount: validationResult.errors.length,
	isValid: validationResult.isValid,
	warningCount: validationResult.warnings.length,
});

if (!validationResult.isValid) {
	console.log("Validation errors:", validationResult.errors);
}

if (validationResult.warnings.length > 0) {
	console.log("Validation warnings:", validationResult.warnings);
}

// Example 2: Handling circular references
console.log("\n=== Example 2: Circular Reference Handling ===");

const circularA: any = { name: "Circular A" };
circularA.self = circularA;

const circularB: any = { name: "Circular B" };
circularB.self = circularB;

const circularValidation = validateDiff(
	{ allowCircularReferences: false },
	circularA,
	circularB,
);

console.log("Circular reference validation:", {
	errors: circularValidation.errors.map((error: any) => error.message),
	isValid: circularValidation.isValid,
});

// Allow circular references
const circularValidationAllowed = validateDiff(
	{ allowCircularReferences: true },
	circularA,
	circularB,
);

console.log("Circular reference validation (allowed):", {
	errors: circularValidationAllowed.errors.length,
	isValid: circularValidationAllowed.isValid,
});

// Example 3: Depth validation
console.log("\n=== Example 3: Depth Validation ===");

const deepObject = {
	level1: {
		level2: {
			level3: {
				level4: {
					level5: {
						value: "too deep",
					},
				},
			},
		},
	},
};

const shallowObject = {
	level1: {
		value: "shallow",
	},
};

const depthValidation = validateDiff(
	{ maxDepth: 3 },
	deepObject,
	shallowObject,
);

console.log("Depth validation result:", {
	errors: depthValidation.errors.map((error: any) => error.message),
	isValid: depthValidation.isValid,
});

// Example 4: Size validation
console.log("\n=== Example 4: Size Validation ===");

const largeArray = Array.from({ length: 200 }, (_, i) => ({
	id: i,
	value: `item${i}`,
}));
const smallArray = Array.from({ length: 50 }, (_, i) => ({
	id: i,
	value: `item${i}`,
}));

const sizeValidation = validateDiff(
	{ maxArrayLength: 100 },
	largeArray,
	smallArray,
);

console.log("Size validation result:", {
	errors: sizeValidation.errors.map((error: any) => error.message),
	isValid: sizeValidation.isValid,
});

// Example 5: Type validation
console.log("\n=== Example 5: Type Validation ===");

const typedDataA = {
	active: true,
	age: 30,
	name: "John",
};

const typedDataB = {
	active: "false", // Wrong type - should be boolean
	age: "31", // Wrong type - should be number
	name: "Jane",
};

const typeValidation = validateDiff(
	{ validateTypes: true },
	typedDataA,
	typedDataB,
);

console.log("Type validation result:", {
	isValid: typeValidation.isValid,
	warnings: typeValidation.warnings,
});

// Example 6: Combined validation with diff options
console.log("\n=== Example 6: Combined Validation with Diff Options ===");

const complexDataA = {
	settings: {
		notifications: {
			email: true,
			push: false,
		},
		theme: "dark",
	},
	users: [
		{ id: 1, name: "Alice", roles: ["admin", "user"] },
		{ id: 2, name: "Bob", roles: ["user"] },
	],
};

const complexDataB = {
	settings: {
		notifications: {
			email: true,
			push: true,
		},
		theme: "light",
	},
	users: [
		{ id: 1, name: "Alice Smith", roles: ["admin", "user", "moderator"] },
		{ id: 2, name: "Bob", roles: ["user"] },
		{ id: 3, name: "Charlie", roles: ["user"] },
	],
};

const diffOptions = {
	ignorePaths: ["settings.notifications.push"],
};

const combinedValidation = validateDiff(
	{
		allowCircularReferences: false,
		maxArrayLength: 1000,
		maxDepth: 5,
		maxObjectSize: 100,
		validateTypes: true,
	},
	complexDataA,
	complexDataB,
	diffOptions,
);

console.log("Combined validation result:", {
	errorCount: combinedValidation.errors.length,
	isValid: combinedValidation.isValid,
	warningCount: combinedValidation.warnings.length,
});

if (combinedValidation.errors.length > 0) {
	console.log(
		"Errors:",
		combinedValidation.errors.map((e: any) => e.message),
	);
}

if (combinedValidation.warnings.length > 0) {
	console.log("Warnings:", combinedValidation.warnings);
}
