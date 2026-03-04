import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { calculateTreeMapValue } from './tree-map-utils';
import { layoutSquarify } from './tree-map-squarify';
import { layoutStrip, layoutSlice } from './tree-map-strip';

/**
 * Calculate treemap layout
 */
export function calculateTreeMapLayout(
	node: any,
	x: number,
	y: number,
	width: number,
	height: number,
	padding: number,
	colorBy: string,
	algorithm: "squarify" | "strip" | "slice",
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

	// Calculate node value
	const value = calculateTreeMapValue(node);

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

	const currentNode = {
		id: node.id,
		name: node.name,
		x,
		y,
		width,
		height,
		level,
		parent,
		children: node.children ? node.children.map((child: any) => child.id) : [],
		value,
		color,
	};

	nodes.push(currentNode);

	// Process children
	if (node.children && node.children.length > 0) {
		const childNodes = layoutTreeMapChildren(
			node.children,
			x + padding,
			y + padding,
			width - 2 * padding,
			height - 2 * padding,
			padding,
			colorBy,
			algorithm,
			level + 1,
			node.id,
		);

		nodes.push(...childNodes);
	}

	return nodes;
}

/**
 * Layout treemap children based on algorithm
 */
export function layoutTreeMapChildren(
	children: any[],
	x: number,
	y: number,
	width: number,
	height: number,
	padding: number,
	colorBy: string,
	algorithm: "squarify" | "strip" | "slice",
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
	if (children.length === 0) return [];

	const totalValue = children.reduce(
		(sum, child) => sum + calculateTreeMapValue(child),
		0,
	);

	switch (algorithm) {
		case "squarify":
			return layoutSquarify(
				children,
				x,
				y,
				width,
				height,
				padding,
				colorBy,
				level,
				parent,
			);
		case "strip":
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
				false,
			);
		case "slice":
			return layoutSlice(
				children,
				x,
				y,
				width,
				height,
				padding,
				colorBy,
				level,
				parent,
				false,
			);
		default:
			return layoutSquarify(
				children,
				x,
				y,
				width,
				height,
				padding,
				colorBy,
				level,
				parent,
			);
	}
}
