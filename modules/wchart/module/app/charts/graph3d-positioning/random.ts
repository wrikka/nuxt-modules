import { getSeriesColor } from '@/module/app/utils/chart-utils';
import type { PositionedNode3D } from './types';

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
	nodeSize: string,
	colorBy: string,
	nodeDegrees: Map<string, number>,
): PositionedNode3D[] {
	return nodes.map((node, index) => {
		const x = Math.random() * dimensions.width;
		const y = Math.random() * dimensions.height;
		const z = Math.random() * dimensions.depth;

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
						: getSeriesColor(index);
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


