import {
	processStreamingDiff,
	type StreamingDiffOptions,
} from "../../streaming-diff";

export async function chunkedProcessingExample() {
	console.log("\n=== Chunked Processing with Progress ===");

	async function* generateLargeStream(size: number): AsyncIterable<number> {
		for (let i = 0; i < size; i++) {
			await new Promise((resolve) => setTimeout(resolve, 1)); // Simulate async work
			yield i;
		}
	}

	const streamA = generateLargeStream(100);
	const streamB = generateLargeStream(100);

	let processedChunks = 0;
	const totalChunks = Math.ceil(100 / 10); // bufferSize = 10

	const options: StreamingDiffOptions = {
		bufferSize: 10,
		onChunk: (chunk: any) => {
			processedChunks++;
			const changes =
				Object.keys(chunk.added).length +
				Object.keys(chunk.deleted).length +
				Object.keys(chunk.updated).length;
			console.log(
				`Processed chunk ${processedChunks}/${totalChunks}: ${changes} changes`,
			);
		},
	};

	console.log("Processing large streams with chunking...");
	const startTime = Date.now();

	let totalChanges = 0;
	for await (const chunk of processStreamingDiff(streamA, streamB, options)) {
		const changes =
			Object.keys(chunk.added).length +
			Object.keys(chunk.deleted).length +
			Object.keys(chunk.updated).length;
		totalChanges += changes;
	}

	const endTime = Date.now();
	console.log(`\nCompleted in ${endTime - startTime}ms`);
	console.log(`Total changes detected: ${totalChanges}`);
}













