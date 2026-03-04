/**
 * Calculate hive plot statistics
 */
export function calculateHiveStatistics(
	axes: Array<{
		name: string;
		values: Array<{ id: string; value: number }>;
	}>,
	links: Array<{
		source: { axis: string; id: string };
		target: { axis: string; id: string };
		value?: number;
	}>,
): {
	structure: {
		axes: number;
		totalNodes: number;
		totalLinks: number;
		averageNodesPerAxis: number;
	};
	connectivity: {
		density: number;
		averageDegree: number;
		components: number;
		clusteringCoefficient: number;
	};
	distribution: {
		valueRange: { min: number; max: number };
		axisCorrelations: Array<{
			axis1: string;
			axis2: string;
			correlation: number;
		}>;
	};
	centrality: {
		betweenness: Array<{ node: string; centrality: number }>;
		closeness: Array<{ node: string; centrality: number }>;
	};
} {
	const totalAxes = axes.length;
	const totalNodes = axes.reduce((sum, axis) => sum + axis.values.length, 0);
	const averageNodesPerAxis = totalNodes / totalAxes;

	// Create node-to-axis mapping
	const nodeAxes = new Map<string, string>();
	axes.forEach((axis) => {
		axis.values.forEach((value) => {
			nodeAxes.set(value.id, axis.name);
		});
	});

	// Calculate connectivity metrics
	const nodeDegrees = new Map<string, number>();
	links.forEach((link) => {
		nodeDegrees.set(link.source.id, (nodeDegrees.get(link.source.id) || 0) + 1);
		nodeDegrees.set(link.target.id, (nodeDegrees.get(link.target.id) || 0) + 1);
	});

	const averageDegree =
		Array.from(nodeDegrees.values()).reduce((sum, deg) => sum + deg, 0) /
		nodeDegrees.size;

	// Calculate density (simplified)
	const maxPossibleLinks = (totalNodes * (totalNodes - 1)) / 2;
	const density = links.length / maxPossibleLinks;

	// Simplified connected components (would need proper graph traversal)
	const components = 1; // Placeholder

	// Simplified clustering coefficient
	const clusteringCoefficient = 0.5; // Placeholder

	// Calculate value ranges
	const allValues = axes.flatMap((axis) => axis.values.map((v) => v.value));
	const valueRange = {
		min: Math.min(...allValues),
		max: Math.max(...allValues),
	};

	// Calculate axis correlations
	const axisCorrelations: Array<{
		axis1: string;
		axis2: string;
		correlation: number;
	}> = [];

	for (let i = 0; i < axes.length; i++) {
		for (let j = i + 1; j < axes.length; j++) {
			const axis1 = axes[i];
			const axis2 = axes[j];

			// Create value maps for correlation calculation
			const axis1Values = new Map(axis1.values.map((v) => [v.id, v.value]));
			const axis2Values = new Map(axis2.values.map((v) => [v.id, v.value]));

			// Get common nodes
			const commonNodes = axis1.values.filter((v) => axis2Values.has(v.id));

			if (commonNodes.length > 1) {
				const values1 = commonNodes.map((v) => axis1Values.get(v.id)!);
				const values2 = commonNodes.map((v) => axis2Values.get(v.id)!);

				const correlation = calculateCorrelation(values1, values2);
				axisCorrelations.push({
					axis1: axis1.name,
					axis2: axis2.name,
					correlation,
				});
			}
		}
	}

	// Simplified centrality measures
	const betweenness = Array.from(nodeDegrees.entries()).map(
		([node, degree]) => ({
			node,
			centrality: degree / (totalNodes - 1),
		}),
	);

	const closeness = Array.from(nodeDegrees.entries()).map(([node, degree]) => ({
		node,
		centrality: 1 / (degree + 1), // Simplified
	}));

	return {
		structure: {
			axes: totalAxes,
			totalNodes,
			totalLinks: links.length,
			averageNodesPerAxis,
		},
		connectivity: {
			density,
			averageDegree,
			components,
			clusteringCoefficient,
		},
		distribution: {
			valueRange,
			axisCorrelations,
		},
		centrality: {
			betweenness,
			closeness,
		},
	};
}

/**
 * Helper function to calculate correlation
 */
function calculateCorrelation(array1: number[], array2: number[]): number {
	if (array1.length !== array2.length || array1.length < 2) return 0;

	const n = array1.length;
	const sum1 = array1.reduce((sum, val) => sum + val, 0);
	const sum2 = array2.reduce((sum, val) => sum + val, 0);
	const sum1Sq = array1.reduce((sum, val) => sum + val * val, 0);
	const sum2Sq = array2.reduce((sum, val) => sum + val * val, 0);
	const sum12 = array1.reduce((sum, val, i) => sum + val * array2[i], 0);

	const numerator = n * sum12 - sum1 * sum2;
	const denominator = Math.sqrt(
		(n * sum1Sq - sum1 * sum1) * (n * sum2Sq - sum2 * sum2),
	);

	return denominator !== 0 ? numerator / denominator : 0;
}


