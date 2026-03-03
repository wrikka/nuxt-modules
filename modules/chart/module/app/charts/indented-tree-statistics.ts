/**
 * Calculate indented tree statistics
 */
export function calculateIndentedTreeStatistics(
	lines: Array<{
		id: string;
		level: number;
		children: string[];
		expanded: boolean;
		visible: boolean;
	}>,
): {
	structure: {
		totalLines: number;
		visibleLines: number;
		maxDepth: number;
		leafLines: number;
		internalLines: number;
		averageBranchingFactor: number;
	};
	interactivity: {
		expandableLines: number;
		expandedLines: number;
		collapsedLines: number;
		expansionRatio: number;
	};
	layout: {
		totalHeight: number;
		averageLineLength: number;
		maxLineLength: number;
	};
} {
	const totalLines = lines.length;
	const visibleLines = lines.filter((l) => l.visible).length;
	const maxDepth = Math.max(...lines.map((l) => l.level));
	const leafLines = lines.filter((l) => l.children.length === 0).length;
	const internalLines = totalLines - leafLines;

	const branchingFactors = lines
		.filter((l) => l.children.length > 0)
		.map((l) => l.children.length);

	const averageBranchingFactor =
		branchingFactors.length > 0
			? branchingFactors.reduce((sum, bf) => sum + bf, 0) /
				branchingFactors.length
			: 0;

	const expandableLines = lines.filter((l) => l.children.length > 0).length;
	const expandedLines = lines.filter((l) => l.expanded).length;
	const collapsedLines = expandableLines - expandedLines;
	const expansionRatio =
		expandableLines > 0 ? expandedLines / expandableLines : 0;

	const visibleLineLengths = lines
		.filter((l) => l.visible)
		.map((l) => l.text.length);

	const totalHeight = visibleLines * (lines[0]?.height || 20);
	const averageLineLength =
		visibleLineLengths.length > 0
			? visibleLineLengths.reduce((sum, len) => sum + len, 0) /
				visibleLineLengths.length
			: 0;
	const maxLineLength =
		visibleLineLengths.length > 0 ? Math.max(...visibleLineLengths) : 0;

	return {
		structure: {
			totalLines,
			visibleLines,
			maxDepth,
			leafLines,
			internalLines,
			averageBranchingFactor,
		},
		interactivity: {
			expandableLines,
			expandedLines,
			collapsedLines,
			expansionRatio,
		},
		layout: {
			totalHeight,
			averageLineLength,
			maxLineLength,
		},
	};
}


