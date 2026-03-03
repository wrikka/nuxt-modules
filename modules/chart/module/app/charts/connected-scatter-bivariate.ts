import type { ConnectedScatterData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';
import { calculateRegressionLine } from './connected-scatter-utils';
import { generateConnectedScatterData } from './connected-scatter-data';

/**
 * Generate bivariate connected scatter (two variables)
 */
export function generateBivariateConnectedScatter(
	data: Array<{
		x: number;
		y: number;
		label?: string;
		time?: string | number | Date;
	}>,
	options: {
		title?: string;
		connectByTime?: boolean;
		showRegression?: boolean;
		regressionColor?: string;
	} = {},
): ConnectedScatterData {
	const {
		title,
		connectByTime = false,
		showRegression = false,
		regressionColor = "#ff6b6b",
	} = options;

	let points = data.map((item) => ({
		x: item.x,
		y: item.y,
		label: item.label,
		color: getSeriesColor(0),
	}));

	// Sort by time if connecting by time
	if (connectByTime) {
		points = data
			.sort((a, b) => {
				if (!a.time || !b.time) return 0;
				const aTime =
					typeof a.time === "string" ? new Date(a.time).getTime() : a.time;
				const bTime =
					typeof b.time === "string" ? new Date(b.time).getTime() : b.time;
				return aTime - bTime;
			})
			.map((item) => ({
				x: item.x,
				y: item.y,
				label: item.label,
				color: getSeriesColor(0),
			}));
	}

	const result = generateConnectedScatterData(points, {
		title,
		connectPoints: connectByTime,
	});

	// Add regression line if requested
	if (showRegression && points.length > 2) {
		const regressionLine = calculateRegressionLine(points);
		if (regressionLine) {
			result.series.push({
				name: "Regression Line",
				data: regressionLine,
				type: "line",
			});
		}
	}

	return result;
}


