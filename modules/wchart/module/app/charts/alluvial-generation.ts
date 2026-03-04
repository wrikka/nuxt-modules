import type { AlluvialData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate alluvial diagram data
 */
export function generateAlluvialData(
	nodes: Array<{
		id: string;
		name: string;
		color?: string;
		group?: string;
	}>,
	links: Array<{
		source: string;
		target: string;
		value: number;
		color?: string;
		label?: string;
	}>,
	options: {
		title?: string;
		nodeWidth?: number;
		nodePadding?: number;
		align?: "left" | "right" | "center" | "justify";
		colorBy?: "source" | "target" | "value" | "group";
		sortBy?: "name" | "value" | "auto";
	} = {},
): AlluvialData {
	const {
		title,
		nodeWidth = 20,
		nodePadding = 8,
		align = "justify",
		colorBy = "source",
		sortBy = "auto",
	} = options;

	// Process nodes
	const processedNodes = nodes.map((node) => ({
		id: node.id,
		name: node.name,
		color: node.color || getSeriesColor(0),
		group: node.group,
	}));

	// Process links with colors
	const processedLinks = links.map((link) => {
		let color = link.color;

		if (!color) {
			switch (colorBy) {
				case "source":
					const sourceNode = processedNodes.find((n) => n.id === link.source);
					color = sourceNode?.color || getSeriesColor(0);
					break;
				case "target":
					const targetNode = processedNodes.find((n) => n.id === link.target);
					color = targetNode?.color || getSeriesColor(1);
					break;
				case "value":
					const intensity = Math.min(link.value / 100, 1);
					color = `hsl(${200 + intensity * 60}, 70%, 50%)`;
					break;
				case "group":
					color = getSeriesColor(
						Math.abs(
							link.source.split("").reduce((a, b) => a + b.charCodeAt(0), 0),
						) % 10,
					);
					break;
			}
		}

		return {
			source: link.source,
			target: link.target,
			value: link.value,
			color,
			label: link.label,
		};
	});

	return {
		title: title || "Alluvial Diagram",
		nodes: processedNodes,
		links: processedLinks,
	};
}

/**
 * Generate alluvial diagram from flow matrix
 */
export function generateAlluvialFromMatrix(
	sourceCategories: string[],
	targetCategories: string[],
	flowMatrix: number[][],
	options: {
		title?: string;
		sourceGroups?: string[];
		targetGroups?: string[];
		threshold?: number;
	} = {},
): AlluvialData {
	const {
		sourceGroups,
		targetGroups,
		threshold = 0,
		...otherOptions
	} = options;

	const nodes: Array<{
		id: string;
		name: string;
		color?: string;
		group?: string;
	}> = [];

	// Add source nodes
	sourceCategories.forEach((cat, index) => {
		nodes.push({
			id: `source-${index}`,
			name: cat,
			group: sourceGroups?.[index] || "source",
		});
	});

	// Add target nodes
	targetCategories.forEach((cat, index) => {
		nodes.push({
			id: `target-${index}`,
			name: cat,
			group: targetGroups?.[index] || "target",
		});
	});

	// Create links
	const links: Array<{
		source: string;
		target: string;
		value: number;
		color?: string;
		label?: string;
	}> = [];

	for (let i = 0; i < flowMatrix.length; i++) {
		for (let j = 0; j < flowMatrix[i].length; j++) {
			const value = flowMatrix[i][j];
			if (value > threshold) {
				links.push({
					source: `source-${i}`,
					target: `target-${j}`,
					value,
					label: value.toString(),
				});
			}
		}
	}

	return generateAlluvialData(nodes, links, otherOptions);
}

/**
 * Generate sankey-style alluvial (alternative layout)
 */
export function generateSankeyAlluvial(
	stages: Array<{
		name: string;
		items: Array<{
			name: string;
			value: number;
			color?: string;
		}>;
	}>,
	flows: Array<{
		fromStage: number;
		fromItem: number;
		toStage: number;
		toItem: number;
		value: number;
	}>,
	options: {
		title?: string;
	} = {},
): AlluvialData {
	const { title } = options;

	const nodes: Array<{
		id: string;
		name: string;
		color?: string;
		group?: string;
	}> = [];

	const links: Array<{
		source: string;
		target: string;
		value: number;
		color?: string;
	}> = [];

	// Create nodes for each stage
	stages.forEach((stage, stageIndex) => {
		stage.items.forEach((item, itemIndex) => {
			nodes.push({
				id: `stage-${stageIndex}-item-${itemIndex}`,
				name: item.name,
				color: item.color,
				group: stage.name,
			});
		});
	});

	// Create links from flows
	flows.forEach((flow) => {
		const sourceId = `stage-${flow.fromStage}-item-${flow.fromItem}`;
		const targetId = `stage-${flow.toStage}-item-${flow.toItem}`;

		links.push({
			source: sourceId,
			target: targetId,
			value: flow.value,
		});
	});

	return generateAlluvialData(nodes, links, { title });
}

/**
 * Generate alluvial from time series transitions
 */
export function generateAlluvialFromTransitions(
	timePoints: string[],
	categories: string[],
	transitionMatrix: number[][][], // [fromTime][fromCategory][toCategory]
	options: {
		title?: string;
		threshold?: number;
	} = {},
): AlluvialData {
	const { title, threshold = 0 } = options;

	const nodes: Array<{
		id: string;
		name: string;
		color?: string;
		group?: string;
	}> = [];

	const links: Array<{
		source: string;
		target: string;
		value: number;
		color?: string;
	}> = [];

	// Create nodes for each time point and category
	timePoints.forEach((time, timeIndex) => {
		categories.forEach((category, catIndex) => {
			nodes.push({
				id: `${timeIndex}-${catIndex}`,
				name: `${category} (${time})`,
				group: time,
			});
		});
	});

	// Create links from transitions
	timePoints.forEach((time, timeIndex) => {
		if (timeIndex < timePoints.length - 1) {
			transitionMatrix[timeIndex].forEach((fromTransitions, fromCatIndex) => {
				fromTransitions.forEach((value, toCatIndex) => {
					if (value > threshold) {
						links.push({
							source: `${timeIndex}-${fromCatIndex}`,
							target: `${timeIndex + 1}-${toCatIndex}`,
							value,
						});
					}
				});
			});
		}
	});

	return generateAlluvialData(nodes, links, { title });
}


