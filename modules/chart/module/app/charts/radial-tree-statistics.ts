/**
 * Calculate radial tree statistics
 */
export function calculateRadialTreeStatistics(
	nodes: Array<{
		id: string;
		level: number;
		children: string[];
		radius: number;
	}>,
): {
	structure: {
		totalNodes: number;
		maxDepth: number;
		averageBranchingFactor: number;
		leafNodes: number;
		internalNodes: number;
	};
	distribution: {
		nodesPerLevel: Array<{ level: number; count: number }>;
		radiusDistribution: { min: number; max: number; average: number };
	};
	balance: {
		minBranchingFactor: number;
		maxBranchingFactor: number;
		variance: number;
	};
} {
	const totalNodes = nodes.length;
	const maxDepth = Math.max(...nodes.map((n) => n.level));
	const leafNodes = nodes.filter((n) => n.children.length === 0).length;
	const internalNodes = totalNodes - leafNodes;

	// Nodes per level
	const nodesPerLevel: Array<{ level: number; count: number }> = [];
	for (let level = 0; level <= maxDepth; level++) {
		const count = nodes.filter((n) => n.level === level).length;
		nodesPerLevel.push({ level, count });
	}

	// Branching factors
	const branchingFactors = nodes
		.filter((n) => n.children.length > 0)
		.map((n) => n.children.length);

	const averageBranchingFactor =
		branchingFactors.length > 0
			? branchingFactors.reduce((sum, bf) => sum + bf, 0) /
				branchingFactors.length
			: 0;

	const minBranchingFactor =
		branchingFactors.length > 0 ? Math.min(...branchingFactors) : 0;
	const maxBranchingFactor =
		branchingFactors.length > 0 ? Math.max(...branchingFactors) : 0;

	const branchingVariance =
		branchingFactors.length > 0
			? branchingFactors.reduce(
					(sum, bf) => sum + Math.pow(bf - averageBranchingFactor, 2),
					0,
				) / branchingFactors.length
			: 0;

	// Radius distribution
	const radii = nodes.map((n) => n.radius);
	const radiusStats = {
		min: Math.min(...radii),
		max: Math.max(...radii),
		average: radii.reduce((sum, r) => sum + r, 0) / radii.length,
	};

	return {
		structure: {
			totalNodes,
			maxDepth,
			averageBranchingFactor,
			leafNodes,
			internalNodes,
		},
		distribution: {
			nodesPerLevel,
			radiusDistribution: radiusStats,
		},
		balance: {
			minBranchingFactor,
			maxBranchingFactor,
			variance: branchingVariance,
		},
	};
}


