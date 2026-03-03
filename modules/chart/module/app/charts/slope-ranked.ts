import { generateSlopeData, type SlopeData } from './slope-data';

/**
 * Generate ranked slope chart
 */
export function generateRankedSlopeData(
	data: Array<{
		name: string;
		before: number;
		after: number;
		color?: string;
	}>,
	options: {
		title?: string;
		beforeLabel?: string;
		afterLabel?: string;
		sortBy?: "change" | "final" | "initial" | "name";
		showRanks?: boolean;
	} = {},
): SlopeData {
	const {
		title,
		beforeLabel = "Before",
		afterLabel = "After",
		sortBy = "change",
		showRanks = false,
	} = options;

	// Sort data
	let sortedData = [...data];
	switch (sortBy) {
		case "change":
			sortedData.sort((a, b) => b.after - b.before - (a.after - a.before));
			break;
		case "final":
			sortedData.sort((a, b) => b.after - a.after);
			break;
		case "initial":
			sortedData.sort((a, b) => b.before - a.before);
			break;
		case "name":
			sortedData.sort((a, b) => a.name.localeCompare(b.name));
			break;
	}

	const slopes = sortedData.map((item, index) => ({
		label: showRanks ? `${index + 1}. ${item.name}` : item.name,
		start: { x: beforeLabel, y: item.before },
		end: { x: afterLabel, y: item.after },
		color: item.color || getSeriesColor(index),
	}));

	return generateSlopeData(slopes, {
		title,
		showLabels: true,
		showValues: true,
	});
}

