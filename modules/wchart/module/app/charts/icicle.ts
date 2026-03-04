import type { ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import type { IcicleData } from './icicle-types';
import {
	calculateIciclePositions,
	calculateIcicleValue,
} from './icicle-layout';
import { calculateIcicleBounds } from './icicle-layout';
import { calculateIcicleStatistics } from './icicle-statistics';

/**
 * Icicle utilities - Icicle charts for hierarchies แบบแนวนอน
 */

export { IcicleData } from './icicle-types';

/**
 * Generate icicle chart data
 */
export function generateIcicleData(
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
		orientation?: "horizontal" | "vertical";
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		padding?: number;
		colorBy?: "level" | "value" | "branch" | "none";
		colorScheme?: string[];
		sortBy?: "value" | "name" | "none";
	} = {},
): IcicleData {
	const {
		title,
		orientation = "horizontal",
		x = 0,
		y = 0,
		width = 800,
		height = 400,
		padding = 1,
		colorBy = "level",
		colorScheme,
		sortBy = "value",
	} = options;

	// Calculate node positions and sizes
	const nodes = calculateIciclePositions(
		root,
		x,
		y,
		width,
		height,
		orientation,
		padding,
		colorBy,
		sortBy,
		colorScheme,
	);

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Icicle Chart",
				data: nodes.map((node) => ({
					x: node.x,
					y: node.y,
					label: node.name,
					color: node.color,
					value: node.value,
				})),
				type: "icicle" as const,
			},
		],
	};

	const maxDepth = Math.max(...nodes.map((n) => n.level));

	return {
		...chartData,
		nodes,
		bounds: { x, y, width, height },
		maxDepth,
	};
}

/**
 * Generate icicle chart from flat hierarchical data
 */
export function generateIcicleFromFlatData(
	nodes: Array<{
		id: string;
		name: string;
		parent?: string;
		value?: number;
	}>,
	options: {
		title?: string;
		rootId?: string;
	} = {},
): IcicleData {
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
		const rootNode = nodes.find((node) => !node.parent);
		if (rootNode) {
			root = nodeMap.get(rootNode.id);
		}
	}

	if (!root) {
		throw new Error("Could not determine root node");
	}

	return generateIcicleData(root, { title });
}

export { calculateIcicleBounds };

export { calculateIcicleStatistics };

/**
 * Generate vertical icicle chart
 */
export function generateVerticalIcicle(
	root: {
		id: string;
		name: string;
		value?: number;
		children?: any[];
	},
	options: {
		title?: string;
		width?: number;
		height?: number;
	} = {},
): IcicleData {
	return generateIcicleData(root, {
		orientation: "vertical",
		...options,
	});
}

/**
 * Generate horizontal icicle chart
 */
export function generateHorizontalIcicle(
	root: {
		id: string;
		name: string;
		value?: number;
		children?: any[];
	},
	options: {
		title?: string;
		width?: number;
		height?: number;
	} = {},
): IcicleData {
	return generateIcicleData(root, {
		orientation: "horizontal",
		...options,
	});
}

/**
 * Zoom into specific icicle node
 */
export function zoomIcicleNode(
	icicle: IcicleData,
	nodeId: string,
	zoomFactor: number = 2,
): IcicleData {
	const targetNode = icicle.nodes.find((n) => n.id === nodeId);
	if (!targetNode) return icicle;

	// Create zoomed view centered on target node
	const zoomedNodes = icicle.nodes.map((node) => {
		const relativeX = node.x - targetNode.x;
		const relativeY = node.y - targetNode.y;

		return {
			...node,
			x: icicle.bounds.x + icicle.bounds.width / 2 + relativeX * zoomFactor,
			y: icicle.bounds.y + icicle.bounds.height / 2 + relativeY * zoomFactor,
			width: node.width * zoomFactor,
			height: node.height * zoomFactor,
		};
	});

	return {
		...icicle,
		nodes: zoomedNodes,
	};
}

/**
 * Filter icicle by value threshold
 */
export function filterIcicleByValue(
	icicle: IcicleData,
	minValue: number,
	maxValue?: number,
): IcicleData {
	const filteredNodes = icicle.nodes.filter((node) => {
		const withinMin = node.value >= minValue;
		const withinMax = maxValue === undefined || node.value <= maxValue;
		return withinMin && withinMax;
	});

	// Remove nodes whose parents were filtered out
	const validIds = new Set(filteredNodes.map((n) => n.id));
	const finalNodes = filteredNodes.filter(
		(node) => !node.parent || validIds.has(node.parent),
	);

	return {
		...icicle,
		nodes: finalNodes,
	};
}


