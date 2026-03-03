import type { CollapsibleTreeData } from './collapsible-tree-types';

/**
 * Toggle node collapse/expand
 */
export function toggleTreeNode(
	tree: CollapsibleTreeData,
	nodeId: string,
): CollapsibleTreeData {
	const targetNode = tree.nodes.find((n) => n.id === nodeId);
	if (!targetNode) return tree;

	const newCollapsed = !targetNode.collapsed;

	// Update node visibility recursively
	const updatedNodes = tree.nodes.map((node) => {
		if (node.id === nodeId) {
			return { ...node, collapsed: newCollapsed };
		}

		// Check if node is descendant of target node
		let isDescendant = false;
		let currentId = node.parent;

		while (currentId) {
			if (currentId === nodeId) {
				isDescendant = true;
				break;
			}
			const parentNode = tree.nodes.find((n) => n.id === currentId);
			currentId = parentNode?.parent;
		}

		if (isDescendant) {
			return {
				...node,
				visible: !newCollapsed && node.visible,
				collapsed: node.collapsed, // Keep existing collapse state
			};
		}

		return node;
	});

	// Update links visibility
	const updatedLinks = tree.links.map((link) => ({
		...link,
		visible:
			updatedNodes.find((n) => n.id === link.source)?.visible &&
			updatedNodes.find((n) => n.id === link.target)?.visible,
	}));

	return {
		...tree,
		nodes: updatedNodes,
		links: updatedLinks,
	};
}

/**
 * Expand all nodes to specific level
 */
export function expandTreeToLevel(
	tree: CollapsibleTreeData,
	maxLevel: number,
): CollapsibleTreeData {
	const updatedNodes = tree.nodes.map((node) => ({
		...node,
		collapsed: node.level >= maxLevel,
		visible: node.level <= maxLevel,
	}));

	const updatedLinks = tree.links.map((link) => ({
		...link,
		visible:
			updatedNodes.find((n) => n.id === link.source)?.visible &&
			updatedNodes.find((n) => n.id === link.target)?.visible,
	}));

	return {
		...tree,
		nodes: updatedNodes,
		links: updatedLinks,
	};
}

/**
 * Search nodes in collapsible tree
 */
export function searchTreeNodes(
	tree: CollapsibleTreeData,
	query: string,
): Array<{ id: string; name: string; level: number }> {
	const lowercaseQuery = query.toLowerCase();

	return tree.nodes
		.filter((node) => node.name.toLowerCase().includes(lowercaseQuery))
		.map((node) => ({
			id: node.id,
			name: node.name,
			level: node.level,
		}));
}

/**
 * Highlight path to node
 */
export function highlightTreePath(
	tree: CollapsibleTreeData,
	nodeId: string,
): CollapsibleTreeData {
	// Find path from root to node
	const pathIds = new Set<string>();
	let currentId = nodeId;

	while (currentId) {
		pathIds.add(currentId);
		const node = tree.nodes.find((n) => n.id === currentId);
		currentId = node?.parent || "";
	}

	// Update node colors to highlight path
	const updatedNodes = tree.nodes.map((node) => ({
		...node,
		color: pathIds.has(node.id) ? "#ff6b6b" : node.color,
	}));

	// Update link colors
	const updatedLinks = tree.links.map((link) => ({
		...link,
		color:
			pathIds.has(link.source) && pathIds.has(link.target)
				? "#ff6b6b"
				: link.color,
	}));

	return {
		...tree,
		nodes: updatedNodes,
		links: updatedLinks,
	};
}


