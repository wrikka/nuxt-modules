import { processStreamingDiff } from "../../streaming-diff";

export async function apiStreamingExample() {
	console.log("\n=== API Response Streaming Diff ===");

	// Simulate paginated API responses
	async function* fetchAPIPage(
		endpoint: string,
		page: number,
	): AsyncIterable<any[]> {
		const mockAPIResponses: Record<string, any[][]> = {
			"/users": [
				[
					{ id: 1, name: "Alice" },
					{ id: 2, name: "Bob" },
				],
				[
					{ id: 3, name: "Charlie" },
					{ id: 4, name: "Diana" },
				],
				[{ id: 5, name: "Eve" }],
			],
			"/users/backup": [
				[
					{ id: 1, name: "Alice" },
					{ id: 2, name: "Bob" },
				],
				[
					{ id: 3, name: "Charlie" },
					{ id: 6, name: "Frank" },
				], // Different user
				[{ id: 5, name: "Eve" }],
			],
		};

		const pages = mockAPIResponses[endpoint] || [];
		if (page < pages.length) {
			await new Promise((resolve) => setTimeout(resolve, 30)); // Simulate network delay
			yield pages[page];
		}
	}

	// Flatten paginated responses into single streams
	async function* flattenAPIStream(endpoint: string): AsyncIterable<any> {
		let page = 0;
		while (true) {
			let hasData = false;
			for await (const pageData of fetchAPIPage(endpoint, page)) {
				hasData = true;
				for (const item of pageData) {
					yield item;
				}
			}
			if (!hasData) break;
			page++;
		}
	}

	const primaryStream = flattenAPIStream("/users");
	const backupStream = flattenAPIStream("/users/backup");

	console.log("Comparing primary API with backup API...");

	let recordCount = 0;
	let differencesFound = 0;

	for await (const diff of processStreamingDiff(primaryStream, backupStream, {
		bufferSize: 3,
	})) {
		recordCount++;

		const changes =
			Object.keys(diff.added).length +
			Object.keys(diff.deleted).length +
			Object.keys(diff.updated).length;

		if (changes > 0) {
			console.log(`Record set ${recordCount} differences:`);
			Object.entries(diff.added).forEach(([_key, value]) => {
				console.log(`  + New record: ${JSON.stringify(value)}`);
			});
			Object.entries(diff.deleted).forEach(([_key, value]) => {
				console.log(`  - Missing record: ${JSON.stringify(value)}`);
			});
			Object.entries(diff.updated).forEach(([_key, change]) => {
				console.log(`  ~ Updated record: ${JSON.stringify(change)}`);
			});
			differencesFound++;
		}
	}

	console.log(
		`\nAPI comparison complete. Found differences in ${differencesFound} record sets.`,
	);
}













