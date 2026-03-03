import { streamingDiff } from "../../streaming-diff";

export async function backwardCompatibilityExample() {
	console.log("\n=== Backward Compatibility Example ===");

	async function* simpleStream(items: number[]): AsyncIterable<number> {
		for (const item of items) {
			await new Promise((resolve) => setTimeout(resolve, 5));
			yield item;
		}
	}

	const streamA = simpleStream([1, 2, 3, 4]);
	const streamB = simpleStream([1, 2, 5, 4]);

	console.log("Using streamingDiff function (backward compatibility)...");

	// Use the legacy streamingDiff function
	const generator = await streamingDiff(streamA, streamB);
	const results: any[] = [];

	for await (const result of generator) {
		results.push(result);
	}

	console.log("Results from streamingDiff:");
	results.forEach((result, index) => {
		console.log(`Result ${index + 1}:`, result);
	});

	console.log("Backward compatibility maintained!");
}













