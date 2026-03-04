/**
 * Calculate collapsible tree statistics
 */
export function calculateCollapsibleTreeStatistics(
	nodes: Array<{
		id: string;
		level: number;
		children: string[];
		value?: number;
		collapsed: boolean;
		visible: boolean;
	}>,
): {
	structure: {
		totalNodes: number;
		visibleNodes: number;
		collapsedNodes: number;
		maxDepth: number;
		leafNodes: number;
		internalNodes: number;
		averageBranchingFactor: number;
	};
	hierarchy: {
		valueDistribution: {
			min: number;
			max: number;
			average: number;
			total: number;
		};
		levelDistribution: Array<{
			level: number;
			total: number;
			visible: number;
			collapsed: number;
		}>;
	};
	interactivity: {
		expandableNodes: number;
		expandedNodes: number;
		collapseRatio: number;
	};
} {
	const totalNodes = nodes.length;
	const visibleNodes = nodes.filter((n) => n.visible).length;
	const collapsedNodes = nodes.filter((n) => n.collapsed).length;
	const maxDepth = Math.max(...nodes.map((n) => n.level));
	const leafNodes = nodes.filter((n) => n.children.length === 0).length;
	const internalNodes = totalNodes - leafNodes;

	const branchingFactors = nodes
		.filter((n) => n.children.length > 0)
		.map((n) => n.children.length);

	const averageBranchingFactor =
		branchingFactors.length > 0
			? branchingFactors.reduce((sum, bf) => sum + bf, 0) /
				branchingFactors.length
			: 0;

	// Value distribution
	const values = nodes.map((n) => n.value || 0).filter((v) => v > 0);
	const minValue = values.length > 0 ? Math.min(...values) : 0;
	const maxValue = values.length > 0 ? Math.max(...values) : 0;
	const averageValue =
		values.length > 0
			? values.reduce((sum, v) => sum + v, 0) / values.length
			: 0;
	const totalValue = values.reduce((sum, v) => sum + v, 0);

	// Level distribution
	const levelDistribution: Array<{
		level: number;
		total: number;
		visible: number;
		collapsed: number;
	}> = [];
	for (let level = 0; level <= maxDepth; level++) {
		const levelNodes = nodes.filter((n) => n.level === level);
		const visible = levelNodes.filter((n) => n.visible).length;
		const collapsed = levelNodes.filter((n) => n.collapsed).length;

		levelDistribution.push({
			level,
			total: levelNodes.length,
			visible,
			collapsed,
		});
	}

	// Interactivity statistics
	const expandableNodes = nodes.filter((n) => n.children.length > 0).length;
	const expandedNodes = nodes.filter(
		(n) => !n.collapsed && n.children.length > 0,
	).length;
	const collapseRatio =
		expandableNodes > 0
			? (expandableNodes - expandedNodes) / expandableNodes
			: 0;

	return {
		structure: {
			totalNodes,
			visibleNodes,
			collapsedNodes,
			maxDepth,
			leafNodes,
			internalNodes,
			averageBranchingFactor,
		},
		hierarchy: {
			valueDistribution: {
				min: minValue,
				max: maxValue,
				average: averageValue,
				total: totalValue,
			},
			levelDistribution,
		},
		interactivity: {
			expandableNodes,
			expandedNodes,
			collapseRatio,
		},
	};
}


