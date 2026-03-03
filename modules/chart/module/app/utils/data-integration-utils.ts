import type { DataPoint } from '@/module/app/types/chart-basic';

/**
 * Default data transformation for raw data
 */
export const defaultTransform = (rawData: any): DataPoint[] => {
	if (Array.isArray(rawData)) {
		return rawData.map((item, index) => ({
			x: index,
			y: typeof item === "number" ? item : item.value || item.y || 0,
		}));
	}

	if (
		typeof rawData === "object" &&
		rawData.data &&
		Array.isArray(rawData.data)
	) {
		return rawData.data.map((item: any, index: number) => ({
			x: item.x || item.timestamp || item.date || index,
			y: item.y || item.value || item.count || 0,
			label: item.label || item.name,
		}));
	}

	return [];
};

/**
 * Split array into chunks
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
};

/**
 * Get color for data source by index
 */
export const getSourceColor = (index: number): string => {
	const colors = [
		"#4a90e2",
		"#7ed321",
		"#f5a623",
		"#d0021b",
		"#9013fe",
		"#50e3c2",
		"#b8e986",
		"#f8e71c",
		"#ff6b6b",
		"#bd10e0",
	];
	return colors[index % colors.length];
};
