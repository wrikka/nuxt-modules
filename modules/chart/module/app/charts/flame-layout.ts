import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Flame graph node interface
 */
export interface FlameNode {
	id: string;
	name: string;
	value: number;
	children?: FlameNode[];
	color?: string;
}

/**
 * Calculate flame graph layout
 */
export function calculateFlameLayout(
	root: FlameNode,
	x: number,
	y: number,
	width: number,
	height: number,
	colorBy: string,
	sortBy: string,
	showTooltips: boolean,
	level: number = 0,
): Array<{
	id: string;
	name: string;
	x: number;
	y: number;
	width: number;
	height: number;
	value: number;
	level: number;
	parent?: string;
	children: string[];
	color?: string;
	tooltip?: string;
}> {
	const frames: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		width: number;
		height: number;
		value: number;
		level: number;
		parent?: string;
		children: string[];
		color?: string;
		tooltip?: string;
	}> = [];

	const levelHeight = height / (level + 1); // Deeper levels get shorter bars
	const currentY = y + level * levelHeight;

	// Sort children if requested
	let sortedChildren = root.children || [];
	if (sortBy === "value") {
		sortedChildren = [...sortedChildren].sort(
			(a: any, b: any) => b.value - a.value,
		);
	} else if (sortBy === "name") {
		sortedChildren = [...sortedChildren].sort((a: any, b: any) =>
			a.name.localeCompare(b.name),
		);
	}

	// Calculate total value for proportional sizing
	const totalValue = sortedChildren.reduce(
		(sum: number, child: any) => sum + child.value,
		0,
	);

	// Create frame for current node
	let color: string;
	switch (colorBy) {
		case "name":
			color = getSeriesColor(
				Math.abs(root.name.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) %
					10,
			);
			break;
		case "value":
			const intensity = Math.min(root.value / 100, 1); // Normalize by some max value
			color = `hsl(${240 - intensity * 240}, 70%, 50%)`;
			break;
		case "depth":
			color = getSeriesColor(level);
			break;
		case "parent":
			color = getSeriesColor(level > 0 ? level - 1 : 0);
			break;
		default:
			color = getSeriesColor(level);
	}

	const tooltip = showTooltips
		? `${root.name}: ${root.value.toFixed(2)}`
		: undefined;

	const rootFrame = {
		id: root.id,
		name: root.name,
		x,
		y: currentY,
		width,
		height: levelHeight,
		value: root.value,
		level,
		parent: undefined,
		children: sortedChildren.map((child: any) => child.id),
		color,
		tooltip,
	};

	frames.push(rootFrame);

	// Process children
	if (sortedChildren.length > 0) {
		let currentX = x;

		sortedChildren.forEach((child: any) => {
			const childWidth = (child.value / totalValue) * width;

			// Recursively calculate child frames
			const childFrames = calculateFlameLayout(
				child,
				currentX,
				y,
				childWidth,
				height,
				colorBy,
				sortBy,
				showTooltips,
				level + 1,
			);

			frames.push(...childFrames);
			currentX += childWidth;
		});
	}

	return frames;
}

/**
 * Merge similar nodes in flame graph
 */
export function mergeSimilarNodes(node: any): void {
	if (!node.children) return;

	// Group children by name
	const nameGroups = new Map<string, any[]>();

	node.children.forEach((child: any) => {
		if (!nameGroups.has(child.name)) {
			nameGroups.set(child.name, []);
		}
		nameGroups.get(child.name)!.push(child);
	});

	// Merge children with same name
	const mergedChildren: any[] = [];

	nameGroups.forEach((children, name) => {
		if (children.length === 1) {
			mergedChildren.push(children[0]);
		} else {
			// Merge multiple children with same name
			const mergedValue = children.reduce((sum, child) => sum + child.value, 0);
			const mergedChildrenList = children.flatMap(
				(child) => child.children || [],
			);

			const mergedNode = {
				id: `${node.id}_${name}_merged`,
				name: `${name} (${children.length})`,
				value: mergedValue,
				children: mergedChildrenList,
			};

			mergedChildren.push(mergedNode);
		}
	});

	node.children = mergedChildren;

	// Recursively merge children
	node.children.forEach((child: any) => mergeSimilarNodes(child));
}


