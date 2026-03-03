import type { PositionedNode3D } from './graph3d-positioning/types';

export function createPositionedEdges(
	edges: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
		width?: number;
		style?: "solid" | "dashed" | "dotted";
	}>,
	nodeMap: Map<string, PositionedNode3D>,
	edgeWidth: string,
): Array<{
	source: string;
	target: string;
	x1: number;
	y1: number;
	z1: number;
	x2: number;
	y2: number;
	z2: number;
	value?: number;
	color: string;
	width: number;
	style: "solid" | "dashed" | "dotted";
}> {
	return edges.map((edge) => {
		const sourceNode = nodeMap.get(edge.source);
		const targetNode = nodeMap.get(edge.target);

		if (!sourceNode || !targetNode) {
			throw new Error(
				`Edge references non-existent node: ${edge.source} -> ${edge.target}`,
			);
		}

		let width = 1;
		switch (edgeWidth) {
			case "value":
				width = Math.max(1, Math.sqrt(edge.value || 1));
				break;
			case "fixed":
			default:
				width = edge.width || 1;
		}

		return {
			source: edge.source,
			target: edge.target,
			x1: sourceNode.x,
			y1: sourceNode.y,
			z1: sourceNode.z,
			x2: targetNode.x,
			y2: targetNode.y,
			z2: targetNode.z,
			value: edge.value,
			color: edge.color || "#999",
			width,
			style: edge.style || "solid",
		};
	});
}

export function calculateBounds(nodes: PositionedNode3D[]): {
	x: { min: number; max: number };
	y: { min: number; max: number };
	z: { min: number; max: number };
} {
	const xCoords = nodes.map((n) => n.x);
	const yCoords = nodes.map((n) => n.y);
	const zCoords = nodes.map((n) => n.z);

	return {
		x: { min: Math.min(...xCoords), max: Math.max(...xCoords) },
		y: { min: Math.min(...yCoords), max: Math.max(...yCoords) },
		z: { min: Math.min(...zCoords), max: Math.max(...zCoords) },
	};
}


