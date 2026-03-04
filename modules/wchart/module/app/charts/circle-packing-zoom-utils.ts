import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Calculate color for circle packing node
 */
export function calculateCircleColor(
	colorBy: string,
	level: number,
	value: number,
	parent?: string,
	radius?: number,
): string {
	switch (colorBy) {
		case "level":
			return getSeriesColor(level);
		case "value":
			const intensity = Math.min(value / 1000, 1);
			return `hsl(${240 - intensity * 240}, 70%, 50%)`;
		case "branch":
			return parent
				? getSeriesColor(
						Math.abs(
							parent.split("").reduce((a, b) => a + b.charCodeAt(0), 0),
						) % 10,
					)
				: getSeriesColor(0);
		case "size":
			const sizeIntensity = radius ? Math.min(radius / 50, 1) : 0;
			return `hsl(${200 + sizeIntensity * 60}, 70%, 50%)`;
		default:
			return getSeriesColor(level);
	}
}

/**
 * Calculate circle packing zoom value
 */
export function calculateCirclePackingZoomValue(node: any): number {
	if (node.value !== undefined) {
		return node.value;
	}

	if (node.children && node.children.length > 0) {
		return node.children.reduce(
			(sum: number, child: any) => sum + calculateCirclePackingZoomValue(child),
			0,
		);
	}

	return 1;
}


