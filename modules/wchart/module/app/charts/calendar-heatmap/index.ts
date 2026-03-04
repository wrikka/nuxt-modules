import type { CalendarHeatmapData, ChartData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Calendar heatmap utilities and data generation
 */

/**
 * Generate calendar heatmap data from date-value pairs
 */
export function generateCalendarHeatmapData(
	data: Array<{ date: Date; value: number; color?: string }>,
	options: {
		year?: number;
		month?: number;
		title?: string;
		colors?: string[];
		minValue?: number;
		maxValue?: number;
		cellSize?: number;
	} = {},
): CalendarHeatmapData {
	const {
		year,
		month,
		title,
		colors,
		minValue,
		maxValue,
		cellSize = 12,
	} = options;

	// Filter data for specific year/month if provided
	let filteredData = data;
	if (year !== undefined) {
		filteredData = data.filter((item) => item.date.getFullYear() === year);
	}
	if (month !== undefined) {
		filteredData = filteredData.filter(
			(item) => item.date.getMonth() === month,
		);
	}

	// Create data structure for chart
	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Calendar Heatmap",
				data: filteredData.map((item) => ({
					x: item.date.toISOString().split("T")[0], // YYYY-MM-DD format
					y: item.value,
					color: item.color,
				})),
				type: "calendarHeatmap",
			},
		],
	};

	return {
		...chartData,
		data: filteredData,
		year,
		month,
		cellSize,
	};
}

/**
 * Generate calendar heatmap from simple date-value array
 */
export function generateCalendarHeatmapFromArray(
	dates: string[],
	values: number[],
	options: {
		year?: number;
		month?: number;
		title?: string;
		colors?: string[];
		minValue?: number;
		maxValue?: number;
		cellSize?: number;
	} = {},
): CalendarHeatmapData {
	const data = dates.map((dateStr, index) => ({
		date: new Date(dateStr),
		value: values[index],
	}));

	return generateCalendarHeatmapData(data, options);
}

/**
 * Generate calendar heatmap for a specific month
 */
export function generateMonthlyCalendarHeatmap(
	year: number,
	month: number,
	data: Array<{ day: number; value: number }>,
	options: {
		title?: string;
		colors?: string[];
		minValue?: number;
		maxValue?: number;
		cellSize?: number;
	} = {},
): CalendarHeatmapData {
	const heatmapData = data.map((item) => ({
		date: new Date(year, month, item.day),
		value: item.value,
	}));

	return generateCalendarHeatmapData(heatmapData, { ...options, year, month });
}

/**
 * Generate calendar heatmap for a full year
 */
export function generateYearlyCalendarHeatmap(
	year: number,
	data: Array<{ date: Date; value: number }>,
	options: {
		title?: string;
		colors?: string[];
		minValue?: number;
		maxValue?: number;
		cellSize?: number;
	} = {},
): CalendarHeatmapData {
	return generateCalendarHeatmapData(data, { ...options, year });
}

/**
 * Get calendar layout for a month (helper function)
 */
export function getCalendarLayout(
	year: number,
	month: number,
): {
	days: number[];
	weeks: number[][];
	startDay: number;
	totalDays: number;
} {
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
	const totalDays = lastDay.getDate();

	const days = Array.from({ length: totalDays }, (_, i) => i + 1);

	// Create weeks array
	const weeks: number[][] = [];
	let week: number[] = [];

	// Add empty cells for days before the first day of the month
	for (let i = 0; i < startDay; i++) {
		week.push(0);
	}

	// Add days of the month
	for (let day = 1; day <= totalDays; day++) {
		week.push(day);
		if (week.length === 7) {
			weeks.push(week);
			week = [];
		}
	}

	// Fill the last week with empty cells if needed
	while (week.length < 7 && week.length > 0) {
		week.push(0);
	}
	if (week.length > 0) {
		weeks.push(week);
	}

	return {
		days,
		weeks,
		startDay,
		totalDays,
	};
}


