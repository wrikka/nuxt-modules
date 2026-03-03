import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { calculateTreeMapValue } from './tree-map-utils';

/**
 * Squarified treemap layout
 */
export function layoutSquarify(
	children: any[],
	x: number,
	y: number,
	width: number,
	height: number,
	padding: number,
	colorBy: string,
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
	// Simplified squarify algorithm
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

	const totalValue = children.reduce(
		(sum, child) => sum + calculateTreeMapValue(child),
		0,
	);
	const aspectRatio = width / height;

	let currentX = x;
	let currentY = y;
	let remainingWidth = width;
	let remainingHeight = height;

	children.forEach((child, index) => {
		const value = calculateTreeMapValue(child);
		const ratio = value / totalValue;

		let childWidth: number;
		let childHeight: number;

		if (remainingWidth > remainingHeight) {
			childWidth = remainingWidth * ratio;
			childHeight = remainingHeight;
		} else {
			childWidth = remainingWidth;
			childHeight = remainingHeight * ratio;
		}

		// Assign color
		let color: string;
		switch (colorBy) {
			case "level":
				color = getSeriesColor(level);
				break;
			case "value":
				const intensity = Math.min(value / 1000, 1);
				color = `hsl(${240 - intensity * 240}, 70%, 50%)`;
				break;
			case "branch":
				color = getSeriesColor(
					Math.abs(parent.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) %
						10,
				);
				break;
			default:
				color = getSeriesColor(index);
		}

		nodes.push({
			id: child.id,
			name: child.name,
			x: currentX,
			y: currentY,
			width: childWidth,
			height: childHeight,
			level,
			parent,
			children: child.children ? child.children.map((c: any) => c.id) : [],
			value,
			color,
		});

		// Update remaining space
		if (remainingWidth > remainingHeight) {
			currentX += childWidth;
			remainingWidth -= childWidth;
		} else {
			currentY += childHeight;
			remainingHeight -= childHeight;
		}
	});

	return nodes;
}
