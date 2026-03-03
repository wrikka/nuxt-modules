import {
	calculateSunburstColor,
	calculateSunburstValue,
} from './zoomable-sunburst-utils';

/**
 * Calculate sunburst layout with zoom capability
 */
export function calculateSunburstLayout(
	root: any,
	centerX: number,
	centerY: number,
	maxRadius: number,
	innerRadius: number,
	colorBy: string,
	sortBy: string,
	level: number = 0,
	startAngle: number = 0,
	endAngle: number = 2 * Math.PI,
	parent?: string,
): Array<{
	id: string;
	name: string;
	x: number;
	y: number;
	innerRadius: number;
	outerRadius: number;
	startAngle: number;
	endAngle: number;
	level: number;
	parent?: string;
	children: string[];
	value: number;
	color?: string;
	depth: number;
}> {
	const nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		innerRadius: number;
		outerRadius: number;
		startAngle: number;
		endAngle: number;
		level: number;
		parent?: string;
		children: string[];
		value: number;
		color?: string;
		depth: number;
	}> = [];

	// Calculate node value and radius
	const value = calculateSunburstValue(root);
	const ringWidth = (maxRadius - innerRadius) / (level + 1);
	const nodeInnerRadius = innerRadius + level * ringWidth;
	const nodeOuterRadius = innerRadius + (level + 1) * ringWidth;

	// Sort children if requested
	let sortedChildren = root.children || [];
	if (sortBy === "value") {
		sortedChildren = [...sortedChildren].sort(
			(a: any, b: any) => calculateSunburstValue(b) - calculateSunburstValue(a),
		);
	} else if (sortBy === "name") {
		sortedChildren = [...sortedChildren].sort((a: any, b: any) =>
			a.name.localeCompare(b.name),
		);
	}

	// Assign color based on strategy
	const color = calculateSunburstColor(colorBy, level, value, parent);

	const node = {
		id: root.id,
		name: root.name,
		x: centerX,
		y: centerY,
		innerRadius: nodeInnerRadius,
		outerRadius: nodeOuterRadius,
		startAngle,
		endAngle,
		level,
		parent,
		children: sortedChildren.map((child: any) => child.id),
		value,
		color,
		depth: level,
	};

	nodes.push(node);

	// Process children
	if (sortedChildren.length > 0) {
		const totalValue = sortedChildren.reduce(
			(sum: number, child: any) => sum + calculateSunburstValue(child),
			0,
		);
		let currentAngle = startAngle;

		sortedChildren.forEach((child: any) => {
			const childValue = calculateSunburstValue(child);
			const angleSize = (childValue / totalValue) * (endAngle - startAngle);
			const childStartAngle = currentAngle;
			const childEndAngle = currentAngle + angleSize;

			// Recursively calculate child nodes
			const childNodes = calculateSunburstLayout(
				child,
				centerX,
				centerY,
				maxRadius,
				innerRadius,
				colorBy,
				sortBy,
				level + 1,
				childStartAngle,
				childEndAngle,
				root.id,
			);

			nodes.push(...childNodes);
			currentAngle = childEndAngle;
		});
	}

	return nodes;
}


