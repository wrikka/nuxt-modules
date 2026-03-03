import {
	createDiffMemoryError,
	createDiffProcessingError,
	createDiffValidationError,
	type DiffMemoryError,
	type DiffProcessingError,
	type DiffValidationError,
} from "../../diff-errors";

// Example 2: Error handling with context information
export function errorWithContextExample() {
	console.log("\n=== Error Handling with Context Example ===");

	function processDiffData(data: any) {
		// Validation checks
		if (!data || typeof data !== "object") {
			throw createDiffValidationError("Data must be a valid object", {
				receivedType: typeof data,
				receivedValue: data,
			});
		}

		if (!data.source || !data.target) {
			throw createDiffValidationError(
				"Data must contain source and target properties",
				{
					availableKeys: Object.keys(data),
					hasSource: !!data.source,
					hasTarget: !!data.target,
				},
			);
		}

		// Processing simulation
		if (data.source.length > 1000000) {
			throw createDiffMemoryError("Source data too large for processing", {
				maxAllowedSize: 1000000,
				memoryUsage: "High",
				sourceSize: data.source.length,
			});
		}

		// Simulate processing failure
		if (data.operation === "merge" && data.conflictResolution === "none") {
			throw createDiffProcessingError(
				"Cannot merge without conflict resolution strategy",
				{
					conflictResolution: data.conflictResolution,
					operation: data.operation,
					suggestedStrategies: ["overwrite", "merge", "skip"],
				},
			);
		}

		return { processedItems: data.source.length, success: true };
	}

	// Test cases
	const testCases = [
		null, // Invalid type
		{}, // Missing properties
		{ source: "x".repeat(2000000), target: [] }, // Too large
		{
			conflictResolution: "none",
			operation: "merge",
			source: [1, 2, 3],
			target: [4, 5, 6],
		}, // Processing error
		{
			conflictResolution: "overwrite",
			operation: "merge",
			source: [1, 2, 3],
			target: [4, 5, 6],
		}, // Success
	];

	testCases.forEach((testData, index) => {
		try {
			console.log(`\nTest case ${index + 1}:`);
			const result = processDiffData(testData);
			console.log("Success:", result);
		} catch (error) {
			if (error && typeof error === "object" && "name" in error) {
				const diffError = error as
					| DiffValidationError
					| DiffProcessingError
					| DiffMemoryError;
				console.log(`${diffError.name}: ${diffError.message}`);
				if (diffError.context) {
					console.log("Context:", JSON.stringify(diffError.context, null, 2));
				}
			} else {
				console.log("Unexpected error:", error);
			}
		}
	});
}













