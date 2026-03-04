import type { CirclePackingData } from '@/module/app/types/chart-basic';
import { calculateHierarchyValue } from './circle-packing-layout';

/**
 * Calculate circle packing statistics
 */
export function calculateCirclePackingStatistics(
	hierarchy: CirclePackingData["hierarchy"],
): {
	totalNodes: number;
	maxDepth: number;
	totalValue: number;
	averageValue: number;
	valueDistribution: {
		min: number;
		max: number;
		median: number;
		quartiles: { q1: number; q3: number };
	};
	depthDistribution: Array<{
		depth: number;
		count: number;
		totalValue: number;
	}>;
	largestNodes: Array<{ name: string; value: number; depth: number }>;
} {
	const allNodes: Array<{
		name: string;
		value: number;
		depth: number;
	}> = [];

	let maxDepth = 0;
	let totalNodes = 0;

	function traverse(
		node: CirclePackingData["hierarchy"][0],
		depth: number = 0,
	) {
		maxDepth = Math.max(maxDepth, depth);
		totalNodes++;

		const value =
			node.value ||
			(node.children ? calculateHierarchyValue(node.children) : 0);
		allNodes.push({
			name: node.name,
			value,
			depth,
		});

		if (node.children) {
			node.children.forEach((child) => traverse(child, depth + 1));
		}
	}

	hierarchy.forEach((node) => traverse(node, 0));

	const values = allNodes.map((node) => node.value);
	const totalValue = values.reduce((sum, val) => sum + val, 0);
	const averageValue = totalValue / values.length;

	const sortedValues = [...values].sort((a, b) => a - b);
	const min = sortedValues[0];
	const max = sortedValues[sortedValues.length - 1];
	const median = sortedValues[Math.floor(sortedValues.length / 2)];

	const q1 = sortedValues[Math.floor(sortedValues.length / 4)];
	const q3 = sortedValues[Math.floor((3 * sortedValues.length) / 4)];

	// Depth distribution
	const depthDistribution = [];
	for (let depth = 0; depth <= maxDepth; depth++) {
		const nodesAtDepth = allNodes.filter((node) => node.depth === depth);
		const totalValueAtDepth = nodesAtDepth.reduce(
			(sum, node) => sum + node.value,
			0,
		);

		depthDistribution.push({
			depth,
			count: nodesAtDepth.length,
			totalValue: totalValueAtDepth,
		});
	}

	// Largest nodes
	const largestNodes = [...allNodes]
		.sort((a, b) => b.value - a.value)
		.slice(0, 10);

	return {
		totalNodes,
		maxDepth,
		totalValue,
		averageValue,
		valueDistribution: {
			min,
			max,
			median,
			quartiles: { q1, q3 },
		},
		depthDistribution,
		largestNodes,
	};
}


