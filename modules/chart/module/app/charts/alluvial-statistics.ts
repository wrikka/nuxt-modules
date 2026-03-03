/**
 * Calculate alluvial statistics
 */
export function calculateAlluvialStatistics(
	nodes: Array<{ id: string; group?: string }>,
	links: Array<{ source: string; target: string; value: number }>,
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
	flow: {
		totalFlow: number;
		netFlows: Array<{ source: string; target: string; netFlow: number }>;
		efficiency: number; // Ratio of actual flow to maximum possible
	};
	conservation: {
		conserved: boolean;
		losses: Array<{ node: string; loss: number }>;
		gains: Array<{ node: string; gain: number }>;
	};
} {
	// Group statistics
	const groupCounts: Record<string, number> = {};
	nodes.forEach((node) => {
		const group = node.group || "ungrouped";
		groupCounts[group] = (groupCounts[group] || 0) + 1;
	});

	// Link statistics
	const linkValues = links.map((l) => l.value);
	const totalLinkValue = linkValues.reduce((sum, val) => sum + val, 0);
	const averageLinkValue = totalLinkValue / links.length;
	const maxLinkValue = Math.max(...linkValues);
	const minLinkValue = Math.min(...linkValues);

	// Flow analysis
	const nodeFlows = new Map<string, { incoming: number; outgoing: number }>();

	nodes.forEach((node) => {
		nodeFlows.set(node.id, { incoming: 0, outgoing: 0 });
	});

	links.forEach((link) => {
		const sourceFlow = nodeFlows.get(link.source)!;
		const targetFlow = nodeFlows.get(link.target)!;

		sourceFlow.outgoing += link.value;
		targetFlow.incoming += link.value;
	});

	// Calculate net flows
	const netFlows: Array<{ source: string; target: string; netFlow: number }> =
		[];
	links.forEach((link) => {
		const reverseLink = links.find(
			(l) => l.source === link.target && l.target === link.source,
		);
		const netFlow = link.value - (reverseLink?.value || 0);
		if (netFlow !== 0) {
			netFlows.push({
				source: link.source,
				target: link.target,
				netFlow,
			});
		}
	});

	// Flow efficiency (simplified)
	const maxPossibleFlow = Math.max(
		...Array.from(nodeFlows.values()).map((f) => f.incoming + f.outgoing),
	);
	const efficiency = maxPossibleFlow > 0 ? totalLinkValue / maxPossibleFlow : 0;

	// Conservation analysis
	const losses: Array<{ node: string; loss: number }> = [];
	const gains: Array<{ node: string; gain: number }> = [];

	nodeFlows.forEach((flow, nodeId) => {
		const net = flow.incoming - flow.outgoing;
		if (net < 0) {
			losses.push({ node: nodeId, loss: -net });
		} else if (net > 0) {
			gains.push({ node: nodeId, gain: net });
		}
	});

	const conserved = losses.length === 0 && gains.length === 0;

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
		flow: {
			totalFlow: totalLinkValue,
			netFlows,
			efficiency,
		},
		conservation: {
			conserved,
			losses,
			gains,
		},
	};
}


