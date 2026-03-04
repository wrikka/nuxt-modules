import {
	createDiffMemoryError,
	createDiffProcessingError,
	createDiffValidationError,
	type DiffMemoryError,
	type DiffProcessingError,
	type DiffValidationError,
} from "../../diff-errors";

// Example 1: Basic error creation and handling
export function basicErrorHandlingExample() {
	console.log("=== Basic Error Handling Example ===");

	try {
		// Simulate validation error
		throw createDiffValidationError("Invalid data format provided");
	} catch (error) {
		if (
			error &&
			typeof error === "object" &&
			"name" in error &&
			error.name === "DiffValidationError"
		) {
			const validationError = error as DiffValidationError;
			console.log("Caught validation error:");
			console.log(`Name: ${validationError.name}`);
			console.log(`Message: ${validationError.message}`);
			console.log(`Code: ${validationError.code}`);
		}
	}

	try {
		// Simulate processing error
		throw createDiffProcessingError("Failed to merge diff results");
	} catch (error) {
		if (
			error &&
			typeof error === "object" &&
			"name" in error &&
			error.name === "DiffProcessingError"
		) {
			const processingError = error as DiffProcessingError;
			console.log("\nCaught processing error:");
			console.log(`Name: ${processingError.name}`);
			console.log(`Message: ${processingError.message}`);
			console.log(`Code: ${processingError.code}`);
		}
	}

	try {
		// Simulate memory error
		throw createDiffMemoryError("Insufficient memory for large diff operation");
	} catch (error) {
		if (
			error &&
			typeof error === "object" &&
			"name" in error &&
			error.name === "DiffMemoryError"
		) {
			const memoryError = error as DiffMemoryError;
			console.log("\nCaught memory error:");
			console.log(`Name: ${memoryError.name}`);
			console.log(`Message: ${memoryError.message}`);
			console.log(`Code: ${memoryError.code}`);
		}
	}
}













