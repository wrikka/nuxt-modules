import { getSeriesColor } from "../../../utils/chart-utils.js";
import { generateSlopeData } from './slope-data';
import type { SlopeData } from './slope-data';

/**
 * Generate slope chart for time series comparison
 */
export function generateTimeSlopeData(
	series: Array<{
		name: string;
		data: Array<{ time: string | number | Date; value: number }>;
		color?: string;
	}>,
	options: {
		title?: string;
		timePoints?: [string | number | Date, string | number | Date];
		showTrend?: boolean;
	} = {},
): SlopeData {
	const { title, timePoints, showTrend = false } = options;

	const slopes: Array<{
		label: string;
		start: { x: string | number | Date; y: number };
		end: { x: string | number | Date; y: number };
		color?: string;
	}> = [];

	series.forEach((s, index) => {
		if (s.data.length >= 2) {
			let startPoint: { time: string | number | Date; value: number };
			let endPoint: { time: string | number | Date; value: number };

			if (timePoints) {
				// Use specified time points
				const startData = s.data.find((d) => d.time === timePoints[0]);
				const endData = s.data.find((d) => d.time === timePoints[1]);

				if (startData && endData) {
					startPoint = startData;
					endPoint = endData;
				} else {
					// Fallback to first and last
					startPoint = s.data[0];
					endPoint = s.data[s.data.length - 1];
				}
			} else {
				// Use first and last points
				startPoint = s.data[0];
				endPoint = s.data[s.data.length - 1];
			}

			slopes.push({
				label: s.name,
				start: { x: startPoint.time instanceof Date ? startPoint.time.getTime() : startPoint.time, y: startPoint.value },
				end: { x: endPoint.time instanceof Date ? endPoint.time.getTime() : endPoint.time, y: endPoint.value },
				color: s.color || getSeriesColor(index),
			});
		}
	});

	return generateSlopeData(slopes, { title });
}

