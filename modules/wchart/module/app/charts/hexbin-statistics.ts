import { calculateHexBins } from './hexbin-layout';

/**
 * Calculate hexbin statistics
 */
export function calculateHexbinStatistics(
	points: Array<{ x: number; y: number; value?: number }>,
	binSize: number,
): {
	totalPoints: number;
	totalBins: number;
	occupiedBins: number;
	averagePointsPerBin: number;
	maxPointsInBin: number;
	minPointsInBin: number;
	binEfficiency: number;
	spatialDistribution: {
		centroid: { x: number; y: number };
		spreadX: number;
		spreadY: number;
		density: number;
	};
	clusters: Array<{
		x: number;
		y: number;
		size: number;
		density: number;
	}>;
} {
	const bins = calculateHexBins(points, binSize);

	const occupiedBins = bins.filter((bin) => bin.count > 0).length;
	const totalPoints = points.length;
	const totalBins = bins.length;
	const binCounts = bins.map((bin) => bin.count);
	const maxPointsInBin = Math.max(...binCounts);
	const minPointsInBin = Math.min(...binCounts);
	const averagePointsPerBin = occupiedBins > 0 ? totalPoints / occupiedBins : 0;

	// Calculate spatial distribution
	const weightedX = bins.reduce((sum, bin) => sum + bin.x * bin.count, 0);
	const weightedY = bins.reduce((sum, bin) => sum + bin.y * bin.count, 0);
	const totalWeight = bins.reduce((sum, bin) => sum + bin.count, 0);

	const centroid =
		totalWeight > 0
			? {
					x: weightedX / totalWeight,
					y: weightedY / totalWeight,
				}
			: { x: 0, y: 0 };

	const varianceX =
		bins.reduce(
			(sum, bin) => sum + bin.count * Math.pow(bin.x - centroid.x, 2),
			0,
		) / totalWeight;
	const varianceY =
		bins.reduce(
			(sum, bin) => sum + bin.count * Math.pow(bin.y - centroid.y, 2),
			0,
		) / totalWeight;

	const spreadX = Math.sqrt(varianceX);
	const spreadY = Math.sqrt(varianceY);

	// Calculate density (points per unit area)
	const hexArea = ((3 * Math.sqrt(3)) / 2) * Math.pow(binSize, 2);
	const totalArea = totalBins * hexArea;
	const density = totalArea > 0 ? totalPoints / totalArea : 0;

	// Bin efficiency (occupied bins / total bins)
	const binEfficiency = totalBins > 0 ? occupiedBins / totalBins : 0;

	// Identify clusters (simplified - high-density bins)
	const clusters = bins
		.filter((bin) => bin.count > averagePointsPerBin * 1.5)
		.map((bin) => ({
			x: bin.x,
			y: bin.y,
			size: bin.count,
			density: bin.count / hexArea,
		}))
		.sort((a, b) => b.size - a.size)
		.slice(0, 10); // Top 10 clusters

	return {
		totalPoints,
		totalBins,
		occupiedBins,
		averagePointsPerBin,
		maxPointsInBin,
		minPointsInBin,
		binEfficiency,
		spatialDistribution: {
			centroid,
			spreadX,
			spreadY,
			density,
		},
		clusters,
	};
}

/**
 * Optimize hexbin parameters
 */
export function optimizeHexbinParameters(
	points: Array<{ x: number; y: number; value?: number }>,
	options: {
		targetBinCount?: number;
		minBinSize?: number;
		maxBinSize?: number;
	} = {},
): {
	optimalBinSize: number;
	estimatedBins: number;
	efficiency: number;
	recommendation: string;
} {
	const { targetBinCount = 50, minBinSize = 5, maxBinSize = 50 } = options;

	// Calculate bounds
	const xValues = points.map((p) => p.x);
	const yValues = points.map((p) => p.y);
	const xRange = Math.max(...xValues) - Math.min(...xValues);
	const yRange = Math.max(...yValues) - Math.min(...yValues);
	const area = xRange * yRange;

	// Test different bin sizes
	let bestBinSize = minBinSize;
	let bestEfficiency = 0;
	let bestBinCount = 0;

	for (let binSize = minBinSize; binSize <= maxBinSize; binSize += 2) {
		const hexArea = ((3 * Math.sqrt(3)) / 2) * Math.pow(binSize, 2);
		const estimatedBins = Math.ceil(area / hexArea);
		const efficiency = Math.max(
			0,
			1 - Math.abs(estimatedBins - targetBinCount) / targetBinCount,
		);

		if (efficiency > bestEfficiency) {
			bestEfficiency = efficiency;
			bestBinSize = binSize;
			bestBinCount = estimatedBins;
		}
	}

	let recommendation = "";
	if (bestEfficiency > 0.8) {
		recommendation = "Good bin size for target count";
	} else if (bestEfficiency > 0.5) {
		recommendation = "Acceptable bin size, consider adjusting target";
	} else {
		recommendation = "Poor fit, consider different bin size range";
	}

	return {
		optimalBinSize: bestBinSize,
		estimatedBins: bestBinCount,
		efficiency: bestEfficiency,
		recommendation,
	};
}


