import { getSeriesColor } from '@/module/app/utils/chart-utils';
import {
	positionTreeLayout,
	positionClusterLayout,
	positionRadialLayout,
} from "../utils/tree-layout-utils";

/**
 * Calculate tree layout
 */
export function calculateTreeLayout(
	root: any,
	layout: "tree" | "cluster" | "radial",
	nodeSize: number,
	levelGap: number,
	siblingGap: number,
	colorBy: string,
	initialCollapseLevel: number,
	orientation: "horizontal" | "vertical",
	level: number = 0,
	parent?: string,
): Array<{
	id: string;
	name: string;
	x: number;
	y: number;
	level: number;
	parent?: string;
	children: string[];
	value?: number;
	color?: string;
	collapsed: boolean;
	visible: boolean;
	depth: number;
}> {
	const nodes: Array<{
		id: string;
		name: string;
		x: number;
		y: number;
		level: number;
		parent?: string;
		children: string[];
		value?: number;
		color?: string;
		collapsed: boolean;
		visible: boolean;
		depth: number;
	}> = [];

	// Assign color
	let color: string;
	switch (colorBy) {
		case "level":
			color = getSeriesColor(level);
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
		case "value":
			const intensity = Math.min((root.value || 1) / 100, 1);
			color = `hsl(${240 - intensity * 240}, 70%, 50%)`;
			break;
		default:
			color = getSeriesColor(level);
	}

	const collapsed = level > initialCollapseLevel && initialCollapseLevel >= 0;
	const visible = !collapsed;

	const node = {
		id: root.id,
		name: root.name,
		x: 0, // Will be positioned later
		y: 0, // Will be positioned later
		level,
		parent,
		children: root.children ? root.children.map((child: any) => child.id) : [],
		value: root.value,
		color,
		collapsed,
		visible,
		depth: level,
	};

	nodes.push(node);

	// Process children if not collapsed
	if (root.children && !collapsed) {
		root.children.forEach((child: any) => {
			const childNodes = calculateTreeLayout(
				child,
				layout,
				nodeSize,
				levelGap,
				siblingGap,
				colorBy,
				initialCollapseLevel,
				orientation,
				level + 1,
				root.id,
			);
			nodes.push(...childNodes);
		});
	}

	// Position nodes based on layout
	if (layout === "tree") {
		positionTreeLayout(nodes, orientation, levelGap, siblingGap);
	} else if (layout === "cluster") {
		positionClusterLayout(nodes, orientation, levelGap, siblingGap);
	} else if (layout === "radial") {
		positionRadialLayout(nodes, levelGap);
	}

	return nodes;
}

/**
 * Calculate tree links
 */
export function calculateTreeLinks(
	nodes: Array<{
		id: string;
		parent?: string;
		visible: boolean;
	}>,
): Array<{
	source: string;
	target: string;
	color?: string;
	width?: number;
	visible: boolean;
}> {
	const links: Array<{
		source: string;
		target: string;
		color?: string;
		width?: number;
		visible: boolean;
	}> = [];

	nodes.forEach((node) => {
		if (node.parent) {
			const parentNode = nodes.find((n) => n.id === node.parent);
			const visible = node.visible && (parentNode ? parentNode.visible : true);

			links.push({
				source: node.parent,
				target: node.id,
				color: "#999",
				width: 2,
				visible,
			});
		}
	});

	return links;
}

/**
 * Calculate tree bounds
 */
export function calculateTreeBounds(nodes: Array<{ x: number; y: number }>): {
	x: number;
	y: number;
	width: number;
	height: number;
} {
	if (nodes.length === 0) {
		return { x: 0, y: 0, width: 0, height: 0 };
	}

	const xCoords = nodes.map((n) => n.x);
	const yCoords = nodes.map((n) => n.y);

	const minX = Math.min(...xCoords);
	const maxX = Math.max(...xCoords);
	const minY = Math.min(...yCoords);
	const maxY = Math.max(...yCoords);

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY,
	};
}


