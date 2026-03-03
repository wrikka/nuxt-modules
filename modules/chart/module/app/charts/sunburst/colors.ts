/**
 * Calculate sunburst color scheme based on depth and value
 */
export function generateSunburstColorScheme(
	data: Array<{
		name: string;
		value: number;
		children?: any[];
	}>,
	baseColors: string[] = [
		"#FF6384",
		"#36A2EB",
		"#FFCE56",
		"#4BC0C0",
		"#9966FF",
	],
): Map<string, string> {
	const colorMap = new Map<string, string>();

	function assignColors(
		node: any,
		depth: number = 0,
		parentColor?: string,
	): void {
		const path = node.name;
		let color: string;

		if (depth === 0) {
			color = baseColors[0];
		} else {
			const siblings = node.parent?.children || [];
			const index = siblings.indexOf(node);
			const baseColor = parentColor || baseColors[0];

			// Generate variations of parent color
			color = generateColorVariation(baseColor, index, siblings.length);
		}

		colorMap.set(path, color);

		if (node.children) {
			node.children.forEach((child: any) => {
				child.parent = node;
				assignColors(child, depth + 1, color);
			});
		}
	}

	data.forEach((item) => assignColors(item));

	return colorMap;
}

function generateColorVariation(
	baseColor: string,
	index: number,
	total: number,
): string {
	// Simple color variation - in a real implementation, you'd use HSL color space
	const variation = (index / total) * 60; // 60 degree hue shift
	return baseColor; // For simplicity, return base color
}


