import { computed } from "vue";
import type { DiffResult } from "../types/diff";

interface UnifiedDiffOptions {
	title?: string;
	contextLines?: number;
}

export function useUnifiedDiff(
	diff: DiffResult,
	options: UnifiedDiffOptions = {},
) {
	const { title, contextLines: _contextLines = 3 } = options;

	const unifiedDiff = computed(() => {
		const lines: string[] = [];

		// Add header
		if (title) {
			lines.push(`--- ${title}`);
			lines.push("");
		}

		// Process added items
		if (Object.keys(diff.added).length > 0) {
			lines.push("@@ Added @@");
			for (const [key, value] of Object.entries(diff.added)) {
				lines.push(`+${key}: ${formatValue(value)}`);
			}
			lines.push("");
		}

		// Process deleted items
		if (Object.keys(diff.deleted).length > 0) {
			lines.push("@@ Deleted @@");
			for (const [key, value] of Object.entries(diff.deleted)) {
				lines.push(`-${key}: ${formatValue(value)}`);
			}
			lines.push("");
		}

		// Process updated items
		if (Object.keys(diff.updated).length > 0) {
			lines.push("@@ Updated @@");
			for (const [key, value] of Object.entries(diff.updated)) {
				lines.push(` ${key}: ${formatValue(value)} (modified)`);
			}
			lines.push("");
		}

		if (lines.length === 0) {
			return "No changes detected";
		}

		return lines.join("\n");
	});

	return {
		unifiedDiff,
	};
}

function formatValue(value: unknown): string {
	if (value === null) return "null";
	if (value === undefined) return "undefined";
	if (typeof value === "string") return `"${value}"`;
	if (typeof value === "object") {
		try {
			return JSON.stringify(value);
		} catch {
			return String(value);
		}
	}
	return String(value);
}
