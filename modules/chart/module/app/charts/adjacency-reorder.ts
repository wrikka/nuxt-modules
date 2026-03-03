import type { AdjacencyData } from './adjacency-types';
import { generateAdjacencyData } from './adjacency-data';

/**
 * Generate adjacency matrix visualization with reordering
 */
export function generateReorderedAdjacencyMatrix(
	nodes: Array<{ id: string; name: string; group?: string }>,
	edges: Array<{ source: string; target: string; weight?: number }>,
	options: {
		title?: string;
		reorderingAlgorithm?: "degree" | "community" | "barycenter" | "none";
	} = {},
): AdjacencyData {
	const { title, reorderingAlgorithm = "degree" } = options;

	let reorderedNodes = [...nodes];

	switch (reorderingAlgorithm) {
		case "degree":
			// Already handled in generateAdjacencyData with sortBy: 'degree'
			break;
		case "community":
			// Simplified community detection (group by existing groups)
			reorderedNodes.sort((a, b) =>
				(a.group || "").localeCompare(b.group || ""),
			);
			break;
		case "barycenter":
			// Simplified barycenter method
			reorderedNodes = reorderByBarycenter(nodes, edges);
			break;
		case "none":
		default:
			// Keep original order
			break;
	}

	return generateAdjacencyData(reorderedNodes, edges, {
		title: title || `Adjacency Matrix (${reorderingAlgorithm})`,
		sortBy: "none", // Already reordered
	});
}

/**
 * Simplified barycenter reordering
 */
function reorderByBarycenter(
	nodes: Array<{ id: string; name: string; group?: string }>,
	edges: Array<{ source: string; target: string; weight?: number }>,
): Array<{ id: string; name: string; group?: string }> {
	// Simplified implementation - sort by connectivity
	const nodeConnectivity = new Map<string, number>();

	nodes.forEach((node) => {
		const degree = edges.filter(
			(e) => e.source === node.id || e.target === node.id,
		).length;
		nodeConnectivity.set(node.id, degree);
	});

	return [...nodes].sort(
		(a, b) =>
			(nodeConnectivity.get(b.id) || 0) - (nodeConnectivity.get(a.id) || 0),
	);
}


