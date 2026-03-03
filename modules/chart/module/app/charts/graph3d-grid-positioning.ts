import { calculateNodeSize, calculateNodeColor } from './graph3d-utils';

/**
 * Grid 3D positioning
 */
export function positionGridGraph3D(
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
	const gridSize = Math.ceil(Math.cbrt(nodes.length));
	const spacingX = dimensions.width / gridSize;
	const spacingY = dimensions.height / gridSize;
	const spacingZ = dimensions.depth / gridSize;

	return nodes.map((node, index) => {
		const x = (index % gridSize) * spacingX + spacingX / 2;
		const y =
			(Math.floor(index / gridSize) % gridSize) * spacingY + spacingY / 2;
		const z =
			Math.floor(index / (gridSize * gridSize)) * spacingZ + spacingZ / 2;
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


