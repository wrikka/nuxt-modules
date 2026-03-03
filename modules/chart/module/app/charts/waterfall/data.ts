import type { DataPoint, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate waterfall chart data from steps
 */
export function generateWaterfallData(
	steps: Array<{
		name: string;
		value: number;
		color?: string;
		isTotal?: boolean;
	}>,
	options: {
		title?: string;
		initialValue?: number;
		showRunningTotal?: boolean;
	} = {},
): ChartData {
	const { title, initialValue = 0, showRunningTotal = true } = options;

	const data: DataPoint[] = [];
	let runningTotal = initialValue;

	// Add initial value if specified
	if (initialValue !== 0) {
		data.push({
			x: "Start",
			y: initialValue,
			color: getSeriesColor(0),
		});
	}

	steps.forEach((step, index) => {
		data.push({
			x: step.name,
			y: step.value,
			color: step.color || getSeriesColor(index + 1),
		});

		if (showRunningTotal && !step.isTotal) {
			runningTotal += step.value;
		}
	});

	// Add final total if requested
	if (
		showRunningTotal &&
		steps.length > 0 &&
		!steps[steps.length - 1].isTotal
	) {
		data.push({
			x: "Total",
			y: runningTotal,
			color: getSeriesColor(data.length),
		});
	}

	return {
		title,
		series: [
			{
				name: "Waterfall",
				data,
				type: "waterfall",
			},
		],
	};
}

/**
 * Generate waterfall chart from start and end values with contributions
 */
export function generateWaterfallFromContributions(
	startValue: number,
	contributions: Array<{
		name: string;
		value: number;
		color?: string;
	}>,
	endValue?: number,
): ChartData {
	const calculatedEndValue =
		endValue ?? startValue + contributions.reduce((sum, c) => sum + c.value, 0);

	// Add a final adjustment step if needed
	const totalContributions = contributions.reduce((sum, c) => sum + c.value, 0);
	const adjustment = calculatedEndValue - (startValue + totalContributions);

	const steps: Array<{
		name: string;
		value: number;
		color?: string;
		isTotal?: boolean;
	}> = [{ name: "Start", value: startValue, color: getSeriesColor(0) }];

	contributions.forEach((contribution, index) => {
		steps.push({
			name: contribution.name,
			value: contribution.value,
			color: contribution.color || getSeriesColor(index + 1),
		});
	});

	if (adjustment !== 0) {
		steps.push({
			name: "Adjustment",
			value: adjustment,
			color: getSeriesColor(steps.length),
		});
	}

	steps.push({
		name: "End",
		value: calculatedEndValue,
		color: getSeriesColor(steps.length),
		isTotal: true,
	});

	return generateWaterfallData(steps, { showRunningTotal: false });
}

/**
 * Generate bridge waterfall chart (showing how components contribute to difference)
 */
export function generateBridgeWaterfall(
	startValue: number,
	endValue: number,
	components: Array<{
		name: string;
		value: number;
		color?: string;
	}>,
): ChartData {
	const difference = endValue - startValue;

	// Calculate the unexplained portion
	const explained = components.reduce((sum, c) => sum + c.value, 0);
	const unexplained = difference - explained;

	const steps: Array<{
		name: string;
		value: number;
		color?: string;
		isTotal?: boolean;
	}> = [{ name: "Start", value: startValue, color: getSeriesColor(0) }];

	components.forEach((component, index) => {
		steps.push({
			name: component.name,
			value: component.value,
			color: component.color || getSeriesColor(index + 1),
		});
	});

	if (unexplained !== 0) {
		steps.push({
			name: "Unexplained",
			value: unexplained,
			color: getSeriesColor(steps.length),
		});
	}

	steps.push({
		name: "End",
		value: endValue,
		color: getSeriesColor(steps.length),
		isTotal: true,
	});

	return generateWaterfallData(steps, { showRunningTotal: false });
}

/**
 * Generate horizontal waterfall chart data
 */
export function generateHorizontalWaterfallData(
	steps: Array<{
		name: string;
		value: number;
		color?: string;
	}>,
	options: {
		title?: string;
	} = {},
): ChartData {
	const { title } = options;

	// For horizontal layout, we still use the same data structure
	// The rendering would handle the orientation
	const data: DataPoint[] = steps.map((step, index) => ({
		x: step.name,
		y: step.value,
		color: step.color || getSeriesColor(index),
	}));

	return {
		title,
		series: [
			{
				name: "Horizontal Waterfall",
				data,
				type: "waterfall",
			},
		],
	};
}


