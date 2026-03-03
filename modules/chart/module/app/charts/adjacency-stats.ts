/**
 * Calculate adjacency matrix statistics
 */
export function calculateAdjacencyStatistics(
	matrix: number[][],
	directed: boolean = false,
): {
	structure: {
		nodes: number;
		edges: number;
		directed: boolean;
		weighted: boolean;
	};
	connectivity: {
		density: number;
		averageDegree: number;
		maxDegree: number;
		minDegree: number;
		components: number;
		diameter: number;
	};
	centrality: {
		degree: Array<{ node: number; centrality: number }>;
		betweenness: Array<{ node: number; centrality: number }>; // Simplified
		closeness: Array<{ node: number; centrality: number }>; // Simplified
	};
	clustering: {
		globalClustering: number;
		averageClustering: number;
		transitivity: number;
	};
} {
	const n = matrix.length;
	const directedGraph = directed;

	// Calculate basic structure
	let edgeCount = 0;
	let weighted = false;
	const degrees: number[] = new Array(n).fill(0);

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			const weight = matrix[i][j];
			if (weight > 0) {
				edgeCount++;
				degrees[i] += weight;

				if (weight !== 1) weighted = true;

				// For undirected graphs, avoid double-counting
				if (!directedGraph && i > j) {
					// Already counted when i < j
				}
			}
		}
	}

	if (!directedGraph) {
		edgeCount = Math.floor(edgeCount / 2);
	}

	// Connectivity metrics
	const maxPossibleEdges = directedGraph ? n * (n - 1) : (n * (n - 1)) / 2;
	const density = maxPossibleEdges > 0 ? edgeCount / maxPossibleEdges : 0;

	const degreeValues = directedGraph ? degrees : degrees.map((d) => d / 2);
	const averageDegree = degreeValues.reduce((sum, d) => sum + d, 0) / n;
	const maxDegree = Math.max(...degreeValues);
	const minDegree = Math.min(...degreeValues);

	// Simplified component counting (DFS)
	const visited = new Set<number>();
	let components = 0;

	const dfs = (node: number) => {
		if (visited.has(node)) return;
		visited.add(node);

		for (let i = 0; i < n; i++) {
			if (matrix[node][i] > 0 || matrix[i][node] > 0) {
				dfs(i);
			}
		}
	};

	for (let i = 0; i < n; i++) {
		if (!visited.has(i)) {
			dfs(i);
			components++;
		}
	}

	// Simplified diameter calculation (Floyd-Warshall approximation)
	let diameter = 0;
	const distances: number[][] = Array(n)
		.fill(0)
		.map(() => Array(n).fill(Infinity));

	// Initialize distances
	for (let i = 0; i < n; i++) {
		distances[i][i] = 0;
		for (let j = 0; j < n; j++) {
			if (matrix[i][j] > 0) {
				distances[i][j] = 1;
			}
		}
	}

	// Floyd-Warshall for shortest paths
	for (let k = 0; k < n; k++) {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (distances[i][k] + distances[k][j] < distances[i][j]) {
					distances[i][j] = distances[i][k] + distances[k][j];
				}
			}
		}
	}

	// Find maximum finite distance
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (distances[i][j] < Infinity && distances[i][j] > diameter) {
				diameter = distances[i][j];
			}
		}
	}

	// Centrality measures
	const degreeCentrality = degreeValues.map((degree, node) => ({
		node,
		centrality: degree / Math.max(...degreeValues),
	}));

	// Simplified betweenness centrality (count of shortest paths passing through node)
	const betweennessCentrality = Array.from({ length: n }, (_, node) => {
		let centrality = 0;

		for (let s = 0; s < n; s++) {
			if (s === node) continue;
			for (let t = 0; t < n; t++) {
				if (t === node || t === s) continue;

				// Count if node is on shortest path from s to t
				if (distances[s][node] + distances[node][t] === distances[s][t]) {
					centrality += 1;
				}
			}
		}

		return {
			node,
			centrality: centrality / (((n - 1) * (n - 2)) / 2), // Normalize
		};
	});

	// Simplified closeness centrality
	const closenessCentrality = Array.from({ length: n }, (_, node) => {
		const totalDistance = distances[node].reduce(
			(sum, dist) => sum + (dist < Infinity ? dist : 0),
			0,
		);
		const reachableNodes = distances[node].filter(
			(dist) => dist < Infinity,
		).length;

		return {
			node,
			centrality: reachableNodes > 1 ? (reachableNodes - 1) / totalDistance : 0,
		};
	});

	// Clustering coefficients (simplified)
	let totalClustering = 0;
	let nodeCount = 0;

	for (let i = 0; i < n; i++) {
		const neighbors: number[] = [];
		for (let j = 0; j < n; j++) {
			if (matrix[i][j] > 0) neighbors.push(j);
		}

		if (neighbors.length >= 2) {
			let triangles = 0;
			const possibleTriangles = (neighbors.length * (neighbors.length - 1)) / 2;

			for (let a = 0; a < neighbors.length; a++) {
				for (let b = a + 1; b < neighbors.length; b++) {
					if (
						matrix[neighbors[a]][neighbors[b]] > 0 ||
						matrix[neighbors[b]][neighbors[a]] > 0
					) {
						triangles++;
					}
				}
			}

			const clustering =
				possibleTriangles > 0 ? triangles / possibleTriangles : 0;
			totalClustering += clustering;
			nodeCount++;
		}
	}

	const averageClustering = nodeCount > 0 ? totalClustering / nodeCount : 0;

	// Global clustering (transitivity)
	let triangles = 0;
	let possibleTriangles = 0;

	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			for (let k = j + 1; k < n; k++) {
				const connected =
					(matrix[i][j] > 0 || matrix[j][i] > 0) &&
					(matrix[i][k] > 0 || matrix[k][i] > 0) &&
					(matrix[j][k] > 0 || matrix[k][j] > 0);

				if (connected) triangles++;

				if (
					(matrix[i][j] > 0 || matrix[j][i] > 0) &&
					(matrix[i][k] > 0 || matrix[k][i] > 0)
				) {
					possibleTriangles++;
				}
			}
		}
	}

	const transitivity =
		possibleTriangles > 0 ? triangles / possibleTriangles : 0;

	return {
		structure: {
			nodes: n,
			edges: edgeCount,
			directed: directedGraph,
			weighted,
		},
		connectivity: {
			density,
			averageDegree,
			maxDegree,
			minDegree,
			components,
			diameter,
		},
		centrality: {
			degree: degreeCentrality,
			betweenness: betweennessCentrality,
			closeness: closenessCentrality,
		},
		clustering: {
			globalClustering: transitivity,
			averageClustering,
			transitivity,
		},
	};
}


