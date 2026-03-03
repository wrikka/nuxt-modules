/**
 * Streaming Diff Example
 *
 * This example demonstrates how to use streaming diff for processing
 * large datasets efficiently without loading everything into memory.
 */

import { streamingDiff } from "../app/utils/streaming-diff/core";

// Example 1: Basic streaming diff
console.log("=== Example 1: Basic Streaming Diff ===");

async function* createStreamA() {
	yield { id: 1, name: "Alice", score: 85 };
	yield { id: 2, name: "Bob", score: 92 };
	yield { id: 3, name: "Charlie", score: 78 };
	yield { id: 4, name: "Diana", score: 96 };
}

async function* createStreamB() {
	yield { id: 1, name: "Alice", score: 88 }; // Updated score
	yield { id: 2, name: "Bob", score: 92 }; // Same
	yield { id: 3, name: "Charlie", score: 82 }; // Updated score
	yield { id: 5, name: "Eve", score: 90 }; // New entry
}

async function basicStreamingExample() {
	const generator = await streamingDiff(createStreamA(), createStreamB());

	console.log("Processing streaming diff chunks:");

	let chunkCount = 0;
	for await (const chunk of generator) {
		chunkCount++;
		console.log(`Chunk ${chunkCount}:`, {
			added: Object.keys(chunk.added).length,
			deleted: Object.keys(chunk.deleted).length,
			updated: Object.keys(chunk.updated).length,
		});

		// Show details for the first chunk
		if (chunkCount === 1) {
			console.log("First chunk details:", JSON.stringify(chunk, null, 2));
		}
	}

	console.log(`Total chunks processed: ${chunkCount}`);
}

basicStreamingExample().catch(console.error);

// Example 2: Large dataset streaming with custom buffer size
console.log("\n=== Example 2: Large Dataset with Custom Buffer Size ===");

async function* generateLargeStream(count: number) {
	for (let i = 0; i < count; i++) {
		yield {
			data: `item_${i}`,
			id: i,
			metadata: {
				category: `category_${i % 10}`,
				tags: [`tag_${i % 5}`, `tag_${i % 3}`],
			},
			timestamp: Date.now() + i,
		};
	}
}

async function _largeDatasetExample() {
	const streamSize = 10000;
	const bufferSize = 500;

	console.log(`Processing ${streamSize} items with buffer size ${bufferSize}`);

	const startTime = Date.now();

	const generator = await streamingDiff(
		generateLargeStream(streamSize),
		generateLargeStream(streamSize), // Same stream for this example
		{ bufferSize },
	);

	let totalChunks = 0;
	let totalChanges = 0;

	for await (const chunk of generator) {
		totalChunks++;
		totalChanges +=
			Object.keys(chunk.added).length +
			Object.keys(chunk.deleted).length +
			Object.keys(chunk.updated).length;
	}

	const endTime = Date.now();
	const duration = endTime - startTime;

	console.log(`Processed ${totalChunks} chunks in ${duration}ms`);
	console.log(
		`Average chunk size: ${(streamSize / totalChunks).toFixed(1)} items`,
	);
	console.log(`Total changes detected: ${totalChanges}`);
}

// Uncomment to run the large dataset example
// largeDatasetExample().catch(console.error)

// Example 3: Streaming with progress callback
console.log("\n=== Example 3: Streaming with Progress Callback ===");

async function* createProgressStream(items: number) {
	for (let i = 0; i < items; i++) {
		yield { id: i, value: Math.random() * 100 };
		// Simulate async work
		await new Promise((resolve) => setTimeout(resolve, 1));
	}
}

async function progressCallbackExample() {
	let processedChunks = 0;
	let totalItems = 0;

	const generator = await streamingDiff(
		createProgressStream(1000),
		createProgressStream(1000),
		{
			bufferSize: 100,
			onChunk: (chunk: any) => {
				processedChunks++;
				const changes =
					Object.keys(chunk.added).length +
					Object.keys(chunk.deleted).length +
					Object.keys(chunk.updated).length;
				totalItems += changes;
				console.log(`Progress: Chunk ${processedChunks}, Changes: ${changes}`);
			},
		},
	);

	console.log("Starting streaming diff with progress callback...");

	for await (const _chunk of generator) {
		// Process chunks as they come
	}

	console.log(
		`Completed: ${processedChunks} chunks, ${totalItems} total changes`,
	);
}

progressCallbackExample().catch(console.error);

// Example 4: Real-time data streaming simulation
console.log("\n=== Example 4: Real-time Data Streaming Simulation ===");

interface LogEntry {
	timestamp: number;
	level: "info" | "warn" | "error";
	message: string;
	userId?: string;
}

async function* simulateLogStream(
	interval: number,
	count: number,
): AsyncGenerator<LogEntry> {
	for (let i = 0; i < count; i++) {
		yield {
			level: ["info", "warn", "error"][
				Math.floor(Math.random() * 3)
			] as LogEntry["level"],
			message: `Log message ${i}`,
			timestamp: Date.now(),
			userId:
				Math.random() > 0.5
					? `user_${Math.floor(Math.random() * 100)}`
					: undefined,
		};
		await new Promise((resolve) => setTimeout(resolve, interval));
	}
}

async function _realTimeStreamingExample() {
	console.log("Simulating real-time log diff analysis...");

	const generator = await streamingDiff(
		simulateLogStream(10, 500),
		simulateLogStream(10, 500),
		{ bufferSize: 50 },
	);

	let anomalyCount = 0;

	for await (const chunk of generator) {
		// Simulate anomaly detection
		const errorLogs = Object.values(chunk.added).filter(
			(log: any) => log.level === "error",
		).length;

		if (errorLogs > 5) {
			anomalyCount++;
			console.log(`Anomaly detected in chunk: ${errorLogs} error logs`);
		}
	}

	console.log(`Analysis complete. Detected ${anomalyCount} anomalous chunks.`);
}

// Uncomment to run the real-time example
// realTimeStreamingExample().catch(console.error)
