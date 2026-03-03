import { getSeriesColor } from '@/module/app/utils/chart-utils';
import type { PositionedNode3D } from './types';

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
	nodeSize: string,
	colorBy: string,
	nodeDegrees: Map<string, number>,
): PositionedNode3D[] {
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
							node.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0),
						) % 10,
					);
					break;
				default:
					color = getSeriesColor(index);
			}
		}

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


