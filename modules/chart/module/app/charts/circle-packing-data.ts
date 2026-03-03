import type { CirclePackingData } from '@/module/app/types/chart-basic';
import { processHierarchy } from './circle-packing-layout';

/**
 * Generate circle packing data
 */
export function generateCirclePackingData(
	hierarchy: Array<{
		name: string;
		value?: number;
		children?: CirclePackingData["hierarchy"];
		color?: string;
	}>,
	options: {
		title?: string;
		padding?: number;
		sortBy?: "value" | "name" | "none";
		colorScheme?: string[];
		maxDepth?: number;
	} = {},
): CirclePackingData {
	const {
		title,
		padding = 2,
		sortBy = "value",
		colorScheme,
		maxDepth,
	} = options;

	// Process hierarchy and assign colors
	const processedHierarchy = processHierarchy(
		hierarchy,
		sortBy,
		colorScheme,
		0,
		maxDepth,
	);

	return {
		title: title || "Circle Packing",
		hierarchy: processedHierarchy,
		series: [], // CirclePackingData extends ChartData but doesn't use series
	};
}

/**
 * Generate circle packing from flat data
 */
export function generateCirclePackingFromFlatData(
	data: Array<{
		name: string;
		value: number;
		group?: string;
		subgroup?: string;
		color?: string;
	}>,
	options: {
		title?: string;
		groupBy?: "group" | "subgroup" | "auto";
	} = {},
): CirclePackingData {
	const { title, groupBy = "auto" } = options;

	// Group data based on strategy
	const groups = new Map<
		string,
		Array<{
			name: string;
			value: number;
			color?: string;
			subgroup?: string;
		}>
	>();

	data.forEach((item) => {
		let groupKey = "root";

		if (groupBy === "group" && item.group) {
			groupKey = item.group;
		} else if (groupBy === "subgroup" && item.subgroup) {
			groupKey = item.subgroup;
		} else if (groupBy === "auto") {
			// Auto-detect grouping
			if (item.subgroup) {
				groupKey = item.subgroup;
			} else if (item.group) {
				groupKey = item.group;
			}
		}

		if (!groups.has(groupKey)) {
			groups.set(groupKey, []);
		}
		groups.get(groupKey)!.push(item);
	});

	// Build hierarchy
	const hierarchy: CirclePackingData["hierarchy"] = [];

	groups.forEach((groupItems, groupName) => {
		const children = groupItems.map((item) => ({
			name: item.name,
			value: item.value,
			color: item.color,
		}));

		hierarchy.push({
			name: groupName,
			children,
		});
	});

	return generateCirclePackingData(hierarchy, { title });
}

/**
 * Generate zoomable circle packing
 */
export function generateZoomableCirclePacking(
	hierarchy: CirclePackingData["hierarchy"],
	options: {
		title?: string;
		maxZoomLevel?: number;
		showBreadcrumbs?: boolean;
	} = {},
): CirclePackingData & {
	zoomable: boolean;
	maxZoomLevel: number;
} {
	const { title, maxZoomLevel = 3, showBreadcrumbs = true } = options;

	const data = generateCirclePackingData(hierarchy, { title });

	return {
		...data,
		zoomable: true,
		maxZoomLevel,
	};
}


