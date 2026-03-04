/**
 * Calculate zoomable sunburst statistics
 */
export function calculateZoomableSunburstStatistics(
	nodes: Array<{
		id: string;
		level: number;
		children: string[];
		value: number;
		innerRadius: number;
		outerRadius: number;
		startAngle: number;
		endAngle: number;
	}>,
): {
	structure: {
		totalNodes: number;
		maxDepth: number;
		leafNodes: number;
		internalNodes: number;
		averageBranchingFactor: number;
	};
	geometry: {
		totalArea: number;
		averageNodeArea: number;
		averageAngle: number;
		radiusRange: { min: number; max: number };
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
			averageRadius: number;
		}>;
	};
	interactivity: {
		zoomLevels: number;
		clickableNodes: number;
		drilldownPaths: number;
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

	// Geometry statistics
	const nodeAreas = nodes.map((n) => {
		const angle = n.endAngle - n.startAngle;
		const innerArea =
			Math.PI * n.innerRadius * n.innerRadius * (angle / (2 * Math.PI));
		const outerArea =
			Math.PI * n.outerRadius * n.outerRadius * (angle / (2 * Math.PI));
		return outerArea - innerArea;
	});

	const totalArea = nodeAreas.reduce((sum, area) => sum + area, 0);
	const averageNodeArea = totalArea / totalNodes;

	const angles = nodes.map((n) => n.endAngle - n.startAngle);
	const averageAngle =
		angles.reduce((sum, angle) => sum + angle, 0) / angles.length;

	const radii = nodes.flatMap((n) => [n.innerRadius, n.outerRadius]);
	const radiusRange = {
		min: Math.min(...radii),
		max: Math.max(...radii),
	};

	// Hierarchy statistics
	const values = nodes.map((n) => n.value);
	const minValue = Math.min(...values);
	const maxValue = Math.max(...values);
	const averageValue = values.reduce((sum, v) => sum + v, 0) / values.length;
	const valueVariance =
		values.reduce((sum, v) => sum + Math.pow(v - averageValue, 2), 0) /
		values.length;
	const valueStd = Math.sqrt(valueVariance);

	const levelDistribution: Array<{
		level: number;
		nodes: number;
		totalValue: number;
		averageRadius: number;
	}> = [];
	for (let level = 0; level <= maxDepth; level++) {
		const levelNodes = nodes.filter((n) => n.level === level);
		const levelValue = levelNodes.reduce((sum, n) => sum + n.value, 0);
		const levelRadii = levelNodes.flatMap((n) => [
			n.innerRadius,
			n.outerRadius,
		]);
		const averageRadius =
			levelRadii.reduce((sum, r) => sum + r, 0) / levelRadii.length;

		levelDistribution.push({
			level,
			nodes: levelNodes.length,
			totalValue: levelValue,
			averageRadius,
		});
	}

	// Interactivity statistics
	const zoomLevels = Math.max(1, maxDepth); // Simplified
	const clickableNodes = internalNodes; // Nodes that can be clicked to zoom
	const drilldownPaths = Math.pow(averageBranchingFactor, maxDepth); // Simplified

	return {
		structure: {
			totalNodes,
			maxDepth,
			leafNodes,
			internalNodes,
			averageBranchingFactor,
		},
		geometry: {
			totalArea,
			averageNodeArea,
			averageAngle,
			radiusRange,
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
		interactivity: {
			zoomLevels,
			clickableNodes,
			drilldownPaths,
		},
	};
}


