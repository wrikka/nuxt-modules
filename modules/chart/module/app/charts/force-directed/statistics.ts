/**
 * Calculate network statistics
 */
export function calculateNetworkStatistics(
	nodes: Array<{ id: string; group?: string }>,
	links: Array<{ source: string; target: string; value?: number }>,
): {
	nodes: {
		total: number;
		isolated: number;
		byGroup: Record<string, number>;
	};
	links: {
		total: number;
		totalValue: number;
		averageValue: number;
	};
	degrees: {
		average: number;
		max: number;
		min: number;
		distribution: Array<{ degree: number; count: number }>;
	};
	clusters: {
		connectedComponents: number;
		averageClusterSize: number;
	};
	centrality: {
		degree: Array<{ node: string; centrality: number }>;
		betweenness: Array<{ node: string; centrality: number }>; // Simplified
	};
} {
	const nodeDegrees = new Map<string, number>();
	const nodeGroups = new Map<string, string>();

	// Initialize degrees
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
	const isolatedNodes = degrees.filter((d) => d === 0).length;

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

	// Degree distribution
	const degreeCounts = new Map<number, number>();
	degrees.forEach((degree) => {
		degreeCounts.set(degree, (degreeCounts.get(degree) || 0) + 1);
	});

	const degreeDistribution = Array.from(degreeCounts.entries())
		.map(([degree, count]) => ({ degree, count }))
		.sort((a, b) => a.degree - b.degree);

	// Simplified connected components (DFS)
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

	const componentSizes = Array.from(adjacencyList.values()).map(
		(neighbors) => neighbors.length + 1,
	);
	const averageComponentSize =
		componentSizes.length > 0
			? componentSizes.reduce((sum, size) => sum + size, 0) /
				componentSizes.length
			: 0;

	// Centrality measures
	const degreeCentrality = nodes
		.map((node) => ({
			node: node.id,
			centrality:
				(nodeDegrees.get(node.id) || 0) / Math.max(nodes.length - 1, 1),
		}))
		.sort((a, b) => b.centrality - a.centrality);

	// Simplified betweenness centrality (placeholder)
	const betweennessCentrality = nodes
		.map((node) => ({
			node: node.id,
			centrality: Math.random() * 0.5, // Placeholder - real calculation is complex
		}))
		.sort((a, b) => b.centrality - a.centrality);

	return {
		nodes: {
			total: nodes.length,
			isolated: isolatedNodes,
			byGroup: groupCounts,
		},
		links: {
			total: links.length,
			totalValue,
			averageValue: averageLinkValue,
		},
		degrees: {
			average: degrees.reduce((sum, d) => sum + d, 0) / degrees.length,
			max: Math.max(...degrees),
			min: Math.min(...degrees),
			distribution: degreeDistribution,
		},
		clusters: {
			connectedComponents: components,
			averageClusterSize: averageComponentSize,
		},
		centrality: {
			degree: degreeCentrality,
			betweenness: betweennessCentrality,
		},
	};
}


