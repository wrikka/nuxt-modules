import { processStreamingDiff } from "../../streaming-diff";

export async function fileComparisonExample() {
	console.log("\n=== File Comparison Streaming ===");

	// Simulate file content streaming
	async function* readFileLines(filename: string): AsyncIterable<string> {
		const fileContents: Record<string, string[]> = {
			"file1.txt": ["line 1", "line 2", "line 3", "line 4", "line 5"],
			"file2.txt": ["line 1", "line 2", "modified line 3", "line 4", "line 6"],
		};

		const lines = fileContents[filename] || [];
		for (const line of lines) {
			await new Promise((resolve) => setTimeout(resolve, 20));
			yield line;
		}
	}

	const file1Stream = readFileLines("file1.txt");
	const file2Stream = readFileLines("file2.txt");

	console.log("Comparing file contents line by line...");

	let lineNumber = 0;
	let totalDifferences = 0;

	for await (const diff of processStreamingDiff(file1Stream, file2Stream, {
		bufferSize: 1, // Process line by line
	})) {
		lineNumber++;

		const addedLines = Object.keys(diff.added);
		const deletedLines = Object.keys(diff.deleted);
		const updatedLines = Object.keys(diff.updated);

		if (
			addedLines.length > 0 ||
			deletedLines.length > 0 ||
			updatedLines.length > 0
		) {
			console.log(`Line ${lineNumber} differences:`);
			addedLines.forEach((key) => {
				console.log(`  + ${diff.added[key]}`);
			});
			deletedLines.forEach((key) => {
				console.log(`  - ${diff.deleted[key]}`);
			});
			updatedLines.forEach((key) => {
				const change = diff.updated[key] as any;
				console.log(`  ~ "${change.old}" → "${change.new}"`);
			});
			totalDifferences++;
		}
	}

	console.log(
		`\nComparison complete. Found differences in ${totalDifferences} lines.`,
	);
}













