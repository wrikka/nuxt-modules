/**
 * Partition utility functions
 */

/**
 * Calculate partition value
 */
export function calculatePartitionValue(node: any): number {
	if (node.value !== undefined) {
		return node.value;
	}

	if (node.children && node.children.length > 0) {
		return node.children.reduce(
			(sum: number, child: any) => sum + calculatePartitionValue(child),
			0,
		);
	}

	return 1; // Default value
}

/**
 * Determine if should start new row in treemap
 */
export function shouldStartNewRow(
	row: Array<{ child: any; value: number; scaledValue: number }>,
	remainingWidth: number,
	totalHeight: number,
): boolean {
	if (row.length === 0) return false;

	const rowSum = row.reduce((sum, item) => sum + item.scaledValue, 0);
	const rowWidth = rowSum / totalHeight;

	return rowWidth > remainingWidth;
}

/**
 * Calculate partition statistics
 */
export function calculatePartitionStatistics(
	nodes: Array<{
		id: string;
		level: number;
		children: string[];
		value: number;
		width: number;
		height: number;
		x: number;
		y: number;
	}>,
	layout: string,
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
		aspectRatioStats: {
			average: number;
			min: number;
			max: number;
		};
		packingEfficiency: number;
	};
	hierarchy: {
		valueDistribution: {
			min: number;
			max: number;
			average: number;
			std: number;
			giniCoefficient: number;
		};
		levelDistribution: Array<{
			level: number;
			nodes: number;
			totalValue: number;
			averageArea: number;
		}>;
	};
} {
	const totalNodes = nodes.length;
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

	// Layout statistics
	const totalArea = nodes.reduce((sum, n) => sum + n.width * n.height, 0);
	const averageNodeArea = totalArea / totalNodes;

	const aspectRatios = nodes.map((n) => n.width / n.height);
	const averageAspectRatio =
		aspectRatios.reduce((sum, ar) => sum + ar, 0) / aspectRatios.length;
	const minAspectRatio = Math.min(...aspectRatios);
	const maxAspectRatio = Math.max(...aspectRatios);

	// Simplified packing efficiency
	const bounds = {
		x: Math.min(...nodes.map((n) => n.x)),
		y: Math.min(...nodes.map((n) => n.y)),
		width:
			Math.max(...nodes.map((n) => n.x + n.width)) -
			Math.min(...nodes.map((n) => n.x)),
		height:
			Math.max(...nodes.map((n) => n.y + n.height)) -
			Math.min(...nodes.map((n) => n.y)),
	};
	const boundingArea = bounds.width * bounds.height;
	const packingEfficiency = boundingArea > 0 ? totalArea / boundingArea : 0;

	// Value distribution
	const values = nodes.map((n) => n.value);
	const minValue = Math.min(...values);
	const maxValue = Math.max(...values);
	const averageValue = values.reduce((sum, v) => sum + v, 0) / values.length;
	const valueVariance =
		values.reduce((sum, v) => sum + Math.pow(v - averageValue, 2), 0) /
		values.length;
	const valueStd = Math.sqrt(valueVariance);

	// Gini coefficient for value inequality
	const sortedValues = [...values].sort((a, b) => a - b);
	let giniSum = 0;
	sortedValues.forEach((value, i) => {
		giniSum += (2 * (i + 1) - totalNodes - 1) * value;
	});
	const giniCoefficient = giniSum / (totalNodes * totalNodes * averageValue);

	// Level distribution
	const levelDistribution: Array<{
		level: number;
		nodes: number;
		totalValue: number;
		averageArea: number;
	}> = [];
	for (let level = 0; level <= maxDepth; level++) {
		const levelNodes = nodes.filter((n) => n.level === level);
		const levelValue = levelNodes.reduce((sum, n) => sum + n.value, 0);
		const levelArea = levelNodes.reduce(
			(sum, n) => sum + n.width * n.height,
			0,
		);
		const averageArea = levelArea / levelNodes.length;

		levelDistribution.push({
			level,
			nodes: levelNodes.length,
			totalValue: levelValue,
			averageArea,
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
			aspectRatioStats: {
				average: averageAspectRatio,
				min: minAspectRatio,
				max: maxAspectRatio,
			},
			packingEfficiency,
		},
		hierarchy: {
			valueDistribution: {
				min: minValue,
				max: maxValue,
				average: averageValue,
				std: valueStd,
				giniCoefficient,
			},
			levelDistribution,
		},
	};
}
