import { calculatePartitionValue } from "../utils/partition-utils";
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Calculate sunburst partition layout
 */
export function calculateSunburstLayout(
	children: any[],
	nodeX: number,
	nodeY: number,
	nodeWidth: number,
	nodeHeight: number,
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

	// Simplified sunburst partitioning
	const totalValue = children.reduce(
		(sum: number, child: any) => sum + calculatePartitionValue(child),
		0,
	);
	let currentAngle = 0;

	children.forEach((child: any) => {
		const childValue = calculatePartitionValue(child);
		const angle = (childValue / totalValue) * 2 * Math.PI;

		// Assign color
		let color: string;
		switch (colorBy) {
			case "level":
				color = getSeriesColor(level);
				break;
			case "value":
				const intensity = Math.min(childValue / 1000, 1);
				color = `hsl(${240 - intensity * 240}, 70%, 50%)`;
				break;
			case "branch":
				color = getSeriesColor(
					Math.abs(parent.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) %
						10,
				);
				break;
			default:
				color = getSeriesColor(level);
		}

		// Simplified positioning
		const radius = Math.min(nodeWidth, nodeHeight) / 2;
		const innerRadius = (level * radius) / 4;
		const outerRadius = ((level + 1) * radius) / 4;

		const node = {
			id: child.id,
			name: child.name,
			x: nodeX + nodeWidth / 2 - radius + innerRadius,
			y: nodeY + nodeHeight / 2 - radius + innerRadius,
			width: outerRadius - innerRadius,
			height: outerRadius - innerRadius,
			level,
			parent,
			children: child.children ? child.children.map((c: any) => c.id) : [],
			value: childValue,
			color,
		};

		nodes.push(node);
		currentAngle += angle;
	});

	return nodes;
}

/**
 * Calculate icicle partition layout
 */
export function calculateIcicleLayout(
	children: any[],
	nodeX: number,
	nodeY: number,
	nodeWidth: number,
	nodeHeight: number,
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

	// Icicle partitioning
	const totalValue = children.reduce(
		(sum: number, child: any) => sum + calculatePartitionValue(child),
		0,
	);
	let currentX = nodeX;

	children.forEach((child: any) => {
		const childValue = calculatePartitionValue(child);
		const childWidth = (childValue / totalValue) * nodeWidth;

		// Assign color
		let color: string;
		switch (colorBy) {
			case "level":
				color = getSeriesColor(level);
				break;
			case "value":
				const intensity = Math.min(childValue / 1000, 1);
				color = `hsl(${240 - intensity * 240}, 70%, 50%)`;
				break;
			case "branch":
				color = getSeriesColor(
					Math.abs(parent.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) %
						10,
				);
				break;
			default:
				color = getSeriesColor(level);
		}

		const node = {
			id: child.id,
			name: child.name,
			x: currentX,
			y: nodeY,
			width: childWidth,
			height: nodeHeight,
			level,
			parent,
			children: child.children ? child.children.map((c: any) => c.id) : [],
			value: childValue,
			color,
		};

		nodes.push(node);
		currentX += childWidth;
	});

	return nodes;
}
