import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { SearchFilters, Command, SearchFilter } from '../types'

export interface UseSearchFiltersReturn {
	/** Active filters */
	filters: Ref<SearchFilters>
	/** Current filter type */
	activeFilter: Ref<SearchFilter>
	/** Available filter types */
	filterTypes: SearchFilter[]
	/** Set filter type */
	setFilterType: (type: SearchFilter) => void
	/** Add file filter */
	addFileFilter: (file: string) => void
	/** Remove file filter */
	removeFileFilter: (file: string) => void
	/** Add tag filter */
	addTagFilter: (tag: string) => void
	/** Remove tag filter */
	removeTagFilter: (tag: string) => void
	/** Set action type filter */
	setActionTypeFilter: (type: string) => void
	/** Set group filter */
	setGroupFilter: (group: string) => void
	/** Clear all filters */
	clearFilters: () => void
	/** Parse query for filter syntax */
	parseQuery: (query: string) => { query: string; filters: SearchFilters }
	/** Filter commands */
	filterCommands: (commands: Command[], filters: SearchFilters) => Command[]
	/** Filtered commands based on current filters */
	filteredCommands: Ref<Command[]>
}

export function useSearchFilters(
	allCommands: Ref<Command[]>
): UseSearchFiltersReturn {
	const filters = ref<SearchFilters>({})
	const activeFilter = ref<SearchFilter>('all')

	const filterTypes: SearchFilter[] = [
		'all',
		'files',
		'tags',
		'actions',
		'recent',
		'pinned',
	]

	const setFilterType = (type: SearchFilter) => {
		activeFilter.value = type
	}

	const addFileFilter = (file: string) => {
		if (!filters.value.files) filters.value.files = []
		if (!filters.value.files.includes(file)) {
			filters.value.files.push(file)
		}
	}

	const removeFileFilter = (file: string) => {
		if (filters.value.files) {
			filters.value.files = filters.value.files.filter(f => f !== file)
		}
	}

	const addTagFilter = (tag: string) => {
		if (!filters.value.tags) filters.value.tags = []
		if (!filters.value.tags.includes(tag)) {
			filters.value.tags.push(tag)
		}
	}

	const removeTagFilter = (tag: string) => {
		if (filters.value.tags) {
			filters.value.tags = filters.value.tags.filter(t => t !== tag)
		}
	}

	const setActionTypeFilter = (type: string) => {
		filters.value.actionType = type
	}

	const setGroupFilter = (group: string) => {
		filters.value.group = group
	}

	const clearFilters = () => {
		filters.value = {}
		activeFilter.value = 'all'
	}

	const parseQuery = (query: string): { query: string; filters: SearchFilters } => {
		const result: SearchFilters = {}
		let cleanQuery = query

		// @file pattern
		const fileMatches = query.match(/@(\S+)/g)
		if (fileMatches) {
			result.files = fileMatches.map(m => m.slice(1))
			cleanQuery = cleanQuery.replace(/@\S+/g, '').trim()
		}

		// #tag pattern
		const tagMatches = query.match(/#(\S+)/g)
		if (tagMatches) {
			result.tags = tagMatches.map(m => m.slice(1))
			cleanQuery = cleanQuery.replace(/#\S+/g, '').trim()
		}

		// >action pattern
		const actionMatch = query.match(/>action:(\S+)/)
		if (actionMatch) {
			result.actionType = actionMatch[1]
			cleanQuery = cleanQuery.replace(/>action:\S+/g, '').trim()
		}

		// group: pattern
		const groupMatch = query.match(/group:(\S+)/)
		if (groupMatch) {
			result.group = groupMatch[1]
			cleanQuery = cleanQuery.replace(/group:\S+/g, '').trim()
		}

		return { query: cleanQuery, filters: result }
	}

	const filterCommands = (commands: Command[], filterSet: SearchFilters): Command[] => {
		let result = commands

		if (filterSet.files?.length) {
			result = result.filter(c =>
				filterSet.files?.some(f =>
					c.context?.includes(f) || c.name?.includes(f)
				)
			)
		}

		if (filterSet.tags?.length) {
			result = result.filter(c =>
				filterSet.tags?.some(t =>
					c.keywords?.includes(t) || c.group?.includes(t)
				)
			)
		}

		if (filterSet.actionType) {
			result = result.filter(c =>
				c.name?.includes(filterSet.actionType || '')
			)
		}

		if (filterSet.group) {
			result = result.filter(c => c.group === filterSet.group)
		}

		return result
	}

	const filteredCommands = computed(() => {
		return filterCommands(allCommands.value, filters.value)
	})

	return {
		filters,
		activeFilter,
		filterTypes,
		setFilterType,
		addFileFilter,
		removeFileFilter,
		addTagFilter,
		removeTagFilter,
		setActionTypeFilter,
		setGroupFilter,
		clearFilters,
		parseQuery,
		filterCommands,
		filteredCommands,
	}
}
