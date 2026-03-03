import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Calculate color for sunburst node
 */
export function calculateSunburstColor(
	colorBy: string,
	level: number,
	value: number,
	parent?: string,
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
		case "parent":
			return getSeriesColor(level > 0 ? level - 1 : 0);
		default:
			return getSeriesColor(level);
	}
}

/**
 * Calculate sunburst value
 */
export function calculateSunburstValue(node: any): number {
	if (node.value !== undefined) {
		return node.value;
	}

	if (node.children && node.children.length > 0) {
		return node.children.reduce(
			(sum: number, child: any) => sum + calculateSunburstValue(child),
			0,
		);
	}

	return 1;
}


