import type { WordCloudData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Word cloud utilities and data generation
 */

/**
 * Generate word cloud data from words and sizes
 */
export function generateWordCloudData(
	words: Array<{ text: string; size: number; color?: string }>,
	options: {
		title?: string;
		colors?: string[];
		fontSize?: (word: string, index: number) => number;
		maxWords?: number;
		minSize?: number;
		maxSize?: number;
	} = {},
): WordCloudData {
	const {
		title,
		colors,
		fontSize,
		maxWords = 100,
		minSize = 10,
		maxSize = 60,
	} = options;

	// Limit number of words
	let processedWords = words.slice(0, maxWords);

	// Assign default colors if not provided
	processedWords = processedWords.map((word, index) => ({
		...word,
		color:
			word.color ||
			colors?.[index % colors.length] ||
			getSeriesColor(index % 10),
	}));

	// Calculate font sizes if not provided
	if (!fontSize) {
		const sizes = processedWords.map((w) => w.size);
		const minValue = Math.min(...sizes);
		const maxValue = Math.max(...sizes);
		const sizeRange = maxValue - minValue || 1;

		processedWords = processedWords.map((word) => ({
			...word,
			size:
				minSize + ((word.size - minValue) / sizeRange) * (maxSize - minSize),
		}));
	}

	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Word Cloud",
				data: processedWords.map((word) => ({
					x: word.text,
					y: word.size,
					label: word.text,
					color: word.color,
				})),
				type: "wordCloud",
			},
		],
	};

	return {
		...chartData,
		words: processedWords,
		colors,
		fontSize,
	};
}

/**
 * Generate word cloud from text
 */
export function generateWordCloudFromText(
	text: string,
	options: {
		title?: string;
		excludeWords?: string[];
		minWordLength?: number;
		maxWords?: number;
		caseSensitive?: boolean;
		colors?: string[];
	} = {},
): WordCloudData {
	const {
		title,
		excludeWords = [
			"the",
			"a",
			"an",
			"and",
			"or",
			"but",
			"in",
			"on",
			"at",
			"to",
			"for",
			"of",
			"with",
			"by",
		],
		minWordLength = 3,
		maxWords = 50,
		caseSensitive = false,
		colors,
	} = options;

	// Clean and split text
	const cleanText = text.replace(/[^\w\s]/g, " ").toLowerCase();
	const words = cleanText
		.split(/\s+/)
		.filter(
			(word) => word.length >= minWordLength && !excludeWords.includes(word),
		);

	// Count word frequencies
	const wordCount: Record<string, number> = {};
	words.forEach((word) => {
		const key = caseSensitive ? word : word.toLowerCase();
		wordCount[key] = (wordCount[key] || 0) + 1;
	});

	// Convert to word cloud format
	const wordCloudWords = Object.entries(wordCount)
		.sort(([, a], [, b]) => b - a)
		.slice(0, maxWords)
		.map(([text, size]) => ({ text, size }));

	return generateWordCloudData(wordCloudWords, { title, colors, maxWords });
}

/**
 * Generate word cloud from frequency map
 */
export function generateWordCloudFromFrequencyMap(
	frequencyMap: Record<string, number>,
	options: {
		title?: string;
		colors?: string[];
		maxWords?: number;
	} = {},
): WordCloudData {
	const { title, colors, maxWords = 100 } = options;

	const words = Object.entries(frequencyMap)
		.sort(([, a], [, b]) => b - a)
		.slice(0, maxWords)
		.map(([text, size]) => ({ text, size }));

	return generateWordCloudData(words, { title, colors, maxWords });
}

/**
 * Generate comparative word clouds
 */
export function generateComparativeWordClouds(
	wordSets: Array<{
		name: string;
		words: Array<{ text: string; size: number; color?: string }>;
	}>,
	options: {
		title?: string;
		maxWordsPerSet?: number;
	} = {},
): ChartData {
	const { title, maxWordsPerSet = 30 } = options;

	const series = wordSets.map((wordSet, setIndex) => ({
		name: wordSet.name,
		data: wordSet.words.slice(0, maxWordsPerSet).map((word) => ({
			x: word.text,
			y: word.size,
			label: word.text,
			color: word.color || getSeriesColor(setIndex),
		})),
		type: "wordCloud" as const,
	}));

	return {
		title,
		series,
	};
}

/**
 * Calculate word cloud statistics
 */
export function calculateWordCloudStats(
	words: Array<{ text: string; size: number }>,
): {
	totalWords: number;
	uniqueWords: number;
	averageSize: number;
	maxSize: number;
	minSize: number;
	sizeDistribution: { small: number; medium: number; large: number };
} {
	const totalWords = words.length;
	const uniqueWords = new Set(words.map((w) => w.text)).size;
	const sizes = words.map((w) => w.size);
	const averageSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
	const maxSize = Math.max(...sizes);
	const minSize = Math.min(...sizes);

	// Categorize sizes
	const small = words.filter((w) => w.size < averageSize * 0.7).length;
	const medium = words.filter(
		(w) => w.size >= averageSize * 0.7 && w.size <= averageSize * 1.3,
	).length;
	const large = words.filter((w) => w.size > averageSize * 1.3).length;

	return {
		totalWords,
		uniqueWords,
		averageSize,
		maxSize,
		minSize,
		sizeDistribution: { small, medium, large },
	};
}

/**
 * Generate word cloud with custom layout
 */
export function generateWordCloudWithLayout(
	words: Array<{ text: string; size: number; color?: string }>,
	layout: "spiral" | "rectangular" | "random" = "spiral",
	options: {
		title?: string;
		width?: number;
		height?: number;
	} = {},
): WordCloudData {
	const { title, width = 800, height = 600 } = options;

	// In a real implementation, you would calculate positions based on layout algorithm
	// For now, we'll just generate the basic word cloud data
	const wordCloudData = generateWordCloudData(words, { title });

	// Add layout information
	return {
		...wordCloudData,
		layout,
		dimensions: { width, height },
	};
}

/**
 * Extract keywords from text using simple frequency analysis
 */
export function extractKeywords(
	text: string,
	options: {
		maxKeywords?: number;
		minOccurrences?: number;
		excludeWords?: string[];
	} = {},
): Array<{ text: string; size: number }> {
	const {
		maxKeywords = 20,
		minOccurrences = 2,
		excludeWords = [
			"the",
			"a",
			"an",
			"and",
			"or",
			"but",
			"in",
			"on",
			"at",
			"to",
			"for",
			"of",
			"with",
			"by",
			"is",
			"are",
			"was",
			"were",
		],
	} = options;

	const words = text
		.toLowerCase()
		.replace(/[^\w\s]/g, " ")
		.split(/\s+/)
		.filter((word) => word.length > 2 && !excludeWords.includes(word));

	const frequency: Record<string, number> = {};
	words.forEach((word) => {
		frequency[word] = (frequency[word] || 0) + 1;
	});

	return Object.entries(frequency)
		.filter(([, count]) => count >= minOccurrences)
		.sort(([, a], [, b]) => b - a)
		.slice(0, maxKeywords)
		.map(([text, size]) => ({ text, size }));
}


