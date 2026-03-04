import type { TextDiffLine, TextDiffOptions } from "../../types/text-diff";

export function textDiff(
	text1: string,
	text2: string,
	_options?: TextDiffOptions,
): TextDiffLine[] {
	// Simple implementation - can be enhanced later
	const lines1 = text1.split("\n");
	const lines2 = text2.split("\n");

	const result: TextDiffLine[] = [];
	const maxLength = Math.max(lines1.length, lines2.length);

	for (let i = 0; i < maxLength; i++) {
		const line1 = lines1[i];
		const line2 = lines2[i];

		if (line1 === undefined) {
			result.push({ line: line2!, lineNumber: i, type: "added" });
		} else if (line2 === undefined) {
			result.push({ line: line1, lineNumber: i, type: "removed" });
		} else if (line1 === line2) {
			result.push({ line: line1, lineNumber: i, type: "unchanged" });
		} else {
			result.push({ line: line1, lineNumber: i, type: "removed" });
			result.push({ line: line2, lineNumber: i, type: "added" });
		}
	}

	return result;
}

export function formatTextDiff(diff: TextDiffLine[]): string {
	return diff
		.map((line) => {
			const prefix =
				line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
			return `${prefix}${line.line}`;
		})
		.join("\n");
}













