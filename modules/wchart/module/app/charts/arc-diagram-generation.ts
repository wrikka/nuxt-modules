import type { ArcDiagramData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { calculateArcDiagramLayout } from './arc-diagram-layout';

/**
 * Generate arc diagram data
 */
export function generateArcDiagramData(
	nodes: Array<{
		id: string;
		name: string;
		color?: string;
		size?: number;
		group?: string;
	}>,
	links: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
		strength?: number;
	}>,
	options: {
		title?: string;
		sortBy?: "name" | "degree" | "group" | "none";
		showLabels?: boolean;
		labelPosition?: "top" | "bottom";
		arcHeight?: number;
		nodeSpacing?: number;
		colorBy?: "group" | "degree" | "none";
	} = {},
): ArcDiagramData {
	const {
		title,
		sortBy = "name",
		showLabels = true,
		labelPosition = "bottom",
		arcHeight = 50,
		nodeSpacing = 20,
		colorBy = "group",
	} = options;

	// Calculate node degrees for sorting/coloring
	const nodeDegrees = new Map<string, number>();
	nodes.forEach((node) => nodeDegrees.set(node.id, 0));

	links.forEach((link) => {
		nodeDegrees.set(link.source, (nodeDegrees.get(link.source) || 0) + 1);
		nodeDegrees.set(link.target, (nodeDegrees.get(link.target) || 0) + 1);
	});

	// Sort nodes
	let sortedNodes = [...nodes];
	switch (sortBy) {
		case "name":
			sortedNodes.sort((a, b) => a.name.localeCompare(b.name));
			break;
		case "degree":
			sortedNodes.sort(
				(a, b) => (nodeDegrees.get(b.id) || 0) - (nodeDegrees.get(a.id) || 0),
			);
			break;
		case "group":
			sortedNodes.sort((a, b) => (a.group || "").localeCompare(b.group || ""));
			break;
		case "none":
		default:
			// Keep original order
			break;
	}

	// Assign colors based on strategy
	const processedNodes = sortedNodes.map((node, index) => {
		let color = node.color;
		const degree = nodeDegrees.get(node.id) || 0;

		if (!color) {
			switch (colorBy) {
				case "group":
					color = node.group
						? getSeriesColor(
								node.group.split("").reduce((a, b) => a + b.charCodeAt(0), 0) %
									10,
							)
						: getSeriesColor(index);
					break;
				case "degree":
					const intensity = Math.min(degree / 10, 1);
					color = `hsl(${240 - intensity * 240}, 70%, 50%)`;
					break;
				default:
					color = getSeriesColor(index);
			}
		}

		return {
			id: node.id,
			name: node.name,
			color,
			size: node.size || Math.max(3, Math.sqrt(degree) * 2),
			group: node.group,
			degree,
		};
	});

	// Process links
	const processedLinks = links.map((link) => ({
		source: link.source,
		target: link.target,
		value: link.value,
		color: link.color || "#999",
		strength: link.strength || link.value || 1,
		width: Math.max(1, Math.sqrt(link.strength || link.value || 1)),
	}));

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Arc Diagram",
				data: [],
				type: "arcDiagram" as const,
			},
		],
	};

	return {
		...chartData,
		nodes: processedNodes,
		links: processedLinks,
	};
}

/**
 * Generate arc diagram from matrix
 */
export function generateArcDiagramFromMatrix(
	nodeNames: string[],
	matrix: number[][],
	options: {
		title?: string;
		threshold?: number;
		nodeGroups?: string[];
	} = {},
): ArcDiagramData {
	const { threshold = 0, nodeGroups, ...otherOptions } = options;

	const nodes = nodeNames.map((name, index) => ({
		id: name,
		name,
		group: nodeGroups?.[index],
		color: undefined,
		size: undefined,
	}));

	const links: Array<{
		source: string;
		target: string;
		value?: number;
		color?: string;
		strength?: number;
	}> = [];

	for (let i = 0; i < matrix.length; i++) {
		for (let j = i + 1; j < matrix[i].length; j++) {
			const value = matrix[i][j];
			if (value > threshold) {
				links.push({
					source: nodeNames[i],
					target: nodeNames[j],
					value,
					strength: value,
				});
			}
		}
	}

	return generateArcDiagramData(nodes, links, otherOptions);
}

