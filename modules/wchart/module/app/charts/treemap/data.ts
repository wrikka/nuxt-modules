import type { ChartData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate treemap data from hierarchical data
 */
export function generateTreemapData(
	data: Array<{
		name: string;
		value: number;
		color?: string;
		children?: any[];
	}>,
	options: {
		title?: string;
		padding?: number;
		round?: boolean;
	} = {},
): ChartData {
	const { title, padding = 2, round = false } = options;

	// Flatten hierarchical data for treemap
	const flatData: DataPoint[] = [];

	function processNode(node: any, path: string[] = []) {
		const currentPath = [...path, node.name];
		const pathString = currentPath.join("/");

		if (node.children && node.children.length > 0) {
			// Parent node
			node.children.forEach((child: any) => processNode(child, currentPath));
		} else {
			// Leaf node
			flatData.push({
				x: pathString,
				y: node.value,
				label: node.name,
				color: node.color || getSeriesColor(flatData.length),
			});
		}
	}

	data.forEach((item) => processNode(item));

	return {
		title,
		series: [
			{
				name: "Treemap",
				data: flatData,
				type: "treemap",
			},
		],
	};
}

/**
 * Generate treemap from flat data with categories
 */
export function generateTreemapFromCategories(
	data: Array<{
		category: string;
		name: string;
		value: number;
		color?: string;
	}>,
	options: {
		title?: string;
	} = {},
): ChartData {
	const { title } = options;

	// Group by category
	const categoryMap = new Map<
		string,
		Array<{ name: string; value: number; color?: string }>
	>();

	data.forEach((item) => {
		if (!categoryMap.has(item.category)) {
			categoryMap.set(item.category, []);
		}
		categoryMap.get(item.category)!.push({
			name: item.name,
			value: item.value,
			color: item.color,
		});
	});

	// Convert to hierarchical structure
	const hierarchicalData = Array.from(categoryMap.entries()).map(
		([category, items]) => ({
			name: category,
			value: items.reduce((sum, item) => sum + item.value, 0),
			children: items.map((item) => ({
				name: item.name,
				value: item.value,
				color: item.color,
			})),
		}),
	);

	return generateTreemapData(hierarchicalData, { title });
}

/**
 * Generate nested treemap data
 */
export function generateNestedTreemapData(
	rootName: string,
	children: Array<{ name: string; value: number; children?: any[] }>,
	depth: number = 2,
): ChartData {
	const flatData: DataPoint[] = [];

	function processLevel(
		nodes: any[],
		currentDepth: number,
		path: string[] = [],
	) {
		if (currentDepth >= depth) {
			nodes.forEach((node) => {
				if (!node.children || node.children.length === 0) {
					flatData.push({
						x: [...path, node.name].join("/"),
						y: node.value,
						label: node.name,
						color: getSeriesColor(flatData.length),
					});
				}
			});
			return;
		}

		nodes.forEach((node) => {
			const currentPath = [...path, node.name];

			if (node.children && node.children.length > 0) {
				processLevel(node.children, currentDepth + 1, currentPath);
			} else {
				flatData.push({
					x: currentPath.join("/"),
					y: node.value,
					label: node.name,
					color: getSeriesColor(flatData.length),
				});
			}
		});
	}

	processLevel(children, 0, [rootName]);

	return {
		series: [
			{
				name: "Nested Treemap",
				data: flatData,
				type: "treemap",
			},
		],
	};
}


