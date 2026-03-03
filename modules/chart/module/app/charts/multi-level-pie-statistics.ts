/**
 * Calculate multi-level pie statistics
 */
export function calculateMultiLevelPieStatistics(
	levels: Array<{
		name: string;
		data: Array<{
			name: string;
			value: number;
		}>;
	}>,
): {
	totalLevels: number;
	totalSegments: number;
	totalValue: number;
	averageValuePerLevel: number[];
	levelDistribution: Array<{
		level: number;
		name: string;
		segmentCount: number;
		totalValue: number;
		largestSegment: { name: string; value: number; percentage: number };
		smallestSegment: { name: string; value: number; percentage: number };
		entropy: number; // Measure of evenness
	}>;
	hierarchyDepth: {
		max: number;
		average: number;
		distribution: Array<{ depth: number; count: number }>;
	};
} {
	const totalLevels = levels.length;
	const totalSegments = levels.reduce(
		(sum, level) => sum + level.data.length,
		0,
	);
	const totalValue = levels.reduce(
		(sum, level) =>
			sum + level.data.reduce((levelSum, item) => levelSum + item.value, 0),
		0,
	);

	const averageValuePerLevel = levels.map(
		(level) =>
			level.data.reduce((sum, item) => sum + item.value, 0) / level.data.length,
	);

	const levelDistribution = levels.map((level, index) => {
		const levelTotal = level.data.reduce((sum, item) => sum + item.value, 0);
		const sortedSegments = [...level.data].sort((a, b) => b.value - a.value);

		const largestSegment = sortedSegments[0];
		const smallestSegment = sortedSegments[sortedSegments.length - 1];

		const largestPercentage = largestSegment.value / levelTotal;
		const smallestPercentage = smallestSegment.value / levelTotal;

		// Calculate entropy (Shannon diversity index)
		const proportions = level.data.map((item) => item.value / levelTotal);
		const entropy = -proportions.reduce(
			(sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0),
			0,
		);

		return {
			level: index,
			name: level.name,
			segmentCount: level.data.length,
			totalValue: levelTotal,
			largestSegment: {
				name: largestSegment.name,
				value: largestSegment.value,
				percentage: largestPercentage,
			},
			smallestSegment: {
				name: smallestSegment.name,
				value: smallestSegment.value,
				percentage: smallestPercentage,
			},
			entropy,
		};
	});

	// Calculate hierarchy depth (simplified - assumes all levels are at same depth)
	const hierarchyDepth = {
		max: totalLevels,
		average: totalLevels,
		distribution: [{ depth: totalLevels, count: 1 }],
	};

	return {
		totalLevels,
		totalSegments,
		totalValue,
		averageValuePerLevel,
		levelDistribution,
		hierarchyDepth,
	};
}


