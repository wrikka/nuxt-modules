import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { CommandHistoryEntry } from '../types'

const MAX_HISTORY = 50
const STORAGE_KEY = 'palette-search-history'

export interface UseSearchHistoryReturn {
	/** Search history entries */
	history: Ref<CommandHistoryEntry[]>
	/** Add search query to history */
	addToHistory: (query: string) => void
	/** Clear all history */
	clearHistory: () => void
	/** Get recent searches (last N) */
	getRecent: (limit?: number) => CommandHistoryEntry[]
	/** Search within history */
	searchHistory: (searchTerm: string) => CommandHistoryEntry[]
	/** Remove specific entry */
	removeEntry: (query: string) => void
	/** History suggestions based on partial input */
	getSuggestions: (partial: string, limit?: number) => string[]
}

export function useSearchHistory(): UseSearchHistoryReturn {
	const history = ref<CommandHistoryEntry[]>([])

	const loadHistory = () => {
		if (typeof localStorage !== 'undefined') {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				try {
					history.value = JSON.parse(stored)
				} catch {
					history.value = []
				}
			}
		}
	}

	const saveHistory = () => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
		}
	}

	const addToHistory = (query: string) => {
		if (!query.trim()) return

		// Remove existing entry with same query
		history.value = history.value.filter(h => h.query !== query)

		// Add new entry at the beginning
		history.value.unshift({
			query,
			timestamp: Date.now(),
		})

		// Trim to max size
		if (history.value.length > MAX_HISTORY) {
			history.value = history.value.slice(0, MAX_HISTORY)
		}

		saveHistory()
	}

	const clearHistory = () => {
		history.value = []
		saveHistory()
	}

	const getRecent = (limit = 10): CommandHistoryEntry[] => {
		return history.value.slice(0, limit)
	}

	const searchHistory = (searchTerm: string): CommandHistoryEntry[] => {
		const term = searchTerm.toLowerCase()
		return history.value.filter(h =>
			h.query.toLowerCase().includes(term)
		)
	}

	const removeEntry = (query: string) => {
		history.value = history.value.filter(h => h.query !== query)
		saveHistory()
	}

	const getSuggestions = (partial: string, limit = 5): string[] => {
		if (!partial.trim()) return []

		const term = partial.toLowerCase()
		return history.value
			.filter(h => h.query.toLowerCase().startsWith(term))
			.map(h => h.query)
			.slice(0, limit)
	}

	// Load on init
	loadHistory()

	return {
		history,
		addToHistory,
		clearHistory,
		getRecent,
		searchHistory,
		removeEntry,
		getSuggestions,
	}
}
