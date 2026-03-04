/**
 * Generate sunburst zoom levels
 */
export function generateSunburstZoomLevels(
	data: Array<{
		name: string;
		value: number;
		children?: any[];
	}>,
	maxZoomLevel: number = 3,
): Array<{
	level: number;
	data: Array<{
		name: string;
		value: number;
		children?: any[];
	}>;
}> {
	const levels: Array<{
		level: number;
		data: Array<{
			name: string;
			value: number;
			children?: any[];
		}>;
	}> = [];

	for (let level = 0; level <= maxZoomLevel; level++) {
		const levelData = data
			.map((item) => getNodeAtDepth(item, level))
			.filter((item) => item !== null) as any[];

		levels.push({
			level,
			data: levelData,
		});
	}

	return levels;
}

function getNodeAtDepth(
	node: any,
	targetDepth: number,
	currentDepth: number = 0,
): any {
	if (currentDepth === targetDepth) {
		return {
			name: node.name,
			value: node.value,
			children: node.children
				? node.children.map((child: any) => ({
						name: child.name,
						value: child.value,
					}))
				: undefined,
		};
	}

	if (node.children && currentDepth < targetDepth) {
		const childResults = node.children
			.map((child: any) => getNodeAtDepth(child, targetDepth, currentDepth + 1))
			.filter((result: any) => result !== null);

		if (childResults.length > 0) {
			return {
				name: node.name,
				value: node.value,
				children: childResults,
			};
		}
	}

	return null;
}


