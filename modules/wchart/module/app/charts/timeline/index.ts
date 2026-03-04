import type { TimelineData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Timeline chart utilities and data generation
 */

/**
 * Generate timeline chart data from events
 */
export function generateTimelineData(
	events: Array<{
		date: Date;
		title: string;
		description?: string;
		color?: string;
		category?: string;
	}>,
	options: {
		title?: string;
		showDescriptions?: boolean;
		sortByDate?: boolean;
		groupByCategory?: boolean;
		orientation?: "horizontal" | "vertical";
	} = {},
): TimelineData {
	const {
		title,
		showDescriptions = false,
		sortByDate = true,
		groupByCategory = false,
		orientation = "horizontal",
	} = options;

	// Sort events by date if requested
	let sortedEvents = events;
	if (sortByDate) {
		sortedEvents = [...events].sort(
			(a, b) => a.date.getTime() - b.date.getTime(),
		);
	}

	// Group by category if requested
	if (groupByCategory) {
		const groupedEvents: Record<string, typeof events> = {};
		sortedEvents.forEach((event) => {
			const category = event.category || "General";
			if (!groupedEvents[category]) {
				groupedEvents[category] = [];
			}
			groupedEvents[category].push(event);
		});

		// Convert grouped events to series
		const series = Object.entries(groupedEvents).map(
			([category, categoryEvents], index) => ({
				name: category,
				data: categoryEvents.map((event) => ({
					x: event.date,
					y: index, // Use category index for positioning
					label: event.title,
					color: event.color || getSeriesColor(index),
				})),
				type: "timeline" as const,
			}),
		);

		return {
			title,
			series,
			events: sortedEvents,
		};
	}

	// Single timeline
	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Timeline",
				data: sortedEvents.map((event, index) => ({
					x: event.date,
					y: 0, // All events on same line
					label:
						showDescriptions && event.description
							? `${event.title}: ${event.description}`
							: event.title,
					color: event.color || getSeriesColor(index % 10),
				})),
				type: "timeline",
			},
		],
	};

	return {
		...chartData,
		events: sortedEvents,
	};
}

/**
 * Generate timeline from date strings
 */
export function generateTimelineFromDateStrings(
	dates: string[],
	titles: string[],
	descriptions?: string[],
	options: {
		title?: string;
		showDescriptions?: boolean;
		sortByDate?: boolean;
		colors?: string[];
	} = {},
): TimelineData {
	const { colors, ...otherOptions } = options;

	const events = dates.map((dateStr, index) => ({
		date: new Date(dateStr),
		title: titles[index],
		description: descriptions?.[index],
		color: colors?.[index],
	}));

	return generateTimelineData(events, otherOptions);
}

/**
 * Generate project timeline
 */
export function generateProjectTimeline(
	milestones: Array<{
		name: string;
		date: Date;
		status: "planned" | "completed" | "in-progress" | "delayed";
		description?: string;
	}>,
	options: {
		title?: string;
		showCompleted?: boolean;
		showDescriptions?: boolean;
	} = {},
): TimelineData {
	const { title, showCompleted = true, showDescriptions = false } = options;

	const statusColors = {
		planned: "#2196F3",
		completed: "#4CAF50",
		"in-progress": "#FFC107",
		delayed: "#F44336",
	};

	const events = milestones.map((milestone) => ({
		date: milestone.date,
		title: milestone.name,
		description: milestone.description,
		color: statusColors[milestone.status],
		category: milestone.status,
	}));

	return generateTimelineData(events, {
		title,
		showDescriptions,
		sortByDate: true,
		groupByCategory: true,
	});
}

/**
 * Generate historical timeline
 */
export function generateHistoricalTimeline(
	events: Array<{
		year: number;
		title: string;
		description?: string;
		category?: string;
	}>,
	options: {
		title?: string;
		showDescriptions?: boolean;
		groupByCategory?: boolean;
	} = {},
): TimelineData {
	const { title, showDescriptions = true, groupByCategory = false } = options;

	const timelineEvents = events.map((event) => ({
		date: new Date(event.year, 0, 1), // January 1st of the year
		title: `${event.year}: ${event.title}`,
		description: event.description,
		category: event.category,
	}));

	return generateTimelineData(timelineEvents, {
		title,
		showDescriptions,
		sortByDate: true,
		groupByCategory,
	});
}

/**
 * Generate biographical timeline
 */
export function generateBiographicalTimeline(
	lifeEvents: Array<{
		date: Date;
		event: string;
		age?: number;
		location?: string;
	}>,
	personName: string,
	options: {
		showAge?: boolean;
		showLocation?: boolean;
	} = {},
): TimelineData {
	const { showAge = false, showLocation = false } = options;

	const events = lifeEvents.map((lifeEvent) => ({
		date: lifeEvent.date,
		title: lifeEvent.event,
		description: [
			showAge && lifeEvent.age ? `Age: ${lifeEvent.age}` : "",
			showLocation && lifeEvent.location
				? `Location: ${lifeEvent.location}`
				: "",
		]
			.filter(Boolean)
			.join(", "),
		color: getSeriesColor(Math.floor(Math.random() * 10)),
	}));

	return generateTimelineData(events, {
		title: `${personName}'s Life Timeline`,
		showDescriptions: showAge || showLocation,
		sortByDate: true,
	});
}

/**
 * Calculate timeline statistics
 */
export function calculateTimelineStats(events: Array<{ date: Date }>): {
	totalEvents: number;
	dateRange: { start: Date; end: Date; days: number };
	eventsPerYear: number;
	density: "sparse" | "normal" | "dense";
} {
	const totalEvents = events.length;

	if (totalEvents === 0) {
		return {
			totalEvents: 0,
			dateRange: { start: new Date(), end: new Date(), days: 0 },
			eventsPerYear: 0,
			density: "sparse",
		};
	}

	const dates = events
		.map((e) => e.date)
		.sort((a, b) => a.getTime() - b.getTime());
	const start = dates[0];
	const end = dates[dates.length - 1];
	const days = Math.ceil(
		(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
	);

	const years = Math.max(1, end.getFullYear() - start.getFullYear());
	const eventsPerYear = totalEvents / years;

	let density: "sparse" | "normal" | "dense" = "normal";
	if (eventsPerYear < 5) density = "sparse";
	else if (eventsPerYear > 20) density = "dense";

	return {
		totalEvents,
		dateRange: { start, end, days },
		eventsPerYear,
		density,
	};
}


