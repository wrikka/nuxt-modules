/**
 * Sunburst node interface
 */
export interface SunburstNode {
	name: string;
	value: number;
	children?: SunburstNode[];
}

/**
 * Find sunburst chart paths from root to leaf
 */
export function findSunburstPaths(
	data: SunburstNode[],
	targetLeaf: string,
): string[][] {
	const paths: string[][] = [];

	function findPaths(node: SunburstNode, currentPath: string[] = []): void {
		const newPath = [...currentPath, node.name];

		if (node.name === targetLeaf) {
			paths.push(newPath);
		}

		if (node.children) {
			node.children.forEach((child: SunburstNode) => findPaths(child, newPath));
		}
	}

	data.forEach((item) => findPaths(item));
	return paths;
}

/**
 * Calculate sunburst chart statistics
 */
export function calculateSunburstStats(data: SunburstNode[]): {
	totalValue: number;
	maxDepth: number;
	leafNodes: number;
	branchNodes: number;
	averageBranchingFactor: number;
	largestSegment: { name: string; value: number; percentage: number };
	smallestSegment: { name: string; value: number; percentage: number };
} {
	let totalValue = 0;
	let maxDepth = 0;
	let leafNodes = 0;
	let branchNodes = 0;
	let totalBranchingFactor = 0;
	let largestSegment = { name: "", value: -Infinity, percentage: 0 };
	let smallestSegment = { name: "", value: Infinity, percentage: 0 };

	function processNode(node: any, depth: number = 0): void {
		totalValue += node.value;
		maxDepth = Math.max(maxDepth, depth);

		if (node.children && node.children.length > 0) {
			branchNodes++;
			totalBranchingFactor += node.children.length;

			node.children.forEach((child: any) => processNode(child, depth + 1));
		} else {
			leafNodes++;
		}

		const percentage = totalValue > 0 ? (node.value / totalValue) * 100 : 0;

		if (node.value > largestSegment.value) {
			largestSegment = { name: node.name, value: node.value, percentage };
		}

		if (node.value < smallestSegment.value) {
			smallestSegment = { name: node.name, value: node.value, percentage };
		}
	}

	data.forEach((item) => processNode(item));

	const averageBranchingFactor =
		branchNodes > 0 ? totalBranchingFactor / branchNodes : 0;

	return {
		totalValue,
		maxDepth,
		leafNodes,
		branchNodes,
		averageBranchingFactor,
		largestSegment,
		smallestSegment,
	};
}

/**
 * Normalize sunburst values to percentages
 */
export function normalizeSunburstData(
	data: Array<{
		name: string;
		value: number;
		children?: any[];
	}>,
): Array<{
	name: string;
	value: number;
	percentage: number;
	children?: any[];
}> {
	const total = data.reduce((sum, item) => sum + item.value, 0);

	function processNode(node: any): any {
		const percentage = total > 0 ? (node.value / total) * 100 : 0;

		return {
			...node,
			percentage,
			children: node.children ? node.children.map(processNode) : undefined,
		};
	}

	return data.map(processNode);
}

/**
 * Filter sunburst data by minimum value
 */
export function filterSunburstData(
	data: Array<{
		name: string;
		value: number;
		children?: any[];
	}>,
	minValue: number,
): Array<{
	name: string;
	value: number;
	children?: any[];
}> {
	function processNode(node: any): any {
		if (node.value < minValue) return null;

		const filteredChildren = node.children
			? node.children.map(processNode).filter((child: any) => child !== null)
			: undefined;

		return {
			...node,
			children: filteredChildren,
		};
	}

	return data.map(processNode).filter((node) => node !== null);
}


