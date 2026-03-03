import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Calculate color for icicle node
 */
function calculateIcicleColor(
	colorBy: string,
	level: number,
	totalValue: number,
	parent?: string,
	colorScheme?: string[],
): string {
	switch (colorBy) {
		case "level":
			return getSeriesColor(level);
		case "value":
			const intensity = Math.min(totalValue / 1000, 1);
			return `hsl(${240 - intensity * 240}, 70%, 50%)`;
		case "branch":
			return parent
				? getSeriesColor(
						Math.abs(
							parent.split("").reduce((a, b) => a + b.charCodeAt(0), 0),
						) % 10,
					)
				: getSeriesColor(0);
		default:
			return colorScheme
				? colorScheme[level % colorScheme.length]
				: getSeriesColor(level);
	}
}

/**
 * Calculate icicle positions recursively
 */
function calculateIciclePositions(
	node: any,
	x: number,
	y: number,
	width: number,
	height: number,
	orientation: "horizontal" | "vertical",
	padding: number,
	colorBy: string,
	sortBy: string,
	colorScheme?: string[],
	level: number = 0,
	parent?: string,
): Array<{
	id: string;
	name: string;
	x: number;
	y: number;
	width: number;
	height: number;
	level: number;
	parent?: string;
	children: string[];
	value: number;
	color?: string;
}> {
	const nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		width: number;
		height: number;
		level: number;
		parent?: string;
		children: string[];
		value: number;
		color?: string;
	}> = [];

	// Calculate total value for current node
	const totalValue = calculateIcicleValue(node);

	// Sort children if requested
	let sortedChildren = node.children || [];
	if (sortBy === "value") {
		sortedChildren = [...sortedChildren].sort(
			(a: any, b: any) => calculateIcicleValue(b) - calculateIcicleValue(a),
		);
	} else if (sortBy === "name") {
		sortedChildren = [...sortedChildren].sort((a: any, b: any) =>
			a.name.localeCompare(b.name),
		);
	}

	// Assign color based on strategy
	const color = calculateIcicleColor(
		colorBy,
		level,
		totalValue,
		parent,
		colorScheme,
	);

	const currentNode = {
		id: node.id,
		name: node.name,
		x,
		y,
		width,
		height,
		level,
		parent,
		children: sortedChildren.map((child: any) => child.id),
		value: totalValue,
		color,
	};

	nodes.push(currentNode);

	// Process children
	if (sortedChildren.length > 0) {
		let currentPos = orientation === "horizontal" ? x : y;
		const totalSize = orientation === "horizontal" ? width : height;

		sortedChildren.forEach((child: any) => {
			const childValue = calculateIcicleValue(child);
			const childSize =
				(childValue / totalValue) *
				(totalSize - padding * (sortedChildren.length - 1));

			let childX = x;
			let childY = y;
			let childWidth = width;
			let childHeight = height;

			if (orientation === "horizontal") {
				childX = currentPos;
				childWidth = childSize;
			} else {
				childY = currentPos;
				childHeight = childSize;
			}

			// Recursively calculate child positions
			const childNodes = calculateIciclePositions(
				child,
				childX + padding,
				childY + padding,
				childWidth - 2 * padding,
				childHeight - 2 * padding,
				orientation,
				padding,
				colorBy,
				colorScheme,
				sortBy,
				level + 1,
				node.id,
			);

			nodes.push(...childNodes);

			currentPos += childSize + padding;
		});
	}

	return nodes;
}

/**
 * Calculate value for icicle node (sum of all descendant values)
 */
function calculateIcicleValue(node: any): number {
	if (node.value !== undefined) {
		return node.value;
	}

	if (node.children && node.children.length > 0) {
		return node.children.reduce(
			(sum: number, child: any) => sum + calculateIcicleValue(child),
			0,
		);
	}

	return 1; // Default value for leaf nodes
}

/**
 * Calculate icicle layout bounds
 */
export function calculateIcicleBounds(
	nodes: Array<{ x: number; y: number; width: number; height: number }>,
): {
	x: number;
	y: number;
	width: number;
	height: number;
} {
	if (nodes.length === 0) {
		return { x: 0, y: 0, width: 0, height: 0 };
	}

	const xCoords = nodes.flatMap((n) => [n.x, n.x + n.width]);
	const yCoords = nodes.flatMap((n) => [n.y, n.y + n.height]);

	return {
		x: Math.min(...xCoords),
		y: Math.min(...yCoords),
		width: Math.max(...xCoords) - Math.min(...xCoords),
		height: Math.max(...yCoords) - Math.min(...yCoords),
	};
}

export { calculateIciclePositions, calculateIcicleValue };


