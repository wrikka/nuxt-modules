import { ref, computed, reactive, readonly } from "vue";
import type { DataPoint, ChartSeries, ChartData } from '@/module/app/types/chart-basic';

export type { FilterOperator, SortDirection, FilterCondition, SortConfig, GroupConfig } from './data-filter/types';
import { matchesAllConditions, matchesCondition, matchesSearchQuery } from './data-filter/matchers';
import { sortDataPoints } from './data-filter/sorters';
import { applyGrouping } from './data-filter/groupers';

/**
 * Filter state
 */
interface FilterState {
	conditions: FilterCondition[];
	sortConfigs: SortConfig[];
	groupConfig: GroupConfig | null;
	limit: number | null;
	offset: number | null;
	searchQuery: string;
	searchFields: (keyof DataPoint)[];
}

/**
 * Composable for data filtering and sorting
 */
export function useChartDataFilter(
	initialData: ChartData,
	options: {
		enableSearch?: boolean;
		searchFields?: (keyof DataPoint)[];
		defaultLimit?: number;
	} = {},
) {
	const {
		enableSearch = true,
		searchFields = ["label"],
		defaultLimit,
	} = options;

	const originalData = ref<ChartData>(initialData);
	const state = reactive<FilterState>({
		conditions: [],
		sortConfigs: [],
		groupConfig: null,
		limit: defaultLimit || null,
		offset: null,
		searchQuery: "",
		searchFields,
	});

	/**
	 * Filtered and processed data
	 */
	const filteredData = computed<ChartData>(() => {
		let result = { ...originalData.value };
		result.series = originalData.value.series.map((series) => ({
			...series,
			data: [...series.data],
		}));

		// Apply filters
		result.series = result.series.map((series) => ({
			...series,
			data: series.data.filter((point) =>
				matchesAllConditions(point, state.conditions),
			),
		}));

		// Apply search
		if (enableSearch && state.searchQuery.trim()) {
			result.series = result.series.map((series) => ({
				...series,
				data: series.data.filter((point) =>
					matchesSearchQuery(point, state.searchQuery, state.searchFields),
				),
			}));
		}

		// Apply sorting
		if (state.sortConfigs.length > 0) {
			result.series = result.series.map((series) => ({
				...series,
				data: sortDataPoints(series.data, state.sortConfigs),
			}));
		}

		// Apply grouping
		if (state.groupConfig) {
			result = applyGrouping(result, state.groupConfig);
		}

		// Apply pagination
		if (state.limit !== null || state.offset !== null) {
			const offset = state.offset || 0;
			const limit = state.limit || result.series[0]?.data.length || 0;

			result.series = result.series.map((series) => ({
				...series,
				data: series.data.slice(offset, offset + limit),
			}));
		}

		return result;
	});


	// Filter methods
	const addFilter = (condition: FilterCondition) => {
		state.conditions.push(condition);
	};

	const removeFilter = (index: number) => {
		state.conditions.splice(index, 1);
	};

	const clearFilters = () => {
		state.conditions = [];
	};

	const setFilters = (conditions: FilterCondition[]) => {
		state.conditions = [...conditions];
	};

	// Sort methods
	const addSort = (config: SortConfig) => {
		state.sortConfigs.push(config);
	};

	const removeSort = (index: number) => {
		state.sortConfigs.splice(index, 1);
	};

	const clearSorts = () => {
		state.sortConfigs = [];
	};

	const setSorts = (configs: SortConfig[]) => {
		state.sortConfigs = [...configs];
	};

	// Other methods
	const setGroupBy = (config: GroupConfig | null) => {
		state.groupConfig = config;
	};

	const setLimit = (limit: number | null) => {
		state.limit = limit;
	};

	const setOffset = (offset: number | null) => {
		state.offset = offset;
	};

	const setSearchQuery = (query: string) => {
		state.searchQuery = query;
	};

	const updateData = (newData: ChartData) => {
		originalData.value = newData;
	};

	const getFilterSummary = () => {
		return {
			totalFilters: state.conditions.length,
			totalSorts: state.sortConfigs.length,
			hasGrouping: state.groupConfig !== null,
			hasSearch: state.searchQuery.trim().length > 0,
			limit: state.limit,
			offset: state.offset,
		};
	};

	return {
		// Reactive state
		filteredData,
		filterState: readonly(state),

		// Filter methods
		addFilter,
		removeFilter,
		clearFilters,
		setFilters,

		// Sort methods
		addSort,
		removeSort,
		clearSorts,
		setSorts,

		// Other methods
		setGroupBy,
		setLimit,
		setOffset,
		setSearchQuery,
		updateData,
		getFilterSummary,
	};
}