/**
 * Generate hierarchical arc diagram
 */
export function generateHierarchicalArcDiagram(
	hierarchy: Array<{
		id: string;
		name: string;
		level: number;
		parent?: string;
		color?: string;
		size?: number;
	}>,
	links: Array<{
		source: string;
		target: string;
		value?: number;
		type?: "parent-child" | "sibling" | "cross-level";
	}>,
	options: {
		title?: string;
		levels?: number;
	} = {},
): ArcDiagramData {
	const { title, levels } = options;

	// Group nodes by level
	const levelGroups = new Map<
		number,
		Array<{
			id: string;
			name: string;
			level: number;
			parent?: string;
			color?: string;
			size?: number;
		}>
	>();

	hierarchy.forEach((node) => {
		const level = node.level;
		if (!levelGroups.has(level)) {
			levelGroups.set(level, []);
		}
		levelGroups.get(level)!.push(node);
	});

	// Sort within each level
	levelGroups.forEach((nodes) => {
		nodes.sort((a, b) => a.name.localeCompare(b.name));
	});

	// Flatten nodes with level-based positioning
	const nodes: Array<{
		id: string;
		name: string;
		color?: string;
		size?: number;
		group?: string;
	}> = [];

	levelGroups.forEach((levelNodes, level) => {
		levelNodes.forEach((node) => {
			nodes.push({
				id: node.id,
				name: node.name,
				color: node.color,
				size: node.size,
				group: `Level ${level}`,
			});
		});
	});

	return generateArcDiagramData(nodes, links, { title });
}

/**
 * Generate arc diagram with bundling
 */
export function generateBundledArcDiagram(
	nodes: Array<{
		id: string;
		name: string;
		group?: string;
		color?: string;
	}>,
	links: Array<{
		source: string;
		target: string;
		value?: number;
		group?: string;
	}>,
	options: {
		title?: string;
		bundleBy?: "group" | "strength" | "none";
	} = {},
): ArcDiagramData {
	const { title, bundleBy = "none" } = options;

	// Group links for bundling
	if (bundleBy !== "none") {
		const bundledLinks: Array<{
			source: string;
			target: string;
			value?: number;
			color?: string;
			strength?: number;
			group?: string;
		}> = [];

		const linkGroups = new Map<
			string,
			Array<{
				source: string;
				target: string;
				value?: number;
				group?: string;
			}>
		>();

		links.forEach((link) => {
			let groupKey = "default";
			if (bundleBy === "group" && link.group) {
				groupKey = link.group;
			} else if (bundleBy === "strength") {
				const strength = link.value || 1;
				groupKey = strength > 5 ? "strong" : strength > 2 ? "medium" : "weak";
			}

			const linkKey = `${link.source}-${link.target}`;
			if (!linkGroups.has(linkKey)) {
				linkGroups.set(linkKey, []);
			}
			linkGroups.get(linkKey)!.push(link);
		});

		// Aggregate links within groups
		linkGroups.forEach((groupLinks) => {
			if (groupLinks.length > 0) {
				const firstLink = groupLinks[0];
				const totalValue = groupLinks.reduce(
					(sum, link) => sum + (link.value || 1),
					0,
				);

				bundledLinks.push({
					source: firstLink.source,
					target: firstLink.target,
					value: totalValue,
					strength: totalValue,
					group: firstLink.group,
				});
			}
		});

		return generateArcDiagramData(nodes, bundledLinks, { title });
	}

	return generateArcDiagramData(nodes, links, { title });
}


