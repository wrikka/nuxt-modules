/**
 * Calculate sunburst arc angles
 */
export function calculateSunburstAngles(
	data: Array<{
		name: string;
		value: number;
		children?: any[];
	}>,
): Array<{
	name: string;
	value: number;
	startAngle: number;
	endAngle: number;
	depth: number;
	path: string[];
}> {
	const total = data.reduce((sum, item) => sum + item.value, 0);
	let currentAngle = 0;

	function processNode(
		node: any,
		depth: number = 0,
		path: string[] = [],
	): Array<{
		name: string;
		value: number;
		startAngle: number;
		endAngle: number;
		depth: number;
		path: string[];
	}> {
		const currentPath = [...path, node.name];
		const angle = (node.value / total) * 2 * Math.PI;

		const result = [
			{
				name: node.name,
				value: node.value,
				startAngle: currentAngle,
				endAngle: currentAngle + angle,
				depth,
				path: currentPath,
			},
		];

		currentAngle += angle;

		if (node.children && node.children.length > 0) {
			const childTotal = node.children.reduce(
				(sum: number, child: any) => sum + child.value,
				0,
			);
			let childAngle = result[0].startAngle;

			node.children.forEach((child: any) => {
				const childAngleSize = (child.value / childTotal) * angle;
				result.push(
					...processNode(child, depth + 1, currentPath).map((item) => ({
						...item,
						startAngle: childAngle,
						endAngle: childAngle + childAngleSize,
					})),
				);
				childAngle += childAngleSize;
			});
		}

		return result;
	}

	const results: Array<{
		name: string;
		value: number;
		startAngle: number;
		endAngle: number;
		depth: number;
		path: string[];
	}> = [];

	data.forEach((item) => {
		results.push(...processNode(item, 0, []));
	});

	return results;
}

/**
 * Calculate sunburst radii for different depths
 */
export function calculateSunburstRadii(
	depths: number[],
	centerRadius: number = 0,
	maxRadius: number = 100,
): Record<number, { innerRadius: number; outerRadius: number }> {
	const maxDepth = Math.max(...depths);
	const radiusStep = (maxRadius - centerRadius) / (maxDepth + 1);

	const radii: Record<number, { innerRadius: number; outerRadius: number }> =
		{};

	for (let depth = 0; depth <= maxDepth; depth++) {
		const innerRadius = centerRadius + depth * radiusStep;
		const outerRadius = centerRadius + (depth + 1) * radiusStep;

		radii[depth] = { innerRadius, outerRadius };
	}

	return radii;
}


