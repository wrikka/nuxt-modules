export interface FilterOption {
	id: string;
	label: string;
	type: "select" | "multiselect" | "range" | "date" | "boolean" | "text";
	options?: { label: string; value: string }[];
	min?: number;
	max?: number;
	defaultValue?: any;
}

export interface FilterState {
	[key: string]: any;
}

export function useAdvancedFilters() {
	const filterState = ref<FilterState>({});
	const activeFilters = ref<Set<string>>(new Set());

	const filterOptions = ref<FilterOption[]>([
		{
			id: "type",
			label: "Type",
			type: "multiselect",
			options: [
				{ label: "Projects", value: "project" },
				{ label: "Assets", value: "asset" },
				{ label: "Templates", value: "template" },
				{ label: "Brand Kits", value: "brand_kit" },
			],
		},
		{
			id: "dateRange",
			label: "Date Range",
			type: "date",
		},
		{
			id: "tags",
			label: "Tags",
			type: "multiselect",
			options: [],
		},
		{
			id: "createdBy",
			label: "Created By",
			type: "select",
			options: [],
		},
		{
			id: "status",
			label: "Status",
			type: "select",
			options: [
				{ label: "Active", value: "active" },
				{ label: "Archived", value: "archived" },
				{ label: "Draft", value: "draft" },
				{ label: "Published", value: "published" },
			],
		},
		{
			id: "size",
			label: "Size",
			type: "range",
			min: 0,
			max: 100,
		},
	]);

	const setFilter = (key: string, value: any) => {
		filterState.value = { ...filterState.value, [key]: value };
		activeFilters.value.add(key);
	};

	const removeFilter = (key: string) => {
		const newState = { ...filterState.value };
		delete newState[key];
		filterState.value = newState;
		activeFilters.value.delete(key);
	};

	const clearAllFilters = () => {
		filterState.value = {};
		activeFilters.value.clear();
	};

	const resetToDefaults = () => {
		const defaults: FilterState = {};
		filterOptions.value.forEach(option => {
			if (option.defaultValue !== undefined) {
				defaults[option.id] = option.defaultValue;
			}
		});
		filterState.value = defaults;
		activeFilters.value.clear();
	};

	const getFilterValue = (key: string) => {
		return filterState.value[key];
	};

	const hasActiveFilters = computed(() => activeFilters.value.size > 0);

	const getActiveFilterCount = computed(() => activeFilters.value.size);

	const getFilterQuery = () => {
		const query: Record<string, any> = {};
		Object.entries(filterState.value).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				query[key] = value;
			}
		});
		return query;
	};

	const loadFilterOptions = async (optionId: string) => {
		try {
			const data = await $fetch<{ options: Array<{ label: string; value: string }> }>(
				`/api/filters/${optionId}/options`,
			);
			const option = filterOptions.value.find(o => o.id === optionId);
			if (option) {
				option.options = data.options;
			}
		} catch (error) {
			console.error(`Failed to load filter options for ${optionId}:`, error);
		}
	};

	const saveFilterPreset = async (name: string) => {
		try {
			await $fetch("/api/filters/presets", {
				method: "POST",
				body: { name, filters: filterState.value },
			});
			return true;
		} catch (error) {
			console.error("Failed to save filter preset:", error);
			return false;
		}
	};

	const loadFilterPreset = async (presetId: string) => {
		try {
			const data = await $fetch<{ preset: { name: string; filters: FilterState } }>(`/api/filters/presets/${presetId}`);
			filterState.value = data.preset.filters;
			activeFilters.value = new Set(Object.keys(data.preset.filters));
			return true;
		} catch (error) {
			console.error("Failed to load filter preset:", error);
			return false;
		}
	};

	return {
		filterState,
		filterOptions,
		activeFilters,
		hasActiveFilters,
		getActiveFilterCount,
		setFilter,
		removeFilter,
		clearAllFilters,
		resetToDefaults,
		getFilterValue,
		getFilterQuery,
		loadFilterOptions,
		saveFilterPreset,
		loadFilterPreset,
	};
}
