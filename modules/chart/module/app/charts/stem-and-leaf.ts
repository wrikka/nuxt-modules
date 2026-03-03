import type { StemAndLeafData } from '@/module/app/types/chart-basic';

/**
 * Stem-and-leaf plot utilities - text-based distribution display
 */

/**
 * Generate stem-and-leaf plot data
 */
export function generateStemAndLeafData(
	data: number[],
	options: {
		title?: string;
		scale?: number; // multiplier for stems (e.g., 1, 10, 100)
		showKey?: boolean;
		sortLeaves?: boolean;
		showStats?: boolean;
	} = {},
): StemAndLeafData {
	const {
		title,
		scale = 1,
		showKey = true,
		sortLeaves = true,
		showStats = false,
	} = options;

	// Scale the data
	const scaledData = data.map((value) => Math.round(value / scale));

	// Group by stem (integer part)
	const stemGroups = new Map<number, number[]>();

	scaledData.forEach((value) => {
		const stem = Math.floor(Math.abs(value) / 10);
		const leaf = Math.abs(value) % 10;

		if (!stemGroups.has(stem)) {
			stemGroups.set(stem, []);
		}
		stemGroups.get(stem)!.push(leaf);
	});

	// Sort stems
	const sortedStems = Array.from(stemGroups.keys()).sort((a, b) => a - b);

	// Create stems array
	const stems = sortedStems.map((stem) => {
		let leaves = stemGroups.get(stem)!;

		if (sortLeaves) {
			leaves = leaves.sort((a, b) => a - b);
		}

		return {
			stem,
			leaves,
		};
	});

	return {
		title,
		stems,
	};
}

/**
 * Generate stem-and-leaf plot from arrays
 */
export function generateStemAndLeafFromArrays(
	values: number[],
	options: {
		title?: string;
		scale?: number;
		showKey?: boolean;
		sortLeaves?: boolean;
	} = {},
): StemAndLeafData {
	return generateStemAndLeafData(values, options);
}

/**
 * Generate back-to-back stem-and-leaf plot for comparison
 */
export function generateBackToBackStemAndLeaf(
	data1: number[],
	data2: number[],
	labels: [string, string] = ["Group 1", "Group 2"],
	options: {
		title?: string;
		scale?: number;
		showKey?: boolean;
	} = {},
): {
	title?: string;
	stems: Array<{
		stem: number;
		leaves1: number[];
		leaves2: number[];
	}>;
	labels: [string, string];
} {
	const { title, scale = 1, showKey = true } = options;

	// Scale the data
	const scaledData1 = data1.map((value) => Math.round(value / scale));
	const scaledData2 = data2.map((value) => Math.round(value / scale));

	// Group by stem for both datasets
	const stemGroups1 = new Map<number, number[]>();
	const stemGroups2 = new Map<number, number[]>();

	scaledData1.forEach((value) => {
		const stem = Math.floor(Math.abs(value) / 10);
		const leaf = Math.abs(value) % 10;
		if (!stemGroups1.has(stem)) stemGroups1.set(stem, []);
		stemGroups1.get(stem)!.push(leaf);
	});

	scaledData2.forEach((value) => {
		const stem = Math.floor(Math.abs(value) / 10);
		const leaf = Math.abs(value) % 10;
		if (!stemGroups2.has(stem)) stemGroups2.set(stem, []);
		stemGroups2.get(stem)!.push(leaf);
	});

	// Get all unique stems
	const allStems = new Set([...stemGroups1.keys(), ...stemGroups2.keys()]);
	const sortedStems = Array.from(allStems).sort((a, b) => a - b);

	// Create stems array
	const stems = sortedStems.map((stem) => ({
		stem,
		leaves1: stemGroups1.get(stem) || [],
		leaves2: stemGroups2.get(stem) || [],
	}));

	return {
		title,
		stems,
		labels,
	};
}

/**
 * Generate stem-and-leaf plot with detailed statistics
 */
