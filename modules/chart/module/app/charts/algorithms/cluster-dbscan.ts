/**
 * DBSCAN clustering
 */
import { calculateDistance } from "../utils/cluster-utils";

export function dbscanClustering(
	points: Array<{ id: string; x: number; y: number }>,
	distanceMetric: "euclidean" | "manhattan" = "euclidean",
	eps: number = 50,
	minPts: number = 3,
): Array<{
	id: string;
	x: number;
	y: number;
	cluster: number;
}> {
	const visited = new Set<number>();
	const clustered = new Set<number>();
	let clusterId = 0;

	const assignments: number[] = new Array(points.length).fill(-1); // -1 = noise

	const regionQuery = (pointIndex: number): number[] => {
		const neighbors: number[] = [];
		for (let i = 0; i < points.length; i++) {
			if (
				calculateDistance(points[pointIndex], points[i], distanceMetric) <= eps
			) {
				neighbors.push(i);
			}
		}
		return neighbors;
	};

	const expandCluster = (
		pointIndex: number,
		neighbors: number[],
		clusterId: number,
	) => {
		assignments[pointIndex] = clusterId;
		clustered.add(pointIndex);

		for (let i = 0; i < neighbors.length; i++) {
			const neighborIndex = neighbors[i];

			if (!visited.has(neighborIndex)) {
				visited.add(neighborIndex);
				const neighborNeighbors = regionQuery(neighborIndex);

				if (neighborNeighbors.length >= minPts) {
					neighbors.push(
						...neighborNeighbors.filter((n) => !neighbors.includes(n)),
					);
				}
			}

			if (!clustered.has(neighborIndex)) {
				clustered.add(neighborIndex);
				assignments[neighborIndex] = clusterId;
			}
		}
	};

	for (let i = 0; i < points.length; i++) {
		if (visited.has(i)) continue;

		visited.add(i);
		const neighbors = regionQuery(i);

		if (neighbors.length < minPts) {
			// Mark as noise (cluster -1)
			assignments[i] = -1;
		} else {
			clusterId++;
			expandCluster(i, neighbors, clusterId);
		}
	}

	return points.map((point, index) => ({
		id: point.id,
		x: point.x,
		y: point.y,
		cluster: assignments[index],
	}));
}


