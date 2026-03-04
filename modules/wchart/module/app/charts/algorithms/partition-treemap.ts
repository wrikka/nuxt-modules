/**
 * Treemap layout algorithm for partitions
 */
import {
	calculatePartitionValue,
	shouldStartNewRow,
} from "../utils/partition-utils";
import { getSeriesColor } from '@/module/app/utils/chart-utils';

export function calculateTreemapLayout(
	children: any[],
	x: number,
	y: number,
	width: number,
	height: number,
	colorBy: string,
	sortBy: string,
	level: number,
	parent: string,
): Array<{
	id: string;
	name: string;
	x: number;
	y: number;
	width: number;
	height: number;
	level: number;
	parent: string;
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
		parent: string;
		children: string[];
		value: number;
		color?: string;
	}> = [];

	if (children.length === 0) return nodes;

	// Calculate total area and values
	const totalValue = children.reduce(
		(sum: number, child: any) => sum + calculatePartitionValue(child),
		0,
	);
	const totalArea = width * height;

	// Squarified treemap algorithm
	const scaledValues = children.map((child: any) => ({
		child,
		value: calculatePartitionValue(child),
		scaledValue: (calculatePartitionValue(child) / totalValue) * totalArea,
	}));

	// Sort by value for better layout
	scaledValues.sort((a, b) => b.scaledValue - a.scaledValue);

	// Simple row-based layout (simplified squarify)
	const rows: Array<Array<{ child: any; value: number; scaledValue: number }>> =
		[[]];
	let currentRow: Array<{ child: any; value: number; scaledValue: number }> =
		[];
	let remainingWidth = width;
	let currentY = y;

	scaledValues.forEach((item, index) => {
		currentRow.push(item);

		if (
			index === scaledValues.length - 1 ||
			shouldStartNewRow(currentRow, remainingWidth, height)
		) {
			// Layout current row
			const rowHeight = height / rows.length;
			let currentX = x;

			currentRow.forEach((rowItem) => {
				const itemWidth = rowItem.scaledValue / rowHeight;

				// Recursively calculate layout for child
				const childNodes = calculatePartitionLayout(
					rowItem.child,
					currentX,
					currentY,
					itemWidth,
					rowHeight,
					0, // No padding for internal layout
					colorBy,
					sortBy,
					level,
					parent,
				);

				nodes.push(...childNodes);
				currentX += itemWidth;
			});

			rows.push([]);
			currentRow = [];
			currentY += rowHeight;
		}
	});

	return nodes;
}

/**
 * Calculate partition layout (recursive)
 */
function calculatePartitionLayout(
	root: any,
	x: number,
	y: number,
	width: number,
	height: number,
	padding: number,
	colorBy: string,
	sortBy: string,
	level: number,
	parent: string,
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

	// Calculate node value
	const value = calculatePartitionValue(root);

	// Sort children if requested
	let sortedChildren = root.children || [];
	if (sortBy === "value") {
		sortedChildren = [...sortedChildren].sort(
			(a: any, b: any) =>
				calculatePartitionValue(b) - calculatePartitionValue(a),
		);
	} else if (sortBy === "name") {
		sortedChildren = [...sortedChildren].sort((a: any, b: any) =>
			a.name.localeCompare(b.name),
		);
	}

	// Assign color
	let color: string;
	switch (colorBy) {
		case "level":
			color = getSeriesColor(level);
			break;
		case "value":
			const intensity = Math.min(value / 1000, 1); // Normalize
			color = `hsl(${240 - intensity * 240}, 70%, 50%)`;
			break;
		case "branch":
			color = parent
				? getSeriesColor(
						Math.abs(
							parent.split("").reduce((a, b) => a + b.charCodeAt(0), 0),
						) % 10,
					)
				: getSeriesColor(0);
			break;
		default:
			color = getSeriesColor(level);
	}

	const node = {
		id: root.id,
		name: root.name,
		x,
		y,
		width,
		height,
		level,
		parent,
		children: sortedChildren.map((child: any) => child.id),
		value,
		color,
	};

	nodes.push(node);

	// Process children with treemap layout
	if (sortedChildren.length > 0) {
		const childNodes = calculateTreemapLayout(
			sortedChildren,
			x + padding,
			y + padding,
			width - 2 * padding,
			height - 2 * padding,
			colorBy,
			sortBy,
			level + 1,
			root.id,
		);
		nodes.push(...childNodes);
	}

	return nodes;
}


