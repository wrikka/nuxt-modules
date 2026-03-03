import { ref, computed, reactive, readonly } from "vue";
import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { createOverlayComparison } from './chart-comparison-overlay';
import { createSideBySideComparison } from './chart-comparison-side-by-side';
import { createDifferenceComparison } from './chart-comparison-difference';
import { createRatioComparison } from './chart-comparison-ratio';
import { createCorrelationComparison } from './chart-comparison-correlation';

/**
 * Comparison mode
 */
export type ComparisonMode =
	| "overlay"
	| "side-by-side"
	| "difference"
	| "ratio"
	| "correlation";

/**
 * Comparison options
 */
export interface ComparisonOptions {
	mode: ComparisonMode;
	baselineIndex?: number;
	normalize?: boolean;
	showDifference?: boolean;
	showCorrelation?: boolean;
	correlationMethod?: "pearson" | "spearman";
	syncScales?: boolean;
	highlightDifferences?: boolean;
}

/**
 * Comparison result
 */
export interface ComparisonResult {
	combinedData: ChartData;
	differences: ChartData | null;
	correlations: Record<string, number> | null;
	statistics: {
		maxDifference: number;
		avgDifference: number;
		correlationStrength: "weak" | "moderate" | "strong" | "very-strong";
	};
}

/**
 * Composable for comparative chart analysis
 */
export function useChartComparison(
	charts: ChartData[],
	options: ComparisonOptions,
) {
	const defaults: ComparisonOptions = {
		mode: "overlay",
		baselineIndex: 0,
		normalize: false,
		showDifference: true,
		showCorrelation: true,
		correlationMethod: "pearson",
		syncScales: true,
		highlightDifferences: false,
	};

	const comparisonOptions = reactive<ComparisonOptions>({
		...defaults,
		...options,
	});

	const comparisonResult = computed<ComparisonResult>(() => {
		if (charts.length < 2) {
			return {
				combinedData: charts[0] || { series: [] },
				differences: null,
				correlations: null,
				statistics: {
					maxDifference: 0,
					avgDifference: 0,
					correlationStrength: "weak",
				},
			};
		}

		switch (comparisonOptions.mode) {
			case "overlay":
				return createOverlayComparison(charts, comparisonOptions);
			case "side-by-side":
				return createSideBySideComparison(charts, comparisonOptions);
			case "difference":
				return createDifferenceComparison(charts, comparisonOptions);
			case "ratio":
				return createRatioComparison(charts, comparisonOptions);
			case "correlation":
				return createCorrelationComparison(charts, comparisonOptions);
			default:
				return createOverlayComparison(charts, comparisonOptions);
		}
	});

	/**
	 * Update comparison options
	 */
	function updateOptions(newOptions: Partial<ComparisonOptions>) {
		Object.assign(comparisonOptions, newOptions);
	}

	/**
	 * Get available comparison modes
	 */
	function getAvailableModes(): ComparisonMode[] {
		return ["overlay", "side-by-side", "difference", "ratio", "correlation"];
	}

	return {
		comparisonResult,
		comparisonOptions: readonly(comparisonOptions),
		updateOptions,
		getAvailableModes,
	};
}
