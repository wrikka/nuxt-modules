import type { DataPoint, ChartSeries, ChartData } from '../../../types/chart-basic';
import type { GroupConfig } from './types';

export function applyGrouping(
	data: ChartData,
	groupConfig: GroupConfig,
): ChartData {
	const { field, aggregate = "sum" } = groupConfig;
	const groupedSeries: ChartSeries[] = [];

	data.series.forEach((series) => {
		const groups = new Map<string, DataPoint[]>();

		// Group data points
		series.data.forEach((point) => {
			const groupKey = String(point[field] || "null");
			if (!groups.has(groupKey)) {
				groups.set(groupKey, []);
			}
			groups.get(groupKey)!.push(point);
		});

		// Aggregate groups
		const groupedData: DataPoint[] = [];
		groups.forEach((points, groupKey) => {
			const aggregatedPoint: DataPoint = {
				x: groupKey,
				y: aggregateValues(
					points.map((p) => p.y),
					aggregate,
				),
				label: `${groupKey} (${points.length} items)`,
			};
			groupedData.push(aggregatedPoint);
		});

		groupedSeries.push({
			...series,
			data: groupedData,
			name: `${series.name} (grouped by ${field})`,
		});
	});

	return {
		...data,
		series: groupedSeries,
	};
}

export function aggregateValues(
	values: (number | number[] | undefined)[],
	method: string,
): number {
	const numbers = values
		.flat()
		.filter((v) => typeof v === "number" && !isNaN(v)) as number[];

	if (numbers.length === 0) return 0;

	switch (method) {
		case "sum":
			return numbers.reduce((a, b) => a + b, 0);
		case "avg":
			return numbers.reduce((a, b) => a + b, 0) / numbers.length;
		case "count":
			return numbers.length;
		case "min":
			return Math.min(...numbers);
		case "max":
			return Math.max(...numbers);
		default:
			return numbers[0];
	}
}
