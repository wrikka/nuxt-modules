import type { TreeMapZoomData } from "../charts/tree-map-zoom";

/**
 * Zoom into treemap node
 */
export function zoomTreeMapToNode(
	treemap: TreeMapZoomData,
	nodeId: string,
): TreeMapZoomData {
	const targetNode = treemap.nodes.find((n) => n.id === nodeId);
	if (!targetNode) return treemap;

	// Update visibility to show only descendants of target node
	const updatedNodes = treemap.nodes.map((node) => {
		if (node.id === nodeId) {
			return { ...node, visible: true };
		}

		// Check if node is descendant of target node
		let isDescendant = false;
		let currentId = node.parent;

		while (currentId) {
			if (currentId === nodeId) {
				isDescendant = true;
				break;
			}
			const parentNode = treemap.nodes.find((n) => n.id === currentId);
			currentId = parentNode?.parent;
		}

		return {
			...node,
			visible: isDescendant || node.id === nodeId,
		};
	});

	// Recalculate layout for visible nodes
	const visibleNodes = updatedNodes.filter((n) => n.visible);
	const relayoutNodes = relayoutVisibleNodes(visibleNodes, treemap.bounds);

	return {
		...treemap,
		nodes: relayoutNodes,
		currentLevel: targetNode.level + 1,
	};
}

/**
 * Relayout visible nodes
 */
function relayoutVisibleNodes(
	visibleNodes: Array<{
		id: string;
		name: string;
		level: number;
		parent?: string;
		children: string[];
		value: number;
		color?: string;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
	}>,
	bounds: { x: number; y: number; width: number; height: number },
): Array<{
	id: string;
	name: string;
	x: number;
	y: number;
	width: number;
	height: number;
	level: number;
	parent?: string;
	children: string[];
	value: number;
	color?: string;
	visible: boolean;
	zoomable: boolean;
}> {
	// Simplified relayout - in practice, would need proper treemap algorithm
	const topLevelNodes = visibleNodes.filter(
		(n) => !n.parent || !visibleNodes.find((p) => p.id === n.parent),
	);

	let currentX = bounds.x;
	const totalValue = topLevelNodes.reduce((sum, n) => sum + n.value, 0);

	return visibleNodes.map((node) => {
		if (topLevelNodes.includes(node)) {
			const ratio = node.value / totalValue;
			const nodeWidth = bounds.width * ratio;

			return {
				...node,
				x: currentX,
				y: bounds.y,
				width: nodeWidth,
				height: bounds.height,
				visible: true,
				zoomable: node.children.length > 0,
			};

			currentX += nodeWidth;
		}

		// Keep other nodes as-is for now
		return {
			...node,
			x: node.x || 0,
			y: node.y || 0,
			width: node.width || 0,
			height: node.height || 0,
			visible: true,
			zoomable: node.children.length > 0,
		};
	});
}

/**
 * Reset treemap zoom
 */
export function resetTreeMapZoom(treemap: TreeMapZoomData): TreeMapZoomData {
	const updatedNodes = treemap.nodes.map((node) => ({
		...node,
		visible: node.level === 0, // Show only root level
		zoomable: node.children.length > 0,
	}));

	return {
		...treemap,
		nodes: updatedNodes,
		currentLevel: 0,
	};
}
