/**
 * Calculate flame graph statistics
 */
export function calculateFlameStatistics(
	frames: Array<{
		id: string;
		level: number;
		value: number;
		width: number;
		height: number;
		children: string[];
	}>,
): {
	structure: {
		totalFrames: number;
		maxDepth: number;
		leafFrames: number;
		internalFrames: number;
		averageBranchingFactor: number;
	};
	performance: {
		totalValue: number;
		averageFrameValue: number;
		maxFrameValue: number;
		minFrameValue: number;
		valueDistribution: { q1: number; median: number; q3: number };
	};
	layout: {
		totalArea: number;
		averageFrameArea: number;
		layoutEfficiency: number;
	};
	hierarchy: {
		framesPerLevel: Array<{ level: number; count: number; totalValue: number }>;
		valueConcentration: {
			topLevelPercentage: number;
			top10FramesPercentage: number;
		};
	};
} {
	const totalFrames = frames.length;
	const maxDepth = Math.max(...frames.map((f) => f.level));
	const leafFrames = frames.filter((f) => f.children.length === 0).length;
	const internalFrames = totalFrames - leafFrames;

	// Calculate branching factor
	const branchingFactors = frames
		.filter((f) => f.children.length > 0)
		.map((f) => f.children.length);

	const averageBranchingFactor =
		branchingFactors.length > 0
			? branchingFactors.reduce((sum, bf) => sum + bf, 0) /
				branchingFactors.length
			: 0;

	// Performance statistics
	const values = frames.map((f) => f.value);
	const totalValue = values.reduce((sum, v) => sum + v, 0);
	const averageFrameValue = totalValue / totalFrames;
	const maxFrameValue = Math.max(...values);
	const minFrameValue = Math.min(...values);

	const sortedValues = [...values].sort((a, b) => a - b);
	const q1 = sortedValues[Math.floor(sortedValues.length / 4)];
	const median = sortedValues[Math.floor(sortedValues.length / 2)];
	const q3 = sortedValues[Math.floor((3 * sortedValues.length) / 4)];

	// Layout statistics
	const totalArea = frames.reduce((sum, f) => sum + f.width * f.height, 0);
	const averageFrameArea = totalArea / totalFrames;

	// Simplified layout efficiency (would need bounds calculation)
	const layoutEfficiency = 0.8; // Placeholder

	// Hierarchy statistics
	const framesPerLevel: Array<{
		level: number;
		count: number;
		totalValue: number;
	}> = [];
	for (let level = 0; level <= maxDepth; level++) {
		const levelFrames = frames.filter((f) => f.level === level);
		const levelValue = levelFrames.reduce((sum, f) => sum + f.value, 0);
		framesPerLevel.push({
			level,
			count: levelFrames.length,
			totalValue: levelValue,
		});
	}

	// Value concentration
	const topLevelValue = framesPerLevel[0]?.totalValue || 0;
	const topLevelPercentage =
		totalValue > 0 ? (topLevelValue / totalValue) * 100 : 0;

	const top10Frames = frames.sort((a, b) => b.value - a.value).slice(0, 10);
	const top10Value = top10Frames.reduce((sum, f) => sum + f.value, 0);
	const top10FramesPercentage =
		totalValue > 0 ? (top10Value / totalValue) * 100 : 0;

	return {
		structure: {
			totalFrames,
			maxDepth,
			leafFrames,
			internalFrames,
			averageBranchingFactor,
		},
		performance: {
			totalValue,
			averageFrameValue,
			maxFrameValue,
			minFrameValue,
			valueDistribution: { q1, median, q3 },
		},
		layout: {
			totalArea,
			averageFrameArea,
			layoutEfficiency,
		},
		hierarchy: {
			framesPerLevel,
			valueConcentration: {
				topLevelPercentage,
				top10FramesPercentage,
			},
		},
	};
}


