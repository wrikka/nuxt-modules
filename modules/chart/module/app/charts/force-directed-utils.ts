import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Force-directed network utilities - physics-based network layout
 */

/**
 * Calculate node size based on sizing mode
 */
export function calculateNodeSize(
	nodeSize: "fixed" | "value" | "degree",
	node: any,
	degree: number,
): number {
	let size = node.size || 10;
	switch (nodeSize) {
		case "value":
			size = node.value ? Math.sqrt(node.value) * 2 + 5 : 10;
			break;
		case "degree":
			size = Math.sqrt(degree) * 3 + 5;
			break;
		case "fixed":
		default:
			break;
	}
	return size;
}

/**
 * Calculate node color based on coloring mode
 */
export function calculateNodeColor(
	colorBy: string,
	node: any,
	degree: number,
	defaultColorSeed: number,
): string {
	if (node.color) return node.color;
	switch (colorBy) {
		case "group":
			return node.group
				? getSeriesColor(
						node.group
							.split("")
							.reduce((a: number, b: string) => a + b.charCodeAt(0), 0) % 10,
					)
				: getSeriesColor(defaultColorSeed);
		case "value":
			const intensity = node.value ? Math.min(node.value / 100, 1) : 0.5;
			return `hsl(${240 - intensity * 240}, 70%, 50%)`;
		case "degree":
			const degreeIntensity = Math.min(degree / 10, 1);
			return `hsl(${120 - degreeIntensity * 120}, 70%, 50%)`;
		default:
			return getSeriesColor(defaultColorSeed);
	}
}


