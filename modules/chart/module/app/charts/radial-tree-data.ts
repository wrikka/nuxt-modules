import type { ChartData } from '@/module/app/types/chart-basic';
import type { RadialTreeData } from './radial-tree-types';
import { calculateRadialPositions } from './radial-tree-layout';

/**
 * Generate radial tree data
 */
export function generateRadialTreeData(
	root: {
		id: string;
		name: string;
		children?: Array<{
			id: string;
			name: string;
			children?: any[];
		}>;
	},
	options: {
		title?: string;
		centerX?: number;
		centerY?: number;
		radiusIncrement?: number;
		startAngle?: number;
		endAngle?: number;
		sortBy?: "name" | "size" | "none";
		colorBy?: "level" | "branch" | "size" | "none";
		showLabels?: boolean;
		labelSize?: number;
	} = {},
): RadialTreeData {
	const {
		title,
		centerX = 400,
		centerY = 300,
		radiusIncrement = 80,
		startAngle = 0,
		endAngle = 2 * Math.PI,
		sortBy = "name",
		colorBy = "level",
		showLabels = true,
		labelSize = 12,
	} = options;

	// Flatten tree and calculate positions
	const { nodes, links } = calculateRadialPositions(
		root,
		centerX,
		centerY,
		radiusIncrement,
		startAngle,
		endAngle,
		sortBy,
		colorBy,
	);

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Radial Tree",
				data: nodes.map((node) => ({
					x: node.x,
					y: node.y,
					label: showLabels ? node.name : undefined,
					color: node.color,
					size: node.size,
				})),
				type: "radialTree" as const,
			},
		],
	};

	const maxDepth = Math.max(...nodes.map((n) => n.level));
	const maxRadius = maxDepth * radiusIncrement;

	return {
		...chartData,
		nodes,
		links,
		center: { x: centerX, y: centerY },
		maxRadius,
		maxDepth,
	};
}

/**
 * Generate radial tree from flat data with parent-child relationships
 */
export function generateRadialTreeFromFlatData(
	nodes: Array<{
		id: string;
		name: string;
		parent?: string;
	}>,
	options: {
		title?: string;
		rootId?: string;
	} = {},
): RadialTreeData {
	const { title, rootId } = options;

	// Build tree structure from flat data
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
		// Find node with no parent
		root = nodes.find((node) => !node.parent);
		if (root) {
			root = nodeMap.get(root.id);
		}
	}

	if (!root) {
		throw new Error("Could not determine root node");
	}

	return generateRadialTreeData(root, { title });
}

/**
 * Generate circular radial tree (full 360 degrees)
 */
export function generateCircularRadialTree(
	root: {
		id: string;
		name: string;
		children?: any[];
	},
	options: {
		title?: string;
		levels?: number;
		equalAngleDistribution?: boolean;
	} = {},
): RadialTreeData {
	const { title, levels, equalAngleDistribution = false } = options;

	return generateRadialTreeData(root, {
		title,
		startAngle: 0,
		endAngle: 2 * Math.PI,
		...options,
	});
}

/**
 * Generate sunburst-style radial tree (radial segments)
 */
export function generateSunburstRadialTree(
	root: {
		id: string;
		name: string;
		children?: any[];
	},
	options: {
		title?: string;
		maxDepth?: number;
		colorScheme?: string[];
	} = {},
): RadialTreeData {
	const { title, maxDepth = 4, colorScheme } = options;

	return generateRadialTreeData(root, {
		title,
		colorBy: "level",
		...options,
	});
}

/**
 * Generate radial tree with custom angle assignments
 */
export function generateCustomAngleRadialTree(
	root: {
		id: string;
		name: string;
		children?: any[];
	},
	angleAssignments: Map<string, number>,
	options: {
		title?: string;
	} = {},
): RadialTreeData {
	// This would require custom position calculation logic
	// For now, return standard radial tree
	return generateRadialTreeData(root, options);
}


