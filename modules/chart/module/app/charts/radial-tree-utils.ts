import type { RadialTreeData } from './radial-tree-types';

/**
 * Prune radial tree to specific depth
 */
export function pruneRadialTree(
	tree: RadialTreeData,
	maxDepth: number,
): RadialTreeData {
	const prunedNodes = tree.nodes.filter((node) => node.level <= maxDepth);
	const nodeIds = new Set(prunedNodes.map((n) => n.id));
	const prunedLinks = tree.links.filter(
		(link) => nodeIds.has(link.source) && nodeIds.has(link.target),
	);

	return {
		...tree,
		nodes: prunedNodes,
		links: prunedLinks,
	};
}


