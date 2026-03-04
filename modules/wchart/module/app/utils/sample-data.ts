import type {
	ChartData,
	ChartSeries,
	DataPoint,
	ChartType,
} from '@/module/app/types/chart-basic';
import { DEFAULT_COLORS } from './chart-constants';

/**
 * Generate random chart data for testing
 */
export function generateRandomData(
	seriesCount: number = 3,
	pointsCount: number = 10,
	min: number = 0,
	max: number = 100,
): ChartData {
	const series: ChartSeries[] = [];
	for (let i = 0; i < seriesCount; i++) {
		const data: DataPoint[] = [];
		for (let j = 0; j < pointsCount; j++) {
			data.push({
				x: j,
				y: Math.floor(Math.random() * (max - min + 1)) + min,
			});
		}
		series.push({
			name: `Series ${i + 1}`,
			data,
			color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
		});
	}
	return { series };
}

/**
 * Generate sample data for specific chart types
 */
export function generateSampleData(type: ChartType): ChartData {
	switch (type) {
		case "bar":
			return generateBarChartSample();
		case "line":
			return generateLineChartSample();
		case "pie":
			return generatePieChartSample();
		case "area":
			return generateAreaChartSample();
		case "scatter":
			return generateScatterPlotSample();
		default:
			return generateRandomData();
	}
}

/**
 * Generate bar chart sample data
 */
export function generateBarChartSample(): ChartData {
	return {
		title: "Monthly Sales",
		series: [
			{
				name: "Sales",
				data: [
					{ x: "Jan", y: 1200 },
					{ x: "Feb", y: 1900 },
					{ x: "Mar", y: 3000 },
					{ x: "Apr", y: 5000 },
					{ x: "May", y: 2000 },
					{ x: "Jun", y: 3000 },
				],
			},
		],
	};
}

/**
 * Generate line chart sample data
 */
export function generateLineChartSample(): ChartData {
	return {
		title: "Website Traffic",
		series: [
			{
				name: "Visitors",
				data: [
					{ x: 1, y: 100 },
					{ x: 2, y: 150 },
					{ x: 3, y: 200 },
					{ x: 4, y: 180 },
					{ x: 5, y: 250 },
					{ x: 6, y: 300 },
				],
			},
		],
	};
}

/**
 * Generate pie chart sample data
 */
export function generatePieChartSample(): ChartData {
	return {
		title: "Market Share",
		series: [
			{
				name: "Companies",
				data: [
					{ x: "Company A", y: 35 },
					{ x: "Company B", y: 25 },
					{ x: "Company C", y: 20 },
					{ x: "Company D", y: 15 },
					{ x: "Others", y: 5 },
				],
			},
		],
	};
}

/**
 * Generate area chart sample data
 */
export function generateAreaChartSample(): ChartData {
	return {
		title: "Revenue Growth",
		series: [
			{
				name: "Revenue",
				data: [
					{ x: 2019, y: 100000 },
					{ x: 2020, y: 120000 },
					{ x: 2021, y: 150000 },
					{ x: 2022, y: 180000 },
					{ x: 2023, y: 200000 },
				],
			},
		],
	};
}

/**
 * Generate scatter plot sample data
 */
export function generateScatterPlotSample(): ChartData {
	return {
		title: "Height vs Weight",
		series: [
			{
				name: "People",
				data: [
					{ x: 170, y: 65 },
					{ x: 175, y: 70 },
					{ x: 180, y: 75 },
					{ x: 165, y: 60 },
					{ x: 185, y: 80 },
				],
			},
		],
	};
}
