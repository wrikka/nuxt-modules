import type { IndentedTreeData } from './indented-tree-types';
import { repositionIndentedTreeLines } from './indented-tree-utils';

/**
 * Toggle indented tree node expansion
 */
export function toggleIndentedTreeNode(
	tree: IndentedTreeData,
	nodeId: string,
): IndentedTreeData {
	const targetLine = tree.lines.find((l) => l.id === nodeId);
	if (!targetLine || targetLine.children.length === 0) return tree;

	const newExpanded = !targetLine.expanded;

	// Update line expansion state
	const updatedLines = tree.lines.map((line) => {
		if (line.id === nodeId) {
			return { ...line, expanded: newExpanded };
		}

		// Check if line is descendant of target node
		let isDescendant = false;
		let currentId = line.parent;

		while (currentId) {
			if (currentId === nodeId) {
				isDescendant = true;
				break;
			}
			const parentLine = tree.lines.find((l) => l.id === currentId);
			currentId = parentLine?.parent;
		}

		if (isDescendant) {
			return {
				...line,
				visible: newExpanded && line.visible,
				expanded: line.expanded, // Keep existing expansion state
			};
		}

		return line;
	});

	// Recalculate positions after visibility changes
	const repositionedLines = repositionIndentedTreeLines(
		updatedLines,
		tree.lines[0].height,
	);

	return {
		...tree,
		lines: repositionedLines,
	};
}

/**
 * Expand indented tree to specific level
 */
export function expandIndentedTreeToLevel(
	tree: IndentedTreeData,
	maxLevel: number,
): IndentedTreeData {
	const updatedLines = tree.lines.map((line) => ({
		...line,
		expanded: line.level < maxLevel && line.children.length > 0,
		visible: line.level <= maxLevel,
	}));

	const repositionedLines = repositionIndentedTreeLines(
		updatedLines,
		tree.lines[0].height,
	);

	return {
		...tree,
		lines: repositionedLines,
	};
}

/**
 * Search in indented tree
 */
export function searchIndentedTree(
	tree: IndentedTreeData,
	query: string,
): Array<{ id: string; text: string; level: number }> {
	const lowercaseQuery = query.toLowerCase();

	return tree.lines
		.filter(
			(line) =>
				line.visible && line.text.toLowerCase().includes(lowercaseQuery),
		)
		.map((line) => ({
			id: line.id,
			text: line.text,
			level: line.level,
		}));
}

/**
 * Get indented tree node at position
 */
export function getIndentedTreeNodeAtPosition(
	tree: IndentedTreeData,
	x: number,
	y: number,
): { id: string; text: string } | null {
	for (const line of tree.lines) {
		if (
			line.visible &&
			x >= line.x &&
			x <= line.x + line.width &&
			y >= line.y &&
			y <= line.y + line.height
		) {
			return { id: line.id, text: line.text };
		}
	}

	return null;
}


