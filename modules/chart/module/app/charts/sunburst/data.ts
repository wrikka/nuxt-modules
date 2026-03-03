import type { ChartData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from "../../utils/colors";

/**
 * Generate sunburst chart data from hierarchical data
 */
export function generateSunburstData(
	rootName: string,
	children: Array<{
		name: string;
		value: number;
		color?: string;
		children?: any[];
	}>,
	options: {
		title?: string;
		maxDepth?: number;
	} = {},
): ChartData {
	const { title, maxDepth = 3 } = options;

	const flatData: DataPoint[] = [];

	function processNode(node: any, path: string[] = [], depth: number = 0) {
		if (depth >= maxDepth) return;

		const currentPath = [...path, node.name];
		const pathString = currentPath.join("/");

		flatData.push({
			x: pathString,
			y: node.value,
			label: node.name,
			color: node.color || getSeriesColor(depth),
		});

		if (node.children && node.children.length > 0) {
			node.children.forEach((child: any) =>
				processNode(child, currentPath, depth + 1),
			);
		}
	}

	// Add root
	flatData.push({
		x: rootName,
		y: children.reduce((sum, child) => sum + child.value, 0),
		label: rootName,
		color: getSeriesColor(0),
	});

	children.forEach((child) => processNode(child, [rootName], 1));

	return {
		title,
		series: [
			{
				name: "Sunburst",
				data: flatData,
				type: "sunburst",
			},
		],
	};
}

/**
 * Generate sunburst from flat data with hierarchy
 */
export function generateSunburstFromFlatData(
	data: Array<{
		path: string[];
		value: number;
		color?: string;
	}>,
	options: {
		title?: string;
	} = {},
): ChartData {
	const { title } = options;

	const flatData: DataPoint[] = data.map((item) => ({
		x: item.path.join("/"),
		y: item.value,
		label: item.path[item.path.length - 1],
		color: item.color || getSeriesColor(item.path.length - 1),
	}));

	return {
		title,
		series: [
			{
				name: "Sunburst",
				data: flatData,
				type: "sunburst",
			},
		],
	};
}


