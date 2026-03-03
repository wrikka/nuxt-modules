import type { MultiLevelPieData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate multi-level pie data
 */
export function generateMultiLevelPieData(
	levels: Array<{
		name: string;
		data: Array<{
			name: string;
			value: number;
			color?: string;
			children?: Array<{
				name: string;
				value: number;
				color?: string;
			}>;
		}>;
	}>,
	options: {
		title?: string;
		innerRadius?: number;
		outerRadius?: number;
		padding?: number;
		showLabels?: boolean;
		labelPosition?: "inside" | "outside" | "none";
		animation?: boolean;
		sortBy?: "value" | "name" | "none";
	} = {},
): MultiLevelPieData {
	const {
		title,
		innerRadius = 0,
		outerRadius = 100,
		padding = 2,
		showLabels = true,
		labelPosition = "outside",
		animation = true,
		sortBy = "value",
	} = options;

	// Process levels
	const processedLevels = levels.map((level, levelIndex) => {
		let processedData = level.data.map((item, itemIndex) => ({
			name: item.name,
			value: item.value,
			color:
				item.color ||
				getSeriesColor((levelIndex * level.data.length + itemIndex) % 20),
			children: item.children?.map((child, childIndex) => ({
				name: child.name,
				value: child.value,
				color:
					child.color ||
					getSeriesColor(
						(levelIndex * level.data.length + itemIndex * 10 + childIndex) % 20,
					),
			})),
		}));

		// Sort data within level
		if (sortBy === "value") {
			processedData.sort((a, b) => b.value - a.value);
		} else if (sortBy === "name") {
			processedData.sort((a, b) => a.name.localeCompare(b.name));
		}

		return {
			name: level.name,
			data: processedData,
		};
	});

	const chartData: ChartData = {
		title,
		series: processedLevels.flatMap((level) =>
			level.data.map((item) => ({
				name: item.name,
				data: [
					{
						x: item.name,
						y: item.value,
						label: showLabels ? item.value.toString() : undefined,
						color: item.color,
					},
				],
				type: "pie",
			})),
		),
	};

	return {
		...chartData,
		levels: processedLevels,
	};
}

/**
 * Generate multi-level pie from hierarchical data
 */
export function generateMultiLevelPieFromHierarchy(
	hierarchy: Array<{
		name: string;
		value?: number;
		children?: Array<{
			name: string;
			value: number;
			children?: Array<{
				name: string;
				value: number;
			}>;
		}>;
	}>,
	options: {
		title?: string;
		maxDepth?: number;
	} = {},
): MultiLevelPieData {
	const { title, maxDepth = 3 } = options;

	const levels: Array<{
		name: string;
		data: Array<{
			name: string;
			value: number;
			color?: string;
			children?: Array<{
				name: string;
				value: number;
				color?: string;
			}>;
		}>;
	}> = [];

	// Process hierarchy into levels
	hierarchy.forEach((rootItem, rootIndex) => {
		if (!levels[0]) {
			levels[0] = { name: "Level 1", data: [] };
		}

		levels[0].data.push({
			name: rootItem.name,
			value:
				rootItem.value ||
				(rootItem.children
					? rootItem.children.reduce((sum, child) => sum + child.value, 0)
					: 0),
			color: getSeriesColor(rootIndex),
			children: rootItem.children?.map((child, childIndex) => ({
				name: child.name,
				value: child.value,
				color: getSeriesColor(rootIndex * 10 + childIndex),
				children: maxDepth > 2 ? child.children : undefined,
			})),
		});

		// Add second level if children exist
		if (rootItem.children && maxDepth > 1) {
			if (!levels[1]) {
				levels[1] = { name: "Level 2", data: [] };
			}

			rootItem.children.forEach((child) => {
				levels[1].data.push({
					name: child.name,
					value: child.value,
					color: getSeriesColor(rootIndex * 10 + levels[1].data.length),
				});
			});
		}
	});

	return generateMultiLevelPieData(levels, { title });
}

/**
 * Generate sunburst-style multi-level pie
 */
export function generateSunburstMultiLevelPie(
	data: Array<{
		name: string;
		value: number;
		color?: string;
		children?: Array<{
			name: string;
			value: number;
			color?: string;
			children?: Array<{
				name: string;
				value: number;
				color?: string;
			}>;
		}>;
	}>,
	options: {
		title?: string;
		rings?: number;
	} = {},
): MultiLevelPieData {
	const { title, rings = 3 } = options;

	const levels: Array<{
		name: string;
		data: Array<{
			name: string;
			value: number;
			color?: string;
			children?: Array<{
				name: string;
				value: number;
				color?: string;
			}>;
		}>;
	}> = [];

	// Create levels based on hierarchy depth
	for (let depth = 0; depth < rings; depth++) {
		levels.push({
			name: `Ring ${depth + 1}`,
			data: [],
		});
	}

	// Populate levels
	function processItem(
		item: {
			name: string;
			value: number;
			color?: string;
			children?: Array<{
				name: string;
				value: number;
				color?: string;
				children?: Array<{
					name: string;
					value: number;
					color?: string;
				}>;
			}>;
		},
		depth: number = 0,
	) {
		if (depth >= rings) return;

		const levelData = levels[depth].data;
		const existingItem = levelData.find((d) => d.name === item.name);

		if (existingItem) {
			existingItem.value += item.value;
		} else {
			levelData.push({
				name: item.name,
				value: item.value,
				color: item.color || getSeriesColor(levelData.length),
				children:
					depth < rings - 1
						? item.children?.map((child) => ({
								name: child.name,
								value: child.value,
								color: child.color,
							}))
						: undefined,
			});
		}

		// Process children
		item.children?.forEach((child) => {
			processItem(child, depth + 1);
		});
	}

	data.forEach((item) => processItem(item, 0));

	return generateMultiLevelPieData(levels, { title });
}

/**
 * Generate concentric multi-level pie
 */
export function generateConcentricMultiLevelPie(
	data: Array<{
		name: string;
		values: number[]; // One value per level
		colors?: string[];
	}>,
	levelNames: string[],
	options: {
		title?: string;
		radiusIncrement?: number;
	} = {},
): MultiLevelPieData {
	const { title, radiusIncrement = 30 } = options;

	const levels = levelNames.map((levelName, levelIndex) => ({
		name: levelName,
		data: data
			.map((item, itemIndex) => ({
				name: item.name,
				value: item.values[levelIndex] || 0,
				color:
					item.colors?.[levelIndex] ||
					getSeriesColor(itemIndex * levelNames.length + levelIndex),
			}))
			.filter((item) => item.value > 0),
	}));

	return generateMultiLevelPieData(levels, { title });
}


