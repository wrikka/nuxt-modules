import { calculateIcicleBounds } from './icicle-layout';

/**
 * Calculate icicle statistics
 */
export function calculateIcicleStatistics(
	nodes: Array<{
		id: string;
		level: number;
		children: string[];
		value: number;
		width: number;
		height: number;
	}>,
): {
	structure: {
		totalNodes: number;
		maxDepth: number;
		leafNodes: number;
		internalNodes: number;
		averageBranchingFactor: number;
	};
	layout: {
		totalArea: number;
		averageNodeArea: number;
		aspectRatio: number;
		packingEfficiency: number;
	};
	hierarchy: {
		valueDistribution: {
			min: number;
			max: number;
			average: number;
			std: number;
		};
		levelDistribution: Array<{
			level: number;
			nodes: number;
			totalValue: number;
		}>;
	};
} {
	const totalNodes = nodes.length;
	const maxDepth = Math.max(...nodes.map((n) => n.level));
	const leafNodes = nodes.filter((n) => n.children.length === 0).length;
	const internalNodes = totalNodes - leafNodes;

	// Calculate branching factor
	const branchingFactors = nodes
		.filter((n) => n.children.length > 0)
		.map((n) => n.children.length);

	const averageBranchingFactor =
		branchingFactors.length > 0
			? branchingFactors.reduce((sum, bf) => sum + bf, 0) /
				branchingFactors.length
			: 0;

	// Layout statistics
	const totalArea = nodes.reduce((sum, n) => sum + n.width * n.height, 0);
	const averageNodeArea = totalArea / totalNodes;
	const aspectRatio = 1; // Placeholder
	const packingEfficiency = 1; // Placeholder

	// Value distribution
	const values = nodes.map((n) => n.value);
	const minValue = Math.min(...values);
	const maxValue = Math.max(...values);
	const averageValue = values.reduce((sum, v) => sum + v, 0) / values.length;
	const valueVariance =
		values.reduce((sum, v) => sum + Math.pow(v - averageValue, 2), 0) /
		values.length;
	const valueStd = Math.sqrt(valueVariance);

	// Level distribution
	const levelDistribution: Array<{
		level: number;
		nodes: number;
		totalValue: number;
	}> = [];
	for (let level = 0; level <= maxDepth; level++) {
		const levelNodes = nodes.filter((n) => n.level === level);
		const levelValue = levelNodes.reduce((sum, n) => sum + n.value, 0);
		levelDistribution.push({
			level,
			nodes: levelNodes.length,
			totalValue: levelValue,
		});
	}

	return {
		structure: {
			totalNodes,
			maxDepth,
			leafNodes,
			internalNodes,
			averageBranchingFactor,
		},
		layout: {
			totalArea,
			averageNodeArea,
			aspectRatio,
			packingEfficiency,
		},
		hierarchy: {
			valueDistribution: {
				min: minValue,
				max: maxValue,
				average: averageValue,
				std: valueStd,
			},
			levelDistribution,
		},
	};
}


