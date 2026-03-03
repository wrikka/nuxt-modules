import type { ChartData } from '@/module/app/types/chart-basic';
import type { PartitionData } from "../types/partition";
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import {
	calculatePartitionValue,
	shouldStartNewRow,
	calculatePartitionStatistics,
} from "../utils/partition-utils";
import { calculateTreemapLayout } from './algorithms/partition-treemap';
import {
	calculateSunburstLayout,
	calculateIcicleLayout,
} from "../utils/partition-layout-utils";

/**
 * Partition utilities - Partition charts for hierarchical data
 */

/**
 * Generate partition chart data
 */
export function generatePartitionData(
	root: {
		id: string;
		name: string;
		value?: number;
		children?: Array<{
			id: string;
			name: string;
			value?: number;
			children?: any[];
		}>;
	},
	options: {
		title?: string;
		layout?: "treemap" | "sunburst" | "icicle";
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		padding?: number;
		colorBy?: "level" | "value" | "branch" | "none";
		sortBy?: "value" | "name" | "none";
	} = {},
): PartitionData {
	const {
		title,
		layout = "treemap",
		x = 0,
		y = 0,
		width = 800,
		height = 400,
		padding = 1,
		colorBy = "level",
		sortBy = "value",
	} = options;

	// Calculate partition layout based on type
	const nodes = calculatePartitionLayout(
		root,
		layout,
		x,
		y,
		width,
		height,
		padding,
		colorBy,
		sortBy,
	);

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Partition Chart",
				data: nodes.map((node) => ({
					x: node.x,
					y: node.y,
					label: node.name,
					color: node.color,
					value: node.value,
				})),
				type: "partition" as const,
			},
		],
	};

	const maxDepth = Math.max(...nodes.map((n) => n.level));

	return {
		...chartData,
		nodes,
		layout,
		bounds: { x, y, width, height },
		maxDepth,
	};
}

/**
 * Calculate partition layout based on type
 */
function calculatePartitionLayout(
	root: any,
	layout: "treemap" | "sunburst" | "icicle",
	x: number,
	y: number,
	width: number,
	height: number,
	padding: number,
	colorBy: string,
	sortBy: string,
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

	// Create node based on layout type
	let nodeX = x;
	let nodeY = y;
	let nodeWidth = width;
	let nodeHeight = height;

	if (layout === "sunburst") {
		// For sunburst, use polar coordinates
		const radius = Math.min(width, height) / 2;
		const innerRadius = (level * radius) / 4; // Adjust for levels
		const outerRadius = ((level + 1) * radius) / 4;

		// This is simplified - real sunburst would need proper angle calculations
		nodeX = x + width / 2 - radius + innerRadius;
		nodeY = y + height / 2 - radius + innerRadius;
		nodeWidth = outerRadius - innerRadius;
		nodeHeight = outerRadius - innerRadius;
	} else if (layout === "icicle") {
		// Icicle layout (horizontal)
		nodeHeight = height / (level + 1);
		nodeY = y + level * nodeHeight;
	}

	const node = {
		id: root.id,
		name: root.name,
		x: nodeX,
		y: nodeY,
		width: nodeWidth,
		height: nodeHeight,
		level,
		parent,
		children: sortedChildren.map((child: any) => child.id),
		value,
		color,
	};

	nodes.push(node);

	// Process children based on layout
	if (sortedChildren.length > 0) {
		if (layout === "treemap") {
			// Use squarified treemap algorithm
			const childNodes = calculateTreemapLayout(
				sortedChildren,
				nodeX + padding,
				nodeY + padding,
				nodeWidth - 2 * padding,
				nodeHeight - 2 * padding,
				colorBy,
				sortBy,
				level + 1,
				root.id,
			);
			nodes.push(...childNodes);
		} else if (layout === "sunburst") {
			const childNodes = calculateSunburstLayout(
				sortedChildren,
				nodeX,
				nodeY,
				nodeWidth,
				nodeHeight,
				padding,
				colorBy,
				sortBy,
				level + 1,
				root.id,
			);
			nodes.push(...childNodes);
		} else if (layout === "icicle") {
			const childNodes = calculateIcicleLayout(
				sortedChildren,
				nodeX,
				nodeY,
				nodeWidth,
				nodeHeight,
				padding,
				colorBy,
				sortBy,
				level + 1,
				root.id,
			);
			nodes.push(...childNodes);
		}
	}

	return nodes;
}

/**
 * Generate partition from flat data
 */
export function generatePartitionFromFlatData(
	nodes: Array<{
		id: string;
		name: string;
		parent?: string;
		value?: number;
	}>,
	options: {
		title?: string;
		layout?: "treemap" | "sunburst" | "icicle";
		rootId?: string;
	} = {},
): PartitionData {
	const { title, layout = "treemap", rootId } = options;

	// Build tree structure
	const nodeMap = new Map(
		nodes.map((node) => [node.id, { ...node, children: [] as any[] }]),
	);
	let root: any = null;

	nodes.forEach((node) => {
		if (node.parent) {
			const parent = nodeMap.get(node.parent);
			if (parent) {
				parent.children.push(nodeMap.get(node.id));
			}
		} else if (!rootId || node.id === rootId) {
			root = nodeMap.get(node.id);
		}
	});

	if (!root && nodes.length > 0) {
		const rootNode = nodes.find((node) => !node.parent);
		if (rootNode) {
			root = nodeMap.get(rootNode.id);
		}
	}

	if (!root) {
		throw new Error("Could not determine root node");
	}

	return generatePartitionData(root, { title, layout });
}

/**
 * Generate different partition layouts
 */
export function generateTreemapPartition(
	root: any,
	options: { title?: string } = {},
): PartitionData {
	return generatePartitionData(root, { ...options, layout: "treemap" });
}

export function generateSunburstPartition(
	root: any,
	options: { title?: string } = {},
): PartitionData {
	return generatePartitionData(root, { ...options, layout: "sunburst" });
}

export function generateIciclePartition(
	root: any,
	options: { title?: string } = {},
): PartitionData {
	return generatePartitionData(root, { ...options, layout: "icicle" });
}


