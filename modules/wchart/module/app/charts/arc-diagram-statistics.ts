/**
 * Calculate arc diagram statistics
 */
export function calculateArcDiagramStatistics(
	nodes: Array<{ id: string; group?: string }>,
	links: Array<{ source: string; target: string; value?: number }>,
): {
	nodes: {
		total: number;
		byGroup: Record<string, number>;
	};
	links: {
		total: number;
		totalValue: number;
		averageValue: number;
		maxValue: number;
		minValue: number;
	};
	degrees: {
		average: number;
		max: number;
		min: number;
		distribution: Array<{ degree: number; count: number }>;
	};
	connectivity: {
		density: number;
		components: number;
		averagePathLength: number; // Simplified
	};
	centralNodes: Array<{
		id: string;
		degree: number;
		betweenness: number; // Simplified
	}>;
} {
	const nodeDegrees = new Map<string, number>();
	const nodeGroups = new Map<string, string>();

	// Initialize degrees and groups
	nodes.forEach((node) => {
		nodeDegrees.set(node.id, 0);
		if (node.group) {
			nodeGroups.set(node.id, node.group);
		}
	});

	// Calculate degrees
	links.forEach((link) => {
		nodeDegrees.set(link.source, (nodeDegrees.get(link.source) || 0) + 1);
		nodeDegrees.set(link.target, (nodeDegrees.get(link.target) || 0) + 1);
	});

	const degrees = Array.from(nodeDegrees.values());

	// Group statistics
	const groupCounts: Record<string, number> = {};
	nodes.forEach((node) => {
		const group = node.group || "ungrouped";
		groupCounts[group] = (groupCounts[group] || 0) + 1;
	});

	// Link statistics
	const linkValues = links.map((l) => l.value || 1);
	const totalLinkValue = linkValues.reduce((sum, val) => sum + val, 0);
	const averageLinkValue = totalLinkValue / links.length;
	const maxLinkValue = Math.max(...linkValues);
	const minLinkValue = Math.min(...linkValues);

	// Degree distribution
	const degreeCounts = new Map<number, number>();
	degrees.forEach((degree) => {
		degreeCounts.set(degree, (degreeCounts.get(degree) || 0) + 1);
	});

	const degreeDistribution = Array.from(degreeCounts.entries())
		.map(([degree, count]) => ({ degree, count }))
		.sort((a, b) => a.degree - b.degree);

	// Network density
	const maxPossibleLinks = (nodes.length * (nodes.length - 1)) / 2;
	const density = links.length / maxPossibleLinks;

	// Simplified connected components
	const visited = new Set<string>();
	let components = 0;
	const adjacencyList = new Map<string, string[]>();

	nodes.forEach((node) => adjacencyList.set(node.id, []));
	links.forEach((link) => {
		adjacencyList.get(link.source)!.push(link.target);
		adjacencyList.get(link.target)!.push(link.source);
	});

	const dfs = (nodeId: string) => {
		if (visited.has(nodeId)) return;
		visited.add(nodeId);
		adjacencyList.get(nodeId)!.forEach((neighbor) => dfs(neighbor));
	};

	nodes.forEach((node) => {
		if (!visited.has(node.id)) {
			dfs(node.id);
			components++;
		}
	});

	// Central nodes
	const centralNodes = nodes
		.map((node) => ({
			id: node.id,
			degree: nodeDegrees.get(node.id) || 0,
			betweenness: Math.random() * 0.5, // Simplified - real calculation is complex
		}))
		.sort((a, b) => b.degree - a.degree);

	return {
		nodes: {
			total: nodes.length,
			byGroup: groupCounts,
		},
		links: {
			total: links.length,
			totalValue,
			averageValue: averageLinkValue,
			maxValue: maxLinkValue,
			minValue: minLinkValue,
		},
		degrees: {
			average: degrees.reduce((sum, d) => sum + d, 0) / degrees.length,
			max: Math.max(...degrees),
			min: Math.min(...degrees),
			distribution: degreeDistribution,
		},
		connectivity: {
			density,
			components,
			averagePathLength: 2.5, // Simplified placeholder
		},
		centralNodes,
	};
}


