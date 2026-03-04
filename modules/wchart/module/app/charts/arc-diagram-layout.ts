/**
 * Calculate arc diagram layout
 */
export function calculateArcDiagramLayout(
	nodes: Array<{ id: string; name: string; size?: number }>,
	links: Array<{ source: string; target: string; value?: number }>,
	containerWidth: number,
	containerHeight: number,
	options: {
		nodeSpacing?: number;
		arcHeight?: number;
		labelHeight?: number;
	} = {},
): {
	nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		size: number;
	}>;
	arcs: Array<{
		source: string;
		target: string;
		sourceX: number;
		sourceY: number;
		targetX: number;
		targetY: number;
		midX: number;
		midY: number;
		value?: number;
		width: number;
	}>;
} {
	const { nodeSpacing = 20, arcHeight = 50, labelHeight = 20 } = options;

	const nodeCount = nodes.length;
	const totalWidth = containerWidth - 40; // Padding
	const spacing = Math.min(
		nodeSpacing,
		totalWidth / Math.max(nodeCount - 1, 1),
	);

	// Position nodes along the bottom
	const positionedNodes = nodes.map((node, index) => ({
		id: node.id,
		name: node.name,
		x: 20 + index * spacing,
		y: containerHeight - labelHeight - 10,
		size: node.size || 5,
	}));

	// Create node map for fast lookup
	const nodeMap = new Map(positionedNodes.map((node) => [node.id, node]));

	// Calculate arcs
	const arcs = links
		.map((link) => {
			const sourceNode = nodeMap.get(link.source);
			const targetNode = nodeMap.get(link.target);

			if (!sourceNode || !targetNode) return null;

			const sourceX = sourceNode.x;
			const sourceY = sourceNode.y;
			const targetX = targetNode.x;
			const targetY = targetNode.y;

			// Calculate arc midpoint
			const midX = (sourceX + targetX) / 2;
			const midY = Math.min(sourceY, targetY) - arcHeight;

			return {
				source: link.source,
				target: link.target,
				sourceX,
				sourceY,
				targetX,
				targetY,
				midX,
				midY,
				value: link.value,
				width: Math.max(1, Math.sqrt(link.value || 1)),
			};
		})
		.filter((arc) => arc !== null) as NonNullable<
		ReturnType<(typeof arcs)[number]>
	>[];

	return {
		nodes: positionedNodes,
		arcs,
	};
}