export function generateStemAndLeafWithStats(
	data: number[],
	options: {
		title?: string;
		scale?: number;
		showKey?: boolean;
		sortLeaves?: boolean;
		includeStats?: boolean;
	} = {},
): StemAndLeafData & {
	stats?: {
		count: number;
		min: number;
		max: number;
		median: number;
		mean: number;
		mode: number[];
		range: number;
		standardDeviation: number;
	};
} {
	const stemData = generateStemAndLeafData(data, options);

	if (!options.includeStats) {
		return stemData;
	}

	// Calculate statistics
	const sortedData = [...data].sort((a, b) => a - b);
	const n = sortedData.length;

	const stats = {
		count: n,
		min: sortedData[0],
		max: sortedData[n - 1],
		median:
			n % 2 === 0
				? (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2
				: sortedData[Math.floor(n / 2)],
		mean: sortedData.reduce((sum, val) => sum + val, 0) / n,
		mode: calculateMode(sortedData),
		range: sortedData[n - 1] - sortedData[0],
		standardDeviation: calculateStandardDeviation(sortedData),
	};

	return {
		...stemData,
		stats,
	};
}

/**
 * Convert stem-and-leaf plot to text representation
 */
export function stemAndLeafToText(
	data: StemAndLeafData,
	options: {
		showKey?: boolean;
		maxLeafWidth?: number;
		alignLeaves?: "left" | "right";
	} = {},
): string {
	const { showKey = true, maxLeafWidth = 50, alignLeaves = "left" } = options;

	let text = "";

	if (data.title) {
		text += `${data.title}\n`;
		text += "=".repeat(data.title.length) + "\n\n";
	}

	// Find the maximum stem width for alignment
	const maxStemWidth = Math.max(
		...data.stems.map((s) => s.stem.toString().length),
	);

	data.stems.forEach(({ stem, leaves }) => {
		const stemStr = stem.toString().padStart(maxStemWidth, " ");
		const leavesStr = leaves.join("");

		let line = `${stemStr} | ${leavesStr}`;

		// Truncate if too long
		if (line.length > maxLeafWidth + 10) {
			line = line.substring(0, maxLeafWidth + 7) + "...";
		}

		text += line + "\n";
	});

	if (showKey) {
		text += "\nKey: 2|5 = 25\n";
	}

	return text;
}

/**
 * Convert back-to-back stem-and-leaf to text
 */
export function backToBackStemAndLeafToText(
	data: {
		title?: string;
		stems: Array<{
			stem: number;
			leaves1: number[];
			leaves2: number[];
		}>;
		labels: [string, string];
	},
	options: {
		maxWidth?: number;
	} = {},
): string {
	const { maxWidth = 80 } = options;

	let text = "";

	if (data.title) {
		text += `${data.title}\n`;
		text += "=".repeat(data.title.length) + "\n\n";
	}

	// Headers
	const header1 = data.labels[0];
	const header2 = data.labels[1];
	const stemHeader = "Stem";
	const midPoint = Math.floor(maxWidth / 2);

	text += " ".repeat(midPoint - header1.length - 1) + header1;
	text += " ".repeat(4) + stemHeader;
	text += " ".repeat(4) + header2 + "\n";

	data.stems.forEach(({ stem, leaves1, leaves2 }) => {
		const leaves1Str = leaves1
			.join("")
			.padStart(midPoint - stem.toString().length - 2, " ");
		const stemStr = stem.toString();
		const leaves2Str = leaves2.join("");

		text += `${leaves1Str}${stemStr}|${leaves2Str}\n`;
	});

	text += "\nKey: 2|5|7 = 25 (left), 27 (right)\n";

	return text;
}

/**
 * Calculate mode from array
 */
function calculateMode(data: number[]): number[] {
	const frequency = new Map<number, number>();
	data.forEach((val) => frequency.set(val, (frequency.get(val) || 0) + 1));

	const maxFreq = Math.max(...frequency.values());
	return Array.from(frequency.entries())
		.filter(([_, freq]) => freq === maxFreq)
		.map(([val, _]) => val);
}

/**
 * Calculate standard deviation
 */
function calculateStandardDeviation(data: number[]): number {
	const n = data.length;
	const mean = data.reduce((sum, val) => sum + val, 0) / n;
	const variance =
		data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
	return Math.sqrt(variance);
}

/**
 * Analyze stem-and-leaf plot distribution
 */
export function analyzeStemAndLeafDistribution(data: StemAndLeafData): {
	symmetry: "symmetric" | "right-skewed" | "left-skewed";
	centralTendency: number;
	spread: number;
	outliers: { stems: number[]; reason: string }[];
	shape: string;
} {
	const stems = data.stems;
	const stemValues = stems.map((s) => s.stem);
	const leafCounts = stems.map((s) => s.leaves.length);

	const totalLeaves = leafCounts.reduce((sum, count) => sum + count, 0);
	const medianStemIndex = Math.floor(stemValues.length / 2);
	const medianStem = stemValues[medianStemIndex];

	// Calculate weighted mean stem
	const weightedSum = stemValues.reduce(
		(sum, stem, i) => sum + stem * leafCounts[i],
		0,
	);
	const centralTendency = weightedSum / totalLeaves;

	// Calculate spread (range of stems)
	const spread = stemValues[stems.length - 1] - stemValues[0];

	// Analyze symmetry
	const leftHalf = leafCounts.slice(0, medianStemIndex);
	const rightHalf = leafCounts.slice(medianStemIndex + 1);

	const leftSum = leftHalf.reduce((sum, count) => sum + count, 0);
	const rightSum = rightHalf.reduce((sum, count) => sum + count, 0);

	let symmetry: "symmetric" | "right-skewed" | "left-skewed";
	if (Math.abs(leftSum - rightSum) / Math.max(leftSum, rightSum) < 0.2) {
		symmetry = "symmetric";
	} else if (leftSum > rightSum) {
		symmetry = "left-skewed";
	} else {
		symmetry = "right-skewed";
	}

	// Identify potential outliers
	const outliers: Array<{ stems: number[]; reason: string }> = [];
	const meanCount = totalLeaves / stemValues.length;
	const stdDev = Math.sqrt(
		leafCounts.reduce((sum, count) => sum + Math.pow(count - meanCount, 2), 0) /
			leafCounts.length,
	);

	stems.forEach((stem, index) => {
		const count = stem.leaves.length;
		if (count > meanCount + 2 * stdDev) {
			outliers.push({
				stems: [stem.stem],
				reason: `Unusually high frequency (${count} leaves)`,
			});
		}
	});

	// Determine shape
	let shape = "approximately normal";
	if (symmetry === "right-skewed") shape = "right-skewed distribution";
	else if (symmetry === "left-skewed") shape = "left-skewed distribution";
	else if (spread > stemValues.length * 0.8) shape = "wide distribution";
	else if (spread < stemValues.length * 0.3) shape = "narrow distribution";

	return {
		symmetry,
		centralTendency,
		spread,
		outliers,
		shape,
	};
}


