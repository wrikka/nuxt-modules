/**
 * Calculate dendrogram statistics
 */
export function calculateDendrogramStatistics(
	tree: any,
	leafNodes: Array<{ id: string; cluster: number }>,
): {
	height: number;
	clusters: number;
	copheneticCorrelation: number;
	clusterSizes: Array<{ cluster: number; size: number; percentage: number }>;
	clusterSeparation: {
		averageDistance: number;
		minDistance: number;
		maxDistance: number;
	};
} {
	const clusters = [...new Set(leafNodes.map((node) => node.cluster))];
	const height = tree.distance || 0;

	// Calculate cluster sizes
	const clusterSizes = clusters.map((cluster) => {
		const size = leafNodes.filter((node) => node.cluster === cluster).length;
		return {
			cluster,
			size,
			percentage: (size / leafNodes.length) * 100,
		};
	});

	// Simplified cophenetic correlation (would need original distances)
	const copheneticCorrelation = 0.8; // Placeholder

	// Simplified cluster separation
	const clusterSeparation = {
		averageDistance: height / clusters.length,
		minDistance: height / (clusters.length * 2),
		maxDistance: height,
	};

	return {
		height,
		clusters: clusters.length,
		copheneticCorrelation,
		clusterSizes,
		clusterSeparation,
	};
}


