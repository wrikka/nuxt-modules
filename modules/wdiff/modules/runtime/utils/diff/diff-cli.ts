#!/usr/bin/env bun

import { parseArgs } from "@wpackages/diff-cli/args";
import { readDirectory, readFileContent } from "@wpackages/diff-cli/file-ops";
import { formatOutput } from "@wpackages/diff-cli/formatters";
import { diff } from "./diff/core";

async function main() {
	const { files, options } = await parseArgs();

	if (files.length !== 2) {
		console.error("Usage: diff <file1> <file2> [options]");
		console.error("Options:");
		console.error("  --format <json|text|html>  Output format (default: text)");
		console.error(
			"  --output <file>             Output file (default: stdout)",
		);
		console.error(
			"  --recursive                 Compare directories recursively",
		);
		console.error(
			"  --ignore <paths>            Comma-separated paths to ignore",
		);
		process.exit(1);
	}

	const [file1, file2] = files;

	// Check if files are directories
	try {
		const _stat1 = await Bun.file(file1).text();
		const _stat2 = await Bun.file(file2).text();

		let content1: string;
		let content2: string;

		if (options.recursive) {
			// Directory comparison
			const files1 = await readDirectory(file1, true);
			const files2 = await readDirectory(file2, true);

			content1 = JSON.stringify(files1.sort());
			content2 = JSON.stringify(files2.sort());
		} else {
			// File comparison
			content1 = await readFileContent(file1);
			content2 = await readFileContent(file2);
		}

		const diffResult = diff(content1, content2, {
			ignorePaths: options.ignorePaths,
		});

		const output = formatOutput(diffResult, options.format || "text");

		if (options.output) {
			await Bun.write(options.output, output);
			console.log(`Diff written to ${options.output}`);
		} else {
			console.log(output);
		}
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

if (import.meta.main) {
	await main();
}













