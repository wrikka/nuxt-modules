import {
	createDiffMemoryError,
	createDiffValidationError,
	type DiffMemoryError,
	type DiffProcessingError,
	type DiffValidationError,
} from "../../diff-errors";

// Example 4: Error recovery and retry logic
export async function errorRecoveryExample() {
	console.log("\n=== Error Recovery and Retry Example ===");

	async function performDiffWithRetry(
		_sourceData: any,
		_targetData: any,
		maxRetries: number = 3,
	) {
		let lastError:
			| DiffValidationError
			| DiffProcessingError
			| DiffMemoryError
			| null = null;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				console.log(`Attempt ${attempt}/${maxRetries}...`);

				// Simulate different types of failures based on attempt
				if (attempt === 1) {
					throw createDiffValidationError("Invalid source data format");
				} else if (attempt === 2) {
					throw createDiffMemoryError("Temporary memory pressure");
				} else {
					// Simulate successful processing
					return {
						added: { newItem: "value" },
						deleted: {},
						updated: {},
					};
				}
			} catch (error) {
				lastError = error as
					| DiffValidationError
					| DiffProcessingError
					| DiffMemoryError;
				console.log(`${lastError.name}: ${lastError.message}`);

				// Implement recovery strategies based on error type
				if (lastError.name === "DiffMemoryError") {
					// Wait and retry for memory errors
					console.log("Waiting before retry due to memory error...");
					await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
				} else if (lastError.name === "DiffValidationError") {
					// Don't retry validation errors
					console.log("Validation error - not retrying");
					break;
				}

				if (attempt < maxRetries) {
					console.log("Retrying...");
				}
			}
		}

		if (lastError) {
			throw lastError;
		}
	}

	// Test the retry logic
	performDiffWithRetry({}, {})
		.then((result) => {
			console.log("Diff completed successfully:", result);
		})
		.catch((error) => {
			console.log("Final error after retries:", error.name, error.message);
		});
}













