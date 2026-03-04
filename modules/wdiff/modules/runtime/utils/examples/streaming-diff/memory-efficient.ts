import {
	processStreamingDiff,
	type StreamingDiffOptions,
} from "../../streaming-diff";

export async function memoryEfficientExample() {
	console.log("\n=== Memory-Efficient Large Dataset Processing ===");

	// Simulate processing very large datasets that wouldn't fit in memory
	async function* generateLargeDataset(
		size: number,
	): AsyncIterable<{ id: number; data: string }> {
		for (let i = 0; i < size; i++) {
			await new Promise((resolve) => setTimeout(resolve, 1));
			yield {
				data: `Data for record ${i}`.repeat(10), // Make it larger
				id: i,
			};
		}
	}

	const datasetA = generateLargeDataset(1000);
	const datasetB = generateLargeDataset(1000);

	console.log("Processing large datasets (1000 records each)...");

	const options: StreamingDiffOptions = {
		bufferSize: 50, // Process in small chunks to save memory
		onChunk: (chunk) => {
			const memoryUsage = JSON.stringify(chunk).length;
			console.log(`Processed chunk (${memoryUsage} bytes in memory)`);
		},
	};

	const startTime = Date.now();
	let totalChunks = 0;
	let totalChanges = 0;

	for await (const chunk of processStreamingDiff(datasetA, datasetB, options)) {
		totalChunks++;
		totalChanges +=
			Object.keys(chunk.added).length +
			Object.keys(chunk.deleted).length +
			Object.keys(chunk.updated).length;
	}

	const endTime = Date.now();

	console.log(`\nProcessing complete:`);
	console.log(`- Total chunks: ${totalChunks}`);
	console.log(`- Total changes: ${totalChanges}`);
	console.log(`- Processing time: ${endTime - startTime}ms`);
	console.log(
		`- Memory usage: Minimal (processed in ${options.bufferSize} record chunks)`,
	);
}













