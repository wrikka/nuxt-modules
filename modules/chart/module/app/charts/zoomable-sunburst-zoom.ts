import type { ZoomableSunburstData } from './zoomable-sunburst-types';

/**
 * Zoom to specific node in sunburst
 */
export function zoomSunburstToNode(
	sunburst: ZoomableSunburstData,
	nodeId: string,
	zoomFactor: number = 2,
): ZoomableSunburstData {
	const targetNode = sunburst.nodes.find((n) => n.id === nodeId);
	if (!targetNode) return sunburst;

	// Calculate new layout centered on target node
	const zoomedNodes = sunburst.nodes.map((node) => {
		if (node.id === nodeId) {
			// Expand target node
			return {
				...node,
				innerRadius: 0,
				outerRadius: sunburst.maxRadius * zoomFactor,
				startAngle: 0,
				endAngle: 2 * Math.PI,
			};
		} else if (node.parent === nodeId) {
			// Adjust child nodes for zoomed view
			const siblingCount = sunburst.nodes.filter(
				(n) => n.parent === nodeId,
			).length;
			const angleSize = (2 * Math.PI) / siblingCount;
			const siblingIndex = sunburst.nodes
				.filter((n) => n.parent === nodeId)
				.indexOf(node);

			return {
				...node,
				innerRadius: sunburst.maxRadius * 0.3,
				outerRadius: sunburst.maxRadius * zoomFactor,
				startAngle: siblingIndex * angleSize,
				endAngle: (siblingIndex + 1) * angleSize,
			};
		} else {
			// Hide other nodes or show as smaller
			return {
				...node,
				innerRadius: node.innerRadius * 0.1,
				outerRadius: node.outerRadius * 0.1,
			};
		}
	});

	return {
		...sunburst,
		nodes: zoomedNodes,
		zoomLevel: sunburst.zoomLevel * zoomFactor,
		focusedNode: nodeId,
	};
}

/**
 * Reset sunburst zoom
 */
export function resetSunburstZoom(
	sunburst: ZoomableSunburstData,
): ZoomableSunburstData {
	// Re-calculate original layout
	const rootNode = sunburst.nodes.find((n) => !n.parent);
	if (!rootNode) return sunburst;

	// This would require re-running the layout calculation
	// For now, return as-is
	return {
		...sunburst,
		zoomLevel: 1,
		focusedNode: rootNode.id,
	};
}


