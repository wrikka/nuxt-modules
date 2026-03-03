import { processStreamingDiff } from "../../streaming-diff";

export async function realTimeSyncExample() {
	console.log("\n=== Real-time Data Synchronization ===");

	// Simulate real-time data feeds
	async function* userActivityFeed(): AsyncIterable<any> {
		const activities = [
			{ action: "login", timestamp: Date.now(), userId: 1 },
			{ action: "post", timestamp: Date.now(), userId: 2 },
			{ action: "logout", timestamp: Date.now(), userId: 1 },
			{ action: "comment", timestamp: Date.now(), userId: 3 },
		];

		for (const activity of activities) {
			await new Promise((resolve) => setTimeout(resolve, 50));
			yield activity;
		}
	}

	async function* databaseFeed(): AsyncIterable<any> {
		const dbRecords = [
			{ action: "login", timestamp: Date.now(), userId: 1 },
			{ action: "post", timestamp: Date.now(), userId: 2 },
			{ action: "like", timestamp: Date.now(), userId: 4 }, // Different from activity feed
			{ action: "comment", timestamp: Date.now(), userId: 3 },
		];

		for (const record of dbRecords) {
			await new Promise((resolve) => setTimeout(resolve, 50));
			yield record;
		}
	}

	const activityStream = userActivityFeed();
	const dbStream = databaseFeed();

	console.log("Synchronizing activity feed with database...");

	let syncChunk = 0;
	for await (const diff of processStreamingDiff(activityStream, dbStream, {
		bufferSize: 2,
		onChunk: (_chunk: any) => {
			console.log(`Sync chunk ${++syncChunk} processed`);
		},
	})) {
		console.log("Synchronization differences:");

		Object.entries(diff.added).forEach(([_key, value]) => {
			console.log(`  + New activity: ${JSON.stringify(value)}`);
		});

		Object.entries(diff.deleted).forEach(([_key, value]) => {
			console.log(`  - Missing activity: ${JSON.stringify(value)}`);
		});

		Object.entries(diff.updated).forEach(([key, change]) => {
			console.log(`  ~ Changed activity at ${key}: ${JSON.stringify(change)}`);
		});

		if (
			Object.keys(diff.added).length === 0 &&
			Object.keys(diff.deleted).length === 0 &&
			Object.keys(diff.updated).length === 0
		) {
			console.log("  Streams are synchronized for this chunk");
		}
	}

	console.log("Synchronization complete");
}













