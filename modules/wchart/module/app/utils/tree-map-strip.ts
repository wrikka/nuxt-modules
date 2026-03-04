import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { calculateTreeMapValue } from './tree-map-utils';

/**
 * Strip treemap layout
 */
export function layoutStrip(
	children: any[],
	x: number,
	y: number,
	width: number,
	height: number,
	padding: number,
	colorBy: string,
	level: number,
	parent: string,
	vertical: boolean = false,
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
	// Simplified strip layout
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

	let currentPos = vertical ? y : x;

	children.forEach((child, index) => {
		const value = calculateTreeMapValue(child);
		const ratio = value / totalValue;

		let childX = x;
		let childY = y;
		let childWidth = width;
		let childHeight = height;

		if (vertical) {
			childHeight = height * ratio;
			childY = currentPos;
			currentPos += childHeight;
		} else {
			childWidth = width * ratio;
			childX = currentPos;
			currentPos += childWidth;
		}

		// Assign color (same as squarify)
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
			x: childX,
			y: childY,
			width: childWidth,
			height: childHeight,
			level,
			parent,
			children: child.children ? child.children.map((c: any) => c.id) : [],
			value,
			color,
		});
	});

	return nodes;
}

/**
 * Slice and dice treemap layout
 */
export function layoutSlice(
	children: any[],
	x: number,
	y: number,
	width: number,
	height: number,
	padding: number,
	colorBy: string,
	level: number,
	parent: string,
	alternate: boolean = false,
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
	return layoutStrip(
		children,
		x,
		y,
		width,
		height,
		padding,
		colorBy,
		level,
		parent,
		alternate,
	);
}
