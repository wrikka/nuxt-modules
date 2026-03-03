import type { ChartConfig } from '@/module/app/types/chart-basic';
import { DEFAULT_COLORS, DEFAULT_CHART_DIMENSIONS } from './chart-constants';

/**
 * Get color for series index
 */
export function getSeriesColor(index: number): string {
	return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

/**
 * Create chart config with defaults
 */
export function createChartConfig(
	overrides: Partial<ChartConfig> = {},
): ChartConfig {
	return {
		type: "bar",
		width: DEFAULT_CHART_DIMENSIONS.width,
		height: DEFAULT_CHART_DIMENSIONS.height,
		colors: DEFAULT_COLORS,
		showLegend: true,
		showGrid: true,
		animated: true,
		...overrides,
	};
}
