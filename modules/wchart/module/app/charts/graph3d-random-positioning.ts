import { calculateNodeSize, calculateNodeColor } from './graph3d-utils';

/**
 * Random 3D positioning
 */
export function positionRandomGraph3D(
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
	return nodes.map((node, index) => {
		const x = Math.random() * dimensions.width;
		const y = Math.random() * dimensions.height;
		const z = Math.random() * dimensions.depth;
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


