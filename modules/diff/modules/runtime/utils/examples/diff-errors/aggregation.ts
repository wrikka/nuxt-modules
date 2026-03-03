// Example 3: Error aggregation and reporting
import {
	createDiffProcessor,
	getErrorSummary,
	processBatch,
} from "./diff-processor-utils";

export function errorAggregationExample() {
	console.log("\n=== Error Aggregation and Reporting Example ===");

	// Test the processor
	const processor = createDiffProcessor();
	const testBatch = [
		{ id: "item1", value: 100 }, // Valid
		{ value: 200 }, // Missing ID
		{ id: "item3", value: "not-a-number" }, // Invalid type
		{ id: "item4", value: 2000000 }, // Too large
		{ id: "item5", value: 50 }, // Valid
	];

	const [updatedProcessor, result] = processBatch(processor, testBatch);

	console.log("Processing result:");
	console.log("Success:", result.success);
	console.log("Processed items:", result.results.length);

	const errorSummary = getErrorSummary(updatedProcessor);
	console.log("\nError summary:");
	console.log(`Total errors: ${errorSummary.total}`);
	console.log(`Validation errors: ${errorSummary.validation}`);
	console.log(`Processing errors: ${errorSummary.processing}`);
	console.log(`Memory errors: ${errorSummary.memory}`);

	if (errorSummary.details.length > 0) {
		console.log("\nError details:");
		errorSummary.details.forEach((detail, index) => {
			console.log(`${index + 1}. ${detail}`);
		});
	}
}













