import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { AnalyticsEvent, CommandAnalytics } from '../types'

const STORAGE_KEY = 'palette-analytics'
const events = ref<AnalyticsEvent[]>([])

export interface UseCommandAnalyticsReturn {
	/** All analytics events */
	events: Ref<AnalyticsEvent[]>
	/** Record an event */
	recordEvent: (event: Omit<AnalyticsEvent, 'timestamp'>) => void
	/** Get analytics summary */
	getAnalytics: () => CommandAnalytics
	/** Get top commands */
	getTopCommands: (limit?: number) => { commandId: string; count: number }[]
	/** Get search patterns */
	getSearchPatterns: (limit?: number) => { query: string; count: number }[]
	/** Get command stats */
	getCommandStats: (commandId: string) => {
		executions: number
		avgDuration: number
		lastExecuted: number | undefined
	}
	/** Clear analytics */
	clearAnalytics: () => void
	/** Export analytics */
	exportAnalytics: () => string
}

export function useCommandAnalytics(): UseCommandAnalyticsReturn {
	const loadEvents = () => {
		if (typeof localStorage !== 'undefined') {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				try {
					events.value = JSON.parse(stored)
				} catch {
					events.value = []
				}
			}
		}
	}

	const saveEvents = () => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(events.value))
		}
	}

	const recordEvent = (event: Omit<AnalyticsEvent, 'timestamp'>) => {
		events.value.push({
			...event,
			timestamp: Date.now(),
		})

		// Keep only last 1000 events
		if (events.value.length > 1000) {
			events.value = events.value.slice(-1000)
		}

		saveEvents()
	}

	const getAnalytics = (): CommandAnalytics => {
		const executions = events.value.filter(e => e.event === 'execute')
		const searches = events.value.filter(e => e.event === 'search')

		// Top commands
		const commandCounts = new Map<string, number>()
		for (const e of executions) {
			commandCounts.set(e.commandId, (commandCounts.get(e.commandId) || 0) + 1)
		}
		const topCommands = Array.from(commandCounts.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10)
			.map(([commandId, count]) => ({ commandId, count }))

		// Search patterns
		const queryCounts = new Map<string, number>()
		for (const s of searches) {
			if (s.query) {
				queryCounts.set(s.query, (queryCounts.get(s.query) || 0) + 1)
			}
		}
		const searchPatterns = Array.from(queryCounts.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10)
			.map(([query, count]) => ({ query, count }))

		// Average execution time
		const durations = executions.filter(e => e.duration).map(e => e.duration!)
		const avgExecutionTime = durations.length > 0
			? durations.reduce((a, b) => a + b, 0) / durations.length
			: 0

		// Chain stats
		const chainCounts = new Map<string, number>()
		for (const e of events.value.filter(e => e.event === 'chain')) {
			chainCounts.set(e.commandId, (chainCounts.get(e.commandId) || 0) + 1)
		}
		const chainStats = Array.from(chainCounts.entries())
			.map(([chainId, executions]) => ({ chainId, executions }))

		return {
			totalExecutions: executions.length,
			topCommands,
			searchPatterns,
			avgExecutionTime,
			chainStats,
		}
	}

	const getTopCommands = (limit = 10) => {
		const counts = new Map<string, number>()
		for (const e of events.value.filter(e => e.event === 'execute')) {
			counts.set(e.commandId, (counts.get(e.commandId) || 0) + 1)
		}
		return Array.from(counts.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, limit)
			.map(([commandId, count]) => ({ commandId, count }))
	}

	const getSearchPatterns = (limit = 10) => {
		const counts = new Map<string, number>()
		for (const e of events.value.filter(e => e.event === 'search')) {
			if (e.query) {
				counts.set(e.query, (counts.get(e.query) || 0) + 1)
			}
		}
		return Array.from(counts.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, limit)
			.map(([query, count]) => ({ query, count }))
	}

	const getCommandStats = (commandId: string) => {
		const commandEvents = events.value.filter(e => e.commandId === commandId)
		const executions = commandEvents.filter(e => e.event === 'execute')
		const durations = executions.filter(e => e.duration).map(e => e.duration!)

		return {
			executions: executions.length,
			avgDuration: durations.length > 0
				? durations.reduce((a, b) => a + b, 0) / durations.length
				: 0,
			lastExecuted: executions.length > 0
				? Math.max(...executions.map(e => e.timestamp))
				: undefined,
		}
	}

	const clearAnalytics = () => {
		events.value = []
		saveEvents()
	}

	const exportAnalytics = () => {
		return JSON.stringify({
			events: events.value,
			summary: getAnalytics(),
		}, null, 2)
	}

	// Load on init
	loadEvents()

	return {
		events,
		recordEvent,
		getAnalytics,
		getTopCommands,
		getSearchPatterns,
		getCommandStats,
		clearAnalytics,
		exportAnalytics,
	}
}
