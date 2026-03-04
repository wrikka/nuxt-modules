import { getSeriesColor } from '@/module/app/utils/chart-utils';
import type { PositionedNode3D } from './types';

function buildTreeStructure3D(
	nodes: Array<{ id: string }>,
	edges: Array<{ source: string; target: string }>,
	rootId: string,
): Map<string, string[]> {
	const tree = new Map<string, string[]>();
	const visited = new Set<string>();

	function buildSubtree(nodeId: string) {
		if (visited.has(nodeId)) return;
		visited.add(nodeId);

		const children = edges
			.filter((e) => e.source === nodeId)
			.map((e) => e.target)
			.filter((childId) => !visited.has(childId));

		tree.set(nodeId, children);

		children.forEach((childId) => buildSubtree(childId));
	}

	buildSubtree(rootId);
	return tree;
}

export function positionTreeGraph3D(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
		shape?: "sphere" | "cube" | "cylinder";
	}>,
	edges: Array<{
		source: string;
		target: string;
	}>,
	dimensions: { width: number; height: number; depth: number },
	nodeSize: string,
	colorBy: string,
	nodeDegrees: Map<string, number>,
): PositionedNode3D[] {
	// Find root node (node with no incoming edges)
	const hasIncoming = new Set(edges.map((e) => e.target));
	const rootId = nodes.find((n) => !hasIncoming.has(n.id))?.id || nodes[0]?.id;

	// Build tree structure
	const treeStructure = buildTreeStructure3D(nodes, edges, rootId);

	// Position nodes in tree layout
	const positionedNodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		z: number;
		level: number;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
		shape?: "sphere" | "cube" | "cylinder";
	}> = [];

	function positionTreeNode(
		nodeId: string,
		x: number,
		y: number,
		z: number,
		level: number,
		availableWidth: number,
	): number {
		const node = nodes.find((n) => n.id === nodeId);
		if (!node) return 0;

		const degree = nodeDegrees.get(nodeId) || 0;

		// Determine size
		let size = node.size || 5;
		switch (nodeSize) {
			case "value":
				size = node.value ? Math.max(3, Math.sqrt(node.value) * 2) : 5;
				break;
			case "degree":
				size = Math.max(3, Math.sqrt(degree) * 3);
				break;
		}

		// Determine color
		let color = node.color;
		if (!color) {
			switch (colorBy) {
				case "group":
					color = node.group
						? getSeriesColor(
								node.group.split("").reduce((a, b) => a + b.charCodeAt(0), 0) %
									10,
							)
						: getSeriesColor(0);
					break;
				case "value":
					const intensity = node.value ? Math.min(node.value / 100, 1) : 0.5;
					color = `hsl(${240 - intensity * 240}, 70%, 50%)`;
					break;
				case "degree":
					const degreeIntensity = Math.min(degree / 10, 1);
					color = `hsl(${120 - degreeIntensity * 120}, 70%, 50%)`;
					break;
				case "community":
					color = getSeriesColor(
						Math.abs(
							nodeId.split("").reduce((a, b) => a + b.charCodeAt(0), 0),
						) % 10,
					);
					break;
				default:
					color = getSeriesColor(level);
			}
		}

		positionedNodes.push({
			...node,
			x,
			y,
			z,
			level,
			size,
			color,
		});

		// Position children
		const children = treeStructure.get(nodeId) || [];
		if (children.length > 0) {
			const childWidth = availableWidth / children.length;
			const levelDepth = dimensions.depth / (level + 2);

			children.forEach((childId, index) => {
				const childX = x - availableWidth / 2 + (index + 0.5) * childWidth;
				const childZ = z + levelDepth;
				positionTreeNode(childId, childX, y, childZ, level + 1, childWidth);
			});
		}

		return children.length;
	}

	positionTreeNode(
		rootId,
		dimensions.width / 2,
		dimensions.height / 2,
		0,
		0,
		dimensions.width,
	);

	return positionedNodes.map(({ level, ...node }) => node as PositionedNode3D);
}


