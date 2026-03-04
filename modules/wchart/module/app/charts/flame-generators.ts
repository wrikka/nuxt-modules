import type { ChartData } from '@/module/app/types/chart-basic';
import type { FlameData } from './flame-types';
import { calculateFlameLayout, mergeSimilarNodes } from './flame-layout';

/**
 * Generate flame graph data
 */
export function generateFlameData(
	root: {
		id: string;
		name: string;
		value: number;
		children?: Array<{
			id: string;
			name: string;
			value: number;
			children?: any[];
		}>;
	},
	options: {
		title?: string;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		colorBy?: "name" | "value" | "depth" | "parent";
		showTooltips?: boolean;
		sortBy?: "value" | "name" | "none";
	} = {},
): FlameData {
	const {
		title,
		x = 0,
		y = 0,
		width = 800,
		height = 400,
		colorBy = "name",
		showTooltips = true,
		sortBy = "value",
	} = options;

	// Calculate flame graph layout
	const frames = calculateFlameLayout(
		root,
		x,
		y,
		width,
		height,
		colorBy,
		sortBy,
		showTooltips,
	);

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Flame Graph",
				data: frames.map((frame) => ({
					x: frame.x,
					y: frame.y,
					label: frame.name,
					color: frame.color,
					value: frame.value,
				})),
				type: "flame" as const,
			},
		],
	};

	const maxDepth = Math.max(...frames.map((f) => f.level));
	const totalValue = frames.reduce((sum, f) => sum + f.value, 0);

	return {
		...chartData,
		frames,
		maxDepth,
		totalValue,
		bounds: { x, y, width, height },
	};
}

/**
 * Generate flame graph from stack traces
 */
export function generateFlameFromStackTraces(
	stackTraces: Array<{
		trace: string[];
		value: number;
	}>,
	options: {
		title?: string;
		mergeSimilar?: boolean;
	} = {},
): FlameData {
	const { title, mergeSimilar = true } = options;

	// Build tree structure from stack traces
	const root = {
		id: "root",
		name: "root",
		value: stackTraces.reduce((sum, trace) => sum + trace.value, 0),
		children: [] as any[],
	};

	// Process each stack trace
	stackTraces.forEach((stackTrace, traceIndex) => {
		let currentNode = root;

		stackTrace.trace.forEach((frameName, frameIndex) => {
			// Find or create child node
			let childNode = currentNode.children.find(
				(child: any) => child.name === frameName,
			);

			if (!childNode) {
				childNode = {
					id: `${currentNode.id}_${frameName}_${frameIndex}`,
					name: frameName,
					value: 0,
					children: [],
				};
				currentNode.children.push(childNode);
			}

			// Add value to this frame
			if (frameIndex === stackTrace.trace.length - 1) {
				// Leaf node gets the full value
				childNode.value += stackTrace.value;
			}

			currentNode = childNode;
		});
	});

	// Merge similar nodes if requested
	if (mergeSimilar) {
		mergeSimilarNodes(root);
	}

	return generateFlameData(root, { title });
}

/**
 * Generate inverted flame graph (icicle style)
 */
export function generateInvertedFlame(
	root: {
		id: string;
		name: string;
		value: number;
		children?: any[];
	},
	options: {
		title?: string;
		height?: number;
	} = {},
): FlameData {
	const { title, height = 400 } = options;

	return generateFlameData(root, {
		title: title || "Inverted Flame Graph",
		y: height,
		height: -height, // Negative height for inverted layout
	});
}


