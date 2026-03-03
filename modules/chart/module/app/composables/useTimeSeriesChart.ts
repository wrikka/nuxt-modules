import { ref, computed, reactive, readonly } from "vue";
import {
	generateTimeSeriesData,
	fillTimeSeriesGaps,
	applyRollingWindow,
	filterTimeSeriesByRange,
	groupTimeSeriesByGranularity,
	detectTimeSeriesAnomalies,
	timeSeriesToChartData,
	type TimeSeriesPoint,
	type TimeRange,
	type TimeSeriesOptions,
} from "../utils/time-series";
import type { ChartData } from '@/module/app/types/chart-basic';

/**
 * Time series composable state
 */
interface TimeSeriesState {
	points: TimeSeriesPoint[];
	filteredPoints: TimeSeriesPoint[];
	timeRange: TimeRange | null;
	granularity: "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
	showAnomalies: boolean;
	rollingWindow: number;
	anomalies: TimeSeriesPoint[];
}

/**
 * Composable for enhanced time series features
 */
export function useTimeSeriesChart(
	initialOptions: TimeSeriesOptions & {
		initialRange?: TimeRange;
		autoGenerate?: boolean;
	} = {},
) {
	const {
		initialRange,
		autoGenerate = false,
		...timeSeriesOptions
	} = initialOptions;

	const state = reactive<TimeSeriesState>({
		points: [],
		filteredPoints: [],
		timeRange: initialRange || null,
		granularity: timeSeriesOptions.granularity || "day",
		showAnomalies: true,
		rollingWindow: 0,
		anomalies: [],
	});

	const chartData = computed<ChartData>(() => {
		const pointsToUse =
			state.filteredPoints.length > 0 ? state.filteredPoints : state.points;
		const points = state.showAnomalies
			? [...pointsToUse, ...state.anomalies]
			: pointsToUse;
		return timeSeriesToChartData(points);
	});

	/**
	 * Generate new time series data
	 */
	const generateData = (
		startDate: Date,
		endDate: Date,
		options?: TimeSeriesOptions,
	) => {
		const mergedOptions = { ...timeSeriesOptions, ...options };
		state.points = generateTimeSeriesData(startDate, endDate, mergedOptions);
		updateFilteredPoints();
		detectAnomalies();
	};

	/**
	 * Set time series data directly
	 */
	const setData = (points: TimeSeriesPoint[]) => {
		state.points = [...points];
		updateFilteredPoints();
		detectAnomalies();
	};

	/**
	 * Update filtered points based on current filters
	 */
	const updateFilteredPoints = () => {
		let filtered = [...state.points];

		// Apply time range filter
		if (state.timeRange) {
			filtered = filterTimeSeriesByRange(filtered, state.timeRange);
		}

		// Apply granularity grouping
		if (state.granularity !== "second") {
			filtered = groupTimeSeriesByGranularity(
				filtered,
				state.granularity as "hour" | "day" | "week" | "month" | "year",
			);
		}

		// Apply rolling window
		if (state.rollingWindow > 1) {
			filtered = applyRollingWindow(filtered, state.rollingWindow);
		}

		// Fill gaps if requested
		if (timeSeriesOptions.fillGaps) {
			filtered = fillTimeSeriesGaps(
				filtered,
				timeSeriesOptions.interpolateMethod,
			);
		}

		state.filteredPoints = filtered;
	};

	/**
	 * Set time range filter
	 */
	const setTimeRange = (range: TimeRange | null) => {
		state.timeRange = range;
		updateFilteredPoints();
	};

	/**
	 * Set granularity for grouping
	 */
	const setGranularity = (granularity: TimeSeriesState["granularity"]) => {
		state.granularity = granularity;
		updateFilteredPoints();
	};

	/**
	 * Set rolling window size
	 */
	const setRollingWindow = (window: number) => {
		state.rollingWindow = window;
		updateFilteredPoints();
	};

	/**
	 * Toggle anomaly display
	 */
	const toggleAnomalies = (show: boolean) => {
		state.showAnomalies = show;
	};

	/**
	 * Detect anomalies in current data
	 */
	const detectAnomalies = () => {
		const { anomalies } = detectTimeSeriesAnomalies(state.points);
		state.anomalies = anomalies;
	};

	/**
	 * Get data statistics
	 */
	const getStatistics = () => {
		const points = state.filteredPoints;
		if (points.length === 0) return null;

		const values = points.map((p) => p.value);
		const timestamps = points.map((p) => p.timestamp.getTime());

		return {
			count: points.length,
			min: Math.min(...values),
			max: Math.max(...values),
			mean: values.reduce((a, b) => a + b, 0) / values.length,
			median: [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)],
			startDate: new Date(Math.min(...timestamps)),
			endDate: new Date(Math.max(...timestamps)),
			duration: Math.max(...timestamps) - Math.min(...timestamps),
			anomalies: state.anomalies.length,
		};
	};

	/**
	 * Export time series data
	 */
	const exportData = (format: "json" | "csv" = "json") => {
		const data = state.filteredPoints;

		if (format === "csv") {
			const headers = ["timestamp", "value", "quality", "source"];
			const rows = data.map((point) => [
				point.timestamp.toISOString(),
				point.value.toString(),
				point.metadata?.quality?.toString() || "",
				point.metadata?.source || "",
			]);

			return [headers, ...rows].map((row) => row.join(",")).join("\n");
		}

		return JSON.stringify(data, null, 2);
	};

	// Auto-generate data if requested
	if (autoGenerate && initialRange) {
		generateData(initialRange.start, initialRange.end);
	}

	return {
		// State
		chartData,
		timeSeriesState: readonly(state),

		// Methods
		generateData,
		setData,
		setTimeRange,
		setGranularity,
		setRollingWindow,
		toggleAnomalies,
		getStatistics,
		exportData,

		// Computed
		hasData: computed(() => state.points.length > 0),
		filteredCount: computed(() => state.filteredPoints.length),
		anomalyCount: computed(() => state.anomalies.length),
	};
}
