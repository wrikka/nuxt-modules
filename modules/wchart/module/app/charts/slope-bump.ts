import type { ChartData, ChartType } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate bump chart (alternative slope visualization)
 */
export function generateBumpSlopeData(
	rankings: Array<{
		time: string | number | Date;
		ranks: Array<{ name: string; rank: number; value?: number }>;
	}>,
	options: {
		title?: string;
		connectLines?: boolean;
		showValues?: boolean;
	} = {},
): ChartData {
	const { title, connectLines = true, showValues = false } = options;

	// Group by item name
	const itemMap = new Map<
		string,
		Array<{ time: string | number | Date; rank: number; value?: number }>
	>();

	rankings.forEach((timePoint) => {
		timePoint.ranks.forEach((item) => {
			if (!itemMap.has(item.name)) {
				itemMap.set(item.name, []);
			}
			itemMap.get(item.name)!.push({
				time: timePoint.time,
				rank: item.rank,
				value: item.value,
			});
		});
	});

	// Create series for each item
	const series = Array.from(itemMap.entries()).map(([name, points], index) => ({
		name,
		data: points
			.sort((a, b) => {
				// Sort by time
				const aTime =
					typeof a.time === "string" ? new Date(a.time).getTime() : a.time;
				const bTime =
					typeof b.time === "string" ? new Date(b.time).getTime() : b.time;
				return (aTime as number) - (bTime as number);
			})
			.map((point) => ({
				x: point.time,
				y: point.rank,
				label:
					showValues && point.value !== undefined
						? point.value.toString()
						: undefined,
				color: getSeriesColor(index),
			})),
		type: (connectLines ? "line" : "scatter") as ChartType,
	}));

	return {
		title: title || "Bump Chart",
		series,
	};
}
