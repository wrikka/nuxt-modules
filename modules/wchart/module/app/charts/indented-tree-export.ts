import type { IndentedTreeData } from './indented-tree-types';
import { calculateIndentedTreeStatistics } from './indented-tree-statistics';

/**
 * Convert indented tree to text representation
 */
export function indentedTreeToText(tree: IndentedTreeData): string {
	return tree.lines
		.filter((line) => line.visible)
		.map((line) => line.text)
		.join("\n");
}

/**
 * Export indented tree as hierarchical text
 */
export function exportIndentedTreeAsText(tree: IndentedTreeData): string {
	let output = "";

	if (tree.title) {
		output += `${tree.title}\n${"=".repeat(tree.title.length)}\n\n`;
	}

	output += indentedTreeToText(tree);

	// Add statistics
	const stats = calculateIndentedTreeStatistics(tree.lines);
	output += "\n\n--- Statistics ---\n";
	output += `Total lines: ${stats.structure.totalLines}\n`;
	output += `Visible lines: ${stats.structure.visibleLines}\n`;
	output += `Max depth: ${stats.structure.maxDepth}\n`;
	output += `Expansion ratio: ${(stats.interactivity.expansionRatio * 100).toFixed(1)}%\n`;

	return output;
}


