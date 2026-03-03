import type { Force3DData } from './force3d-types';
import { generateForce3DData } from './force3d';

/**
 * Generate 3D force-directed graph from adjacency matrix
 */
export function generateForce3DFromMatrix(
	nodeNames: string[],
	adjacencyMatrix: number[][],
	options: {
		title?: string;
		threshold?: number;
	} = {},
): Force3DData {
	const { title, threshold = 0 } = options;

	const nodes = nodeNames.map((name) => ({
		id: name,
		name,
		color: undefined,
		size: undefined,
	}));

	const links: Array<{
		source: string;
		target: string;
		value?: number;
	}> = [];

	for (let i = 0; i < adjacencyMatrix.length; i++) {
		for (let j = i + 1; j < adjacencyMatrix[i].length; j++) {
			const value = adjacencyMatrix[i][j];
			if (value > threshold) {
				links.push({
					source: nodeNames[i],
					target: nodeNames[j],
					value,
				});
			}
		}
	}

	return generateForce3DData(nodes, links, { title });
}


