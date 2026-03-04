import {
	calculateVectorDistance,
	calculateClusterDistance,
	calculateCentroid,
} from './dendrogram-utils';

/**
 * Perform hierarchical clustering
 */
export function performHierarchicalClustering(
	data: Array<{ id: string; name: string; values: number[] }>,
	linkage: "single" | "complete" | "average" | "centroid",
	distanceMetric: "euclidean" | "manhattan" | "cosine",
): {
	tree: any;
	height: number;
} {
	const n = data.length;

	// Create initial clusters (each data point is its own cluster)
	let clusters: Array<{
		id: number;
		items: Array<{ id: string; name: string; values: number[] }>;
		centroid: number[];
	}> = data.map((item, index) => ({
		id: index,
		items: [item],
		centroid: [...item.values],
	}));

	// Distance matrix
	let distances: number[][] = Array(n)
		.fill(0)
		.map(() => Array(n).fill(Infinity));

	// Initialize distance matrix
	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			distances[i][j] = calculateVectorDistance(
				data[i].values,
				data[j].values,
				distanceMetric,
			);
			distances[j][i] = distances[i][j];
		}
	}

	// Clustering process
	const tree: any = {};
	let nextClusterId = n;
	let height = 0;

	while (clusters.length > 1) {
		// Find closest clusters
		let minDistance = Infinity;
		let mergeIndices = [0, 1];

		for (let i = 0; i < clusters.length; i++) {
			for (let j = i + 1; j < clusters.length; j++) {
				const distance = calculateClusterDistance(
					clusters[i],
					clusters[j],
					distances,
					linkage,
				);
				if (distance < minDistance) {
					minDistance = distance;
					mergeIndices = [i, j];
				}
			}
		}

		height = minDistance;

		// Merge clusters
		const [i, j] = mergeIndices;
		const cluster1 = clusters[i];
		const cluster2 = clusters[j];

		const newCluster = {
			id: nextClusterId++,
			items: [...cluster1.items, ...cluster2.items],
			centroid: calculateCentroid([...cluster1.items, ...cluster2.items]),
		};

		// Update tree structure
		const mergeNode = {
			id: newCluster.id,
			name: `Cluster ${newCluster.id}`,
			left: { id: cluster1.id, distance: minDistance },
			right: { id: cluster2.id, distance: minDistance },
			distance: minDistance,
		};

		// Remove old clusters and add new one
		clusters.splice(Math.max(i, j), 1);
		clusters.splice(Math.min(i, j), 1);
		clusters.push(newCluster);

		// Update distance matrix
		const newDistances: number[][] = Array(clusters.length)
			.fill(0)
			.map(() => Array(clusters.length).fill(0));

		for (let x = 0; x < clusters.length - 1; x++) {
			for (let y = x + 1; y < clusters.length; y++) {
				if (x === clusters.length - 1 || y === clusters.length - 1) {
					// Distance to new cluster
					newDistances[x][y] = calculateClusterDistance(
						clusters[x],
						clusters[y],
						distances,
						linkage,
					);
					newDistances[y][x] = newDistances[x][y];
				} else {
					// Copy existing distances
					const oldX = x < Math.min(i, j) ? x : x + 1;
					const oldY = y < Math.min(i, j) ? y : y + 1;
					newDistances[x][y] = distances[oldX][oldY];
					newDistances[y][x] = newDistances[x][y];
				}
			}
		}

		distances = newDistances;

		// Update tree
		if (!tree.root) {
			tree.root = mergeNode;
		} else {
			// This is a simplified tree building - in practice, you'd need a more sophisticated approach
			tree.current = mergeNode;
		}
	}

	// Build final tree structure
	const finalTree = buildTreeStructure(clusters[0], tree);

	return {
		tree: finalTree,
		height,
	};
}

/**
 * Build tree structure from clustering result
 */
function buildTreeStructure(cluster: any, tree: any): any {
	// Simplified tree building
	return {
		id: cluster.id,
		name: `Root`,
		items: cluster.items,
		distance: 0,
	};
}

/**
 * Cut tree at specific height to get clusters
 */
export function cutTreeAtHeight(tree: any, maxClusters: number): number[] {
	// Simplified cluster assignment
	return new Array(tree.items?.length || 0)
		.fill(0)
		.map((_, i) =>
			Math.floor(i / Math.max(1, (tree.items?.length || 1) / maxClusters)),
		);
}


