import type { ConnectedScatterData, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { generateConnectedScatterData } from './connected-scatter-data';

/**
 * Generate time series connected scatter
 */
export function generateTimeSeriesConnectedScatter(
	timeSeries: Array<{
		time: string | number | Date;
		value: number;
		label?: string;
		color?: string;
	}>,
	options: {
		title?: string;
		connectPoints?: boolean;
		showMovingAverage?: boolean;
		movingAveragePeriod?: number;
		movingAverageColor?: string;
	} = {},
): ConnectedScatterData {
	const {
		title,
		connectPoints = true,
		showMovingAverage = false,
		movingAveragePeriod = 5,
		movingAverageColor = "#4ecdc4",
	} = options;

	const points = timeSeries.map((item) => ({
		x: item.time,
		y: item.value,
		label: item.label,
		color: item.color || getSeriesColor(0),
	}));

	let optionsWithMA = { ...options };
	delete optionsWithMA.showMovingAverage;
	delete optionsWithMA.movingAveragePeriod;
	delete optionsWithMA.movingAverageColor;

	const data = generateConnectedScatterData(points, optionsWithMA);

	// Add moving average if requested
	if (showMovingAverage && points.length >= movingAveragePeriod) {
		const maPoints: DataPoint[] = [];

		for (let i = movingAveragePeriod - 1; i < points.length; i++) {
			const window = points.slice(i - movingAveragePeriod + 1, i + 1);
			const average = window.reduce((sum, p) => sum + p.y, 0) / window.length;

			maPoints.push({
				x: points[i].x,
				y: average,
				color: movingAverageColor,
			});
		}

		data.series.push({
			name: `Moving Average (${movingAveragePeriod})`,
			data: maPoints,
			type: "line",
		});
	}

	return data;
}


