import {
	calculateCircleColor,
	calculateCirclePackingZoomValue,
} from './circle-packing-zoom-utils';

/**
 * Calculate circle packing zoom layout
 */
export function calculateCirclePackingZoomLayout(
	node: any,
	centerX: number,
	centerY: number,
	maxRadius: number,
	colorBy: string,
	level: number = 0,
	parent?: string,
): Array<{
	id: string;
	name: string;
	x: number;
	y: number;
	r: number;
	level: number;
	parent?: string;
	children: string[];
	value: number;
	color?: string;
}> {
	const circles: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		r: number;
		level: number;
		parent?: string;
		children: string[];
		value: number;
		color?: string;
	}> = [];

	// Calculate node value and radius
	const value = calculateCirclePackingZoomValue(node);
	const ringWidth = maxRadius / (level + 1);
	const nodeRadius = Math.sqrt(value) * 2; // Scale radius by square root of value

	// Assign color
	const color = calculateCircleColor(colorBy, level, value, parent, nodeRadius);

	const circle = {
		id: node.id,
		name: node.name,
		x: centerX,
		y: centerY,
		r: nodeRadius,
		level,
		parent,
		children: node.children ? node.children.map((child: any) => child.id) : [],
		value,
		color,
	};

	circles.push(circle);

	// Process children
	if (node.children && node.children.length > 0) {
		// Position children around the parent
		const childCircles = calculateChildCirclePositions(
			node.children,
			centerX,
			centerY,
			nodeRadius,
			maxRadius,
			colorBy,
			level + 1,
			node.id,
		);

		circles.push(...childCircles);
	}

	return circles;
}

/**
 * Calculate positions for child circles
 */
export function calculateChildCirclePositions(
	children: any[],
	parentX: number,
	parentY: number,
	parentRadius: number,
	maxRadius: number,
	colorBy: string,
	level: number,
	parentId: string,
): Array<{
	id: string;
	name: string;
	x: number;
	y: number;
	r: number;
	level: number;
	parent: string;
	children: string[];
	value: number;
	color?: string;
}> {
	const childCircles: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		r: number;
		level: number;
		parent: string;
		children: string[];
		value: number;
		color?: string;
	}> = [];

	if (children.length === 0) return childCircles;

	// Calculate angles for children
	const angleStep = (2 * Math.PI) / children.length;

	children.forEach((child: any, index: number) => {
		const angle = index * angleStep;
		const distance = parentRadius + 20 + Math.random() * 30; // Random distance for organic layout
		const x = parentX + distance * Math.cos(angle);
		const y = parentY + distance * Math.sin(angle);

		// Calculate child layout recursively
		const childLayout = calculateCirclePackingZoomLayout(
			child,
			x,
			y,
			maxRadius,
			colorBy,
			level,
			parentId,
		);

		childCircles.push(...childLayout);
	});

	return childCircles;
}


