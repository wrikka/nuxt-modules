import { processStreamingDiff } from "../../streaming-diff";

// Example 1: Basic streaming diff
export async function basicStreamingDiffExample() {
	console.log("=== Basic Streaming Diff Example ===");

	// Create async iterables from arrays
	async function* createStream(items: any[]): AsyncIterable<any> {
		for (const item of items) {
			// Simulate streaming delay
			await new Promise((resolve) => setTimeout(resolve, 10));
			yield item;
		}
	}

	const streamA = createStream([1, 2, 3, 4, 5]);
	const streamB = createStream([1, 2, 6, 4, 5]);

	console.log("Comparing streams:");
	console.log("Stream A: [1, 2, 3, 4, 5]");
	console.log("Stream B: [1, 2, 6, 4, 5]");

	let chunkCount = 0;
	for await (const chunk of processStreamingDiff(streamA, streamB)) {
		chunkCount++;
		console.log(`Chunk ${chunkCount}:`);

		if (Object.keys(chunk.added).length > 0) {
			console.log("  Added:", chunk.added);
		}
		if (Object.keys(chunk.deleted).length > 0) {
			console.log("  Deleted:", chunk.deleted);
		}
		if (Object.keys(chunk.updated).length > 0) {
			console.log("  Updated:", chunk.updated);
		}

		if (
			Object.keys(chunk.added).length === 0 &&
			Object.keys(chunk.deleted).length === 0 &&
			Object.keys(chunk.updated).length === 0
		) {
			console.log("  No differences in this chunk");
		}
	}

	console.log(`Processed ${chunkCount} chunks`);
}













