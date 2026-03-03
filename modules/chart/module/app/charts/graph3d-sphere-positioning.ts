import { calculateNodeSize, calculateNodeColor } from './graph3d-utils';

/**
 * Spherical 3D positioning
 */
export function positionSphereGraph3D(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		value?: number;
		color?: string;
		size?: number;
		shape?: "sphere" | "cube" | "cylinder";
	}>,
	dimensions: { width: number; height: number; depth: number },
	nodeSize: "fixed" | "value" | "degree",
	colorBy: string,
	nodeDegrees: Map<string, number>,
): Array<{
	id: string;
	name: string;
	x: number;
	y: number;
	z: number;
	group?: string;
	value?: number;
	color?: string;
	size?: number;
	shape?: "sphere" | "cube" | "cylinder";
}> {
	const centerX = dimensions.width / 2;
	const centerY = dimensions.height / 2;
	const centerZ = dimensions.depth / 2;
	const radius =
		Math.min(dimensions.width, dimensions.height, dimensions.depth) / 3;

	return nodes.map((node, index) => {
		const t = (index / nodes.length) * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);

		const x = centerX + radius * Math.sin(phi) * Math.cos(t);
		const y = centerY + radius * Math.sin(phi) * Math.sin(t);
		const z = centerZ + radius * Math.cos(phi);
		const degree = nodeDegrees.get(node.id) || 0;
		const size = calculateNodeSize(nodeSize, node, degree);
		const color = calculateNodeColor(colorBy, node, degree, index);
		return {
			...node,
			x,
			y,
			z,
			size,
			color,
		};
	});
}


