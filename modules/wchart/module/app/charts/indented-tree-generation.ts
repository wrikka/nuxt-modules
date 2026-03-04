import type { ChartData } from '@/module/app/types/chart-basic';
import type { IndentedTreeData } from './indented-tree-types';
import { generateTreeLines } from './indented-tree-layout';
import { calculateIndentedTreeBounds } from './indented-tree-utils';

/**
 * Generate indented tree data
 */
export function generateIndentedTreeData(
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
		x?: number;
		y?: number;
		lineHeight?: number;
		indentWidth?: number;
		fontSize?: number;
		colorBy?: "level" | "branch" | "none";
		showExpanders?: boolean;
		initialExpandLevel?: number;
	} = {},
): IndentedTreeData {
	const {
		title,
		x = 0,
		y = 0,
		lineHeight = 20,
		indentWidth = 20,
		fontSize = 14,
		colorBy = "level",
		showExpanders = true,
		initialExpandLevel = -1,
	} = options;

	// Generate tree lines
	const lines = generateTreeLines(
		root,
		x,
		y,
		lineHeight,
		indentWidth,
		fontSize,
		colorBy,
		showExpanders,
		initialExpandLevel,
	);

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Indented Tree",
				data: lines.map((line) => ({
					x: line.x,
					y: line.y,
					label: line.text,
					color: line.color,
				})),
				type: "indentedTree" as const,
			},
		],
	};

	const maxDepth = Math.max(...lines.map((l) => l.level));
	const bounds = calculateIndentedTreeBounds(lines);

	return {
		...chartData,
		lines,
		bounds,
		maxDepth,
	};
}

/**
 * Generate indented tree from flat data
 */
export function generateIndentedTreeFromFlatData(
	nodes: Array<{
		id: string;
		name: string;
		parent?: string;
	}>,
	options: {
		title?: string;
		rootId?: string;
	} = {},
): IndentedTreeData {
	const { title, rootId } = options;

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

	return generateIndentedTreeData(root, { title });
}


