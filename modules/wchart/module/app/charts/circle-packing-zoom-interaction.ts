import type { CirclePackingZoomData } from './circle-packing-zoom-types';

/**
 * Zoom into circle packing node
 */
export function zoomCirclePackingToNode(
	circlePacking: CirclePackingZoomData,
	nodeId: string,
	zoomFactor: number = 2,
): CirclePackingZoomData {
	const targetNode = circlePacking.circles.find((c) => c.id === nodeId);
	if (!targetNode) return circlePacking;

	// Update visibility to show only descendants of target node
	const updatedCircles = circlePacking.circles.map((circle) => {
		if (circle.id === nodeId) {
			return { ...circle, visible: true, r: circle.r * zoomFactor };
		}

		// Check if circle is descendant of target node
		let isDescendant = false;
		let currentId = circle.parent;

		while (currentId) {
			if (currentId === nodeId) {
				isDescendant = true;
				break;
			}
			const parentCircle = circlePacking.circles.find(
				(c) => c.id === currentId,
			);
			currentId = parentCircle?.parent;
		}

		if (isDescendant) {
			return {
				...circle,
				visible: true,
				r: circle.r * Math.sqrt(zoomFactor), // Less zoom for descendants
			};
		} else {
			return {
				...circle,
				visible: false,
			};
		}
	});

	return {
		...circlePacking,
		circles: updatedCircles,
		currentZoomLevel: circlePacking.currentZoomLevel + 1,
		focusedNode: nodeId,
	};
}

/**
 * Reset circle packing zoom
 */
export function resetCirclePackingZoom(
	circlePacking: CirclePackingZoomData,
): CirclePackingZoomData {
	const updatedCircles = circlePacking.circles.map((circle) => ({
		...circle,
		visible: circle.level === 0, // Show only root level
		r:
			circle.level === 0
				? circle.r
				: circle.r / Math.pow(2, circlePacking.currentZoomLevel),
	}));

	return {
		...circlePacking,
		circles: updatedCircles,
		currentZoomLevel: 0,
		focusedNode: undefined,
	};
}

/**
 * Get circle packing zoom node at position
 */
export function getCirclePackingZoomNodeAtPosition(
	circlePacking: CirclePackingZoomData,
	x: number,
	y: number,
): { id: string; name: string } | null {
	// Check visible circles from largest to smallest
	const visibleCircles = circlePacking.circles
		.filter((c) => c.visible)
		.sort((a, b) => b.r - a.r); // Largest first

	for (const circle of visibleCircles) {
		const dx = x - circle.x;
		const dy = y - circle.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance <= circle.r) {
			return { id: circle.id, name: circle.name };
		}
	}

	return null;
}

/**
 * Expand circle packing to show children
 */
export function expandCirclePackingNode(
	circlePacking: CirclePackingZoomData,
	nodeId: string,
): CirclePackingZoomData {
	const targetNode = circlePacking.circles.find((c) => c.id === nodeId);
	if (!targetNode || targetNode.children.length === 0) return circlePacking;

	const updatedCircles = circlePacking.circles.map((circle) => {
		if (circle.parent === nodeId) {
			return { ...circle, visible: true };
		}
		return circle;
	});

	return {
		...circlePacking,
		circles: updatedCircles,
	};
}


